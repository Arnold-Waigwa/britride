import { Resend } from "resend";

export async function sendVerificationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your BritRide account",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color: #7c3aed;">Welcome to BritRide!</h2>
    <p>Click the button below to verify your email address.</p>
    <a href="${verifyUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
      Verify Email
    </a>
    <p style="color: #666; font-size: 14px;">
      This link expires in 24 hours. If you didn't create an account, ignore this email.
    </p>
  </div>
`,
  });
}
