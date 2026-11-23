const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    // If already connected, reuse existing connection (crucial for serverless)
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const uri = process.env.MONGO_URI;

    // In Vercel serverless environment without MONGO_URI, do NOT attempt localhost:27017
    if (!uri && process.env.VERCEL) {
        console.warn('⚠️ No MONGO_URI configured on Vercel. Operating with built-in mock/demo data.');
        return null;
    }

    try {
        const targetUri = uri || 'mongodb://127.0.0.1:27017/scholarship_db';
        const conn = await mongoose.connect(targetUri, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false
        });
        cachedConnection = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        cachedConnection = null;
        return null;
    }
};

module.exports = connectDB;
