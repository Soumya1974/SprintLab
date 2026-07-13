export function getInviteEmailTemplate({ role, inviteLink, workspaceName }) {
  const roleLabel = role === "team" ? "Team Member" : "Viewer";

  return `
  <div style="font-family: Arial, sans-serif; padding: 32px 0;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px;">
      <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px;">SprintLab</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Hello,</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
        You have been invited to join SprintLab workspace <strong>${workspaceName}</strong> as a <strong>${roleLabel}</strong>.
      </p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Click the link below to accept the invitation:
      </p>
      <a href="${inviteLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px;">
        Accept Invitation
      </a>
      <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 24px 0 16px;">
        This invitation expires in 7 days.
      </p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0;">
        Regards,<br />
        SprintLab Team
      </p>
    </div>
  </div>
  `;
}