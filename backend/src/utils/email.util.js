import nodemailer from 'nodemailer';

const getTransporter = () => {
  // Using explicit host/port is often more reliable across different networks than 'service: gmail'
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Adding debug info to help your team see why it fails
    debug: true,
    logger: true 
  });
};

export const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"CoachLink" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your CoachLink account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to CoachLink!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining CoachLink. To complete your registration and start using the platform, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error('Error sending verification email:', err);
    throw new Error('Could not send verification email');
  }
};

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"CoachLink" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'CoachLink - Email Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Verify your email</h2>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <h1 style="letter-spacing: 5px; color: #4f46e5;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Could not send OTP email');
  }
};
