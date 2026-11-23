const connectDB = require('../config/db');
const app = require('../server');

module.exports = async (req, res) => {
    // Only attempt DB connection if MONGO_URI is defined
    if (process.env.MONGO_URI) {
        try {
            await connectDB();
        } catch (e) {
            console.warn('DB connect warning in serverless handler:', e.message);
        }
    }
    return app(req, res);
};
