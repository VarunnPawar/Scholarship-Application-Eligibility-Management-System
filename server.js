require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const Student = require('./models/Student');
const seedData = require('./seed');

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to MongoDB
connectDB().then(async () => {
    // Check if initial seeding is needed
    try {
        const studentCount = await Student.countDocuments();
        if (studentCount === 0) {
            console.log('📦 Database is empty. Auto-seeding initial data...');
            await seedData();
        }
    } catch (e) {
        console.warn('⚠️ Seeding check skipped:', e.message);
    }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files (serves index.html, style.css, script.js directly)
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'Scholarship Eligibility & Application Management System'
    });
});

// Catch-all route to serve the frontend single-page application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Scholarship Backend running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`💻 Frontend UI served at http://localhost:${PORT}`);
    console.log(`====================================================`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});
