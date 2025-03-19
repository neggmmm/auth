import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) return res.status(401).json({ message: 'Access Denied!' });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token!' });
    }
};
