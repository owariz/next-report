import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(mongoUri);
    
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
