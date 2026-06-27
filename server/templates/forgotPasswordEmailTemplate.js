export function forgotPasswordEmailTemplate(otp, { expiresInMinutes = 10 } = {}) {
    const digits = String(otp).split("");

    const digitCells = digits
        .map(
            (d) => `
        <td style="
          width:44px;
          height:52px;
          background-color: transparent;
          border:1px solid #bfdbfe;
          border-radius:8px;
          text-align:center;
          vertical-align:middle;
          font-family:Arial, Helvetica, sans-serif;
          font-size:22px;
          font-weight:700;
          color:#1e40af;
          letter-spacing:0;
        ">${d}</td>
        <td style="width:8px;"></td>`
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">

  <!-- preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your SprintLab reset password code expires in ${expiresInMinutes} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:32px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">

          <!-- header -->
          <tr>
            <td style="padding:28px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:18px; font-weight:700; color:#1e3a8a; font-family:Arial, Helvetica, sans-serif;">
                    SprintLab
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- divider -->
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <div style="border-top:1px solid #f1f5f9;"></div>
            </td>
          </tr>

          <!-- icon badge -->
          
          <!-- heading -->
          <tr>
            <td align="center" style="padding:20px 32px 0 32px;">
              <p style="margin:0; font-size:20px; font-weight:700; color:#1e293b; font-family:Arial, Helvetica, sans-serif;">
                Reset your password
              </p>
            </td>
          </tr>

          <!-- subcopy -->
          <tr>
            <td align="center" style="padding:8px 32px 0 32px;">
              <p style="margin:0; font-size:14px; line-height:22px; color:#64748b; font-family:Arial, Helvetica, sans-serif;">
                Enter this code to reset your password.
              </p>
            </td>
          </tr>

          <!-- OTP digit boxes -->
          <tr>
            <td align="center" style="padding:24px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${digitCells}
                </tr>
              </table>
            </td>
          </tr>

          <!-- expiry note -->
          <tr>
            <td align="center" style="padding:16px 32px 0 32px;">
              <p style="margin:0; font-size:13px; color:#94a3b8; font-family:Arial, Helvetica, sans-serif;">
                This code expires in ${expiresInMinutes} minutes.
              </p>
            </td>
          </tr>

          <!-- divider -->
          <tr>
            <td style="padding:28px 32px 0 32px;">
              <div style="border-top:1px solid #f1f5f9;"></div>
            </td>
          </tr>

          <!-- footer note -->
          <tr>
            <td style="padding:20px 32px 32px 32px;">
              <p style="margin:0; font-size:12px; line-height:18px; color:#94a3b8; font-family:Arial, Helvetica, sans-serif; text-align:center;">
                If you didn't request this code, you can safely ignore this email.<br />
                © ${new Date().getFullYear()} SprintLab. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}