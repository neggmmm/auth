import express from 'express';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.use(express.json());

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
