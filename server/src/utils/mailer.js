import nodemailer from 'nodemailer';

/**
 * Absolute base URL used to build the reset link.
 * In dev the browser origin is Vite (5173) which proxies these paths.
 */
export function appBaseUrl() {
  return (
    process.env.APP_URL ||
    process.env.CLIENT_URL ||
    `http://localhost:${process.env.PORT || 5001}`
  );
}

/**
 * Render + send the password-reset email.
 *
 * If SMTP_* is configured we use a real Nodemailer transport; otherwise we
 * fall back to a "console transport" that prints the link — so the flow is
 * fully testable without mail credentials.
 */
export async function sendPasswordResetEmail({ to, name, resetUrl, expiresMinutes }) {
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'Someone requested a password reset for your DashCore account.',
    `Reset your password (valid for ${expiresMinutes} minutes):`,
    resetUrl,
    '',
    'If you did not request this, you can safely ignore this email.',
  ].join('\n');

  const html = renderEmailHtml({ name, resetUrl, expiresMinutes });

  if (process.env.SMTP_HOST) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    await transport.sendMail({
      from: process.env.MAIL_FROM || 'DashCore <no-reply@dashcore.local>',
      to,
      subject: 'Reset your DashCore password',
      text,
      html,
    });
    return { delivered: true, mode: 'smtp' };
  }

  // Dev fallback: no SMTP configured — log the link instead of sending.
  console.log('\n───────── 🔑 Password reset email ─────────');
  console.log(`To:      ${to}`);
  console.log(`Subject: Reset your DashCore password`);
  console.log(`Link:    ${resetUrl}`);
  console.log(`Expires: ${expiresMinutes} minutes`);
  console.log('────────────────────────────────────────────\n');

  return { delivered: false, mode: 'console', resetUrl };
}

/** Minimal inline-styled email body (email clients strip external CSS). */
function renderEmailHtml({ name, resetUrl, expiresMinutes }) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:24px 28px;">
              <div style="font-size:20px;font-weight:700;color:#ffffff;">DashCore</div>
            </td>
          </tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">Hi ${escapeHtml(name || 'there')},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
              Someone requested a password reset for your account. Click the button
              below to choose a new password. This link expires in
              <strong>${expiresMinutes} minutes</strong>.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Reset password
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="margin:0;font-size:13px;color:#2563eb;word-break:break-all;">${escapeHtml(resetUrl)}</p>
          </td></tr>
          <tr><td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              If you did not request this, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
