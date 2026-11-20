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

// Explicit static asset routes for Vercel serverless environments
app.get('/style.css', (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/login.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'login.js'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

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
    // If a static file with an extension was not found, return 404 rather than serving HTML
    if (req.path.includes('.')) {
        return res.status(404).end();
    }
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

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 Scholarship Backend running on http://localhost:${PORT}`);
        console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
        console.log(`💻 Frontend UI served at http://localhost:${PORT}`);
        console.log(`====================================================`);
    });
}

module.exports = app;
