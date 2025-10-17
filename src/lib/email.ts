import nodemailer from 'nodemailer';

// Create transporter for real emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email: string, otp: string, subject: string = 'Your Verification Code'): Promise<boolean> {
  try {
    console.log('🔧 Attempting to send email...');
    console.log('📧 To:', email);
    console.log('🔑 Using EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('📝 Subject:', subject);
    console.log('🔢 OTP:', otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">SecureAuth System</h2>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; padding: 10px 20px; background: #f3f4f6; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;">
            This code will expire in 10 minutes.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}


export const sendEmailOTP = sendOTP;