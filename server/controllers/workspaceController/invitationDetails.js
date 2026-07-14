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
        const workspaceData = req.params.workspaceData;
        const { id } = req.user;

        const workspace = await Workspace.findById(workspaceData);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            })
        }

        const members = workspace.members.find(member => member.user._id.toString() === id);

        if (!members || members.role === "viewer" || members.role === "team" && workspace.owner.toString() !== id) {
            return res.status(403).json({
                message: "You are not authorized to send invitations"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            const isAlreadyMember = workspace.members.some(member => member.user.toString() === user._id.toString());

            if (isAlreadyMember) {
                return res.status(400).json({
                    message: "User is already a member of the workspace"
                })
            }

            const isInvited = await Invitation.findOne({ workspaceId: workspace._id, email: user.email });

            if (isInvited) {
                return res.status(400).json({
                    message: "User has already been invited to the workspace"
                })
            }

            const token = crypto.randomBytes(6).toString("hex");
            const hashedToken = await bcrypt.hash(token, 10);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

            const invitation = new Invitation({
                workspaceId: workspace._id,
                email: user.email,
                role: role,
                token: hashedToken,
                expiresAt: expiresAt,
                invitedBy: id
            });

            await invitation.save();

            await transporter.sendMail({
                from: `"SprintLab" <${process.env.EMAIL_ID}>`,
                to: email,
                subject: "SprintLab Invitation",
                text: `You have been invited to join the ${workspace.title} workspace.`,
                html: getInviteEmailTemplate({ role, inviteLink, workspaceName: workspace.title }),
            });

            return res.status(200).json({
                message: "Invitation sent successfully"
            })
        }
    }

    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}