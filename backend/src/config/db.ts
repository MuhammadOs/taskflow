import mongoose from 'mongoose';
import dns from 'dns';

// Configure DNS to use Google & Cloudflare DNS servers for reliable SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS servers cannot be set in current environment
}

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
    const conn = await mongoose.connect(connStr);
    console.log(`[database]: MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[database]: Error connecting to MongoDB: ${(error as Error).message}`);
    console.error(
      `[database]: Make sure MongoDB is running locally or check your MONGODB_URI in backend/.env`
    );
  }
};
