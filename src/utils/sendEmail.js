import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'yahoo', // You can change this to 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER, // Sender (Your App's Email)
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (userEmail, token) => {
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER, // **Sender (Fixed Email)**
        to: userEmail, // **Recipient (User’s Email)**
        subject: 'Verify Your Email',
        html: `<h2>Email Verification</h2>
               <p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent to:", userEmail, "Response:", info.response);
    } catch (error) {
        console.error("❌ Error Sending Email:", error.message);
    }
};
