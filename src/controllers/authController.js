import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { isEmail, strongPw } from '../utils/validators.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
    try {
        const { email, pw } = req.body;

        if (!email || !pw) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        if (!isEmail(email)) {
            return res.status(400).json({ message: "Enter a valid email" });
        }

        if (!strongPw(pw)) {
            return res.status(400).json({ message: "Enter a stronger password" });
        }

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "Email is already in use!" });
        }

        const hashedpw = await bcrypt.hash(pw, 10);
        const verificationToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1d' });

        const newUser = new User({
            email,
            password: hashedpw,
            verificationToken, // ✅ Store token until verified
            verified: false
        });

        await newUser.save(); // ✅ Save user with unverified status
        await sendVerificationEmail(email, verificationToken); // ✅ Send verification email

        return res.status(201).json({ message: "Check your email to verify your account!" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query; // Get token from URL

        if (!token) return res.status(400).json({ message: "Invalid verification link!" });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "User not found!" });
        if (user.verified) return res.status(400).json({ message: "Email already verified!" });

        user.verified = true;
        user.verificationToken = null; // ✅ Remove token after verification
        await user.save();

        return res.status(200).json({ message: "Email verified successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Invalid or expired token!" });
    }
};
