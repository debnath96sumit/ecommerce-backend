import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI ?? '';
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1); // Exit if DB connection fails
  }
};

export default dbConnect;