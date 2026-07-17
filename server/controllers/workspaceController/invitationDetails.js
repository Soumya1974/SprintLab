import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Invitation } from "../../models/invitationDbSchema.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getInviteEmailTemplate } from "../../templates/getInviteEmailTemplate.js";
import bcrypt from 'bcrypt';

//Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASS_CODE,
    }
});

export const handleSendInvitation = async (req, res) => {
    try {
        const { email, role } = req.body;
        const workspaceId = req.params.workspaceData;
        const { id } = req.user;

        const normalizedEmail = email.toLowerCase().trim();

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        if (workspace.owner.toString() !== id) {
            return res.status(403).json({
                message: "You are not authorized to send invitations"
            });
        }

        const existingInvitation = await Invitation.findOne({
            workspaceId: workspace._id,
            email: normalizedEmail
        });

        if (existingInvitation) {
            return res.status(400).json({
                message: "User has already been invited to this workspace"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            const alreadyMember = workspace.members.some(
                member => member.user.toString() === existingUser._id.toString()
            );

            if (alreadyMember) {
                return res.status(400).json({
                    message: "User is already a member of this workspace"
                });
            }
        }

        const token = crypto.randomBytes(16).toString("hex");

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        const invitation = new Invitation({
            workspaceId: workspace._id,
            email: normalizedEmail,
            role,
            token,
            expiresAt,
            invitedBy: id
        });

        await invitation.save();

        const inviteLink =
            `${process.env.FRONTEND_URL}/invite/${token}`;

        await transporter.sendMail({
            from: `"SprintLab" <${process.env.EMAIL_ID}>`,
            to: normalizedEmail,
            subject: "SprintLab Invitation",
            text: `You have been invited to join ${workspace.title}.`,
            html: getInviteEmailTemplate({
                role,
                inviteLink,
                workspaceName: workspace.title
            })
        });

        return res.status(200).json({
            message: "Invitation sent successfully"
        });

    }

    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

export const handleGetInvitationDetails = async (req, res) => {
    try {
        const token = req.params;

        console.log(token);

        const invitation = await Invitation.findOne({ token })
            .populate("invitedBy", "name")
            .populate("workspaceId", "title");


        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found or expired"
            });
        }

        if (invitation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Invitation is no longer valid"
            });
        }

        return res.status(200).json({
            success: true,
            invitation: {
                workspaceName: invitation.workspaceId.title,
                invitedBy: invitation.invitedBy.name,
                role: invitation.role,
                email: invitation.email
            }
        });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const handleAcceptInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await Invitation.findOne({ token })
            .populate("workspaceId");

        if (!invitation) {
            return res.status(404).json({
                message: "Unable to find invitation"
            });
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = "expired";
            await invitation.save();

            return res.status(400).json({
                message: "Invitation has expired"
            });
        }

        if (invitation.status !== "pending") {
            return res.status(400).json({
                message: "Invitation is no longer valid"
            });
        }

        const alreadyMember = invitation.workspaceId.members.some(
            member => member.user.toString() === req.user.id
        );

        if (alreadyMember) {
            return res.status(400).json({
                message: "You are already a member"
            });
        }

        invitation.workspaceId.members.push({
            user: req.user.id,
            role: invitation.role
        });

        await invitation.workspaceId.save();

        invitation.status = "accepted";
        await invitation.save();

        return res.status(200).json({
            message: `You have joined as ${invitation.role}`
        });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
export const handleAcceptInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await Invitation.findOne({ token })
            .populate("workspaceId");

        if (!invitation) {
            return res.status(404).json({
                message: "Unable to find invitation"
            });
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = "expired";
            await invitation.save();

            return res.status(400).json({
                message: "Invitation has expired"
            });
        }

        if (invitation.status !== "pending") {
            return res.status(400).json({
                message: "Invitation is no longer valid"
            });
        }

        const alreadyMember = invitation.workspaceId.members.some(
            member => member.user.toString() === req.user.id
        );

        if (alreadyMember) {
            return res.status(400).json({
                message: "You are already a member"
            });
        }

        invitation.workspaceId.members.push({
            user: req.user.id,
            role: invitation.role
        });

        await invitation.workspaceId.save();

        invitation.status = "accepted";
        await invitation.save();

        return res.status(200).json({
            message: `You have joined as ${invitation.role}`
        });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}