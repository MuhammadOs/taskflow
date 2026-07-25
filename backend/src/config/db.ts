import mongoose from 'mongoose';
import dns from 'dns';

// Fix DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS fails
}

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[database]: MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[database]: Error connecting to MongoDB: ${(error as Error).message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[database]: MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  console.error(`[database]: Mongoose connection error: ${err.message}`);
});
