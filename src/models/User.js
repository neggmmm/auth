import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }, // ✅ New field for email verification
    verificationToken: { type: String } // ✅ Store token until verified
});

export default mongoose.model('User', UserSchema);
