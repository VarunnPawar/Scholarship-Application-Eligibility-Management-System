require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const Student = require('./models/Student');
const seedData = require('./seed');

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to MongoDB only when not on Vercel or when MONGO_URI is explicitly provided
if (!process.env.VERCEL) {
    connectDB().then(async (conn) => {
        if (!conn) return;
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
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files (serves public directory and root files)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
}
app.use(express.static(__dirname));

// Explicit static asset routes with safe fallbacks
app.get('/style.css', (req, res) => {
    res.type('text/css');
    const file = fs.existsSync(path.join(publicDir, 'style.css')) 
        ? path.join(publicDir, 'style.css') 
        : path.join(__dirname, 'style.css');
    res.sendFile(file, (err) => { if (err && !res.headersSent) res.status(404).end(); });
});

app.get('/script.js', (req, res) => {
    res.type('application/javascript');
    const file = fs.existsSync(path.join(publicDir, 'script.js')) 
        ? path.join(publicDir, 'script.js') 
        : path.join(__dirname, 'script.js');
    res.sendFile(file, (err) => { if (err && !res.headersSent) res.status(404).end(); });
});

app.get('/login.js', (req, res) => {
    res.type('application/javascript');
    const file = fs.existsSync(path.join(publicDir, 'login.js')) 
        ? path.join(publicDir, 'login.js') 
        : path.join(__dirname, 'login.js');
    res.sendFile(file, (err) => { if (err && !res.headersSent) res.status(404).end(); });
});

app.get('/login.html', (req, res) => {
    const file = fs.existsSync(path.join(publicDir, 'login.html')) 
        ? path.join(publicDir, 'login.html') 
        : path.join(__dirname, 'login.html');
    res.sendFile(file, (err) => { if (err && !res.headersSent) res.status(404).end(); });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'Scholarship Eligibility & Application Management System',
        database: require('mongoose').connection.readyState === 1 ? 'Connected' : 'Offline / Demo Mode'
    });
});

// Catch-all route to serve the frontend single-page application
app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        return res.status(404).end();
    }
    const file = fs.existsSync(path.join(publicDir, 'index.html')) 
        ? path.join(publicDir, 'index.html') 
        : path.join(__dirname, 'index.html');
    res.sendFile(file, (err) => {
        if (err && !res.headersSent) {
            res.status(200).send('<!DOCTYPE html><html><body>Loading Portal...</body></html>');
        }
    });
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
