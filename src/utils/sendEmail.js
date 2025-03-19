import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another email service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your app password
    }
});

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `<h2>Email Verification</h2>
               <p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};
