const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const { generateToken, authenticate } = require('../middleware/auth');

// ==========================================
// 1. REGISTER
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role = 'student',
            course,
            year,
            year_of_study,
            cgpa,
            income,
            family_income,
            category,
            phone
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        let assignedStudentId = null;

        // If registering as a student, create or link a Student record
        if (role === 'student') {
            let existingStudent = await Student.findOne({ email: normalizedEmail });

            if (existingStudent) {
                assignedStudentId = existingStudent.student_id;
            } else {
                // Get next student_id
                const lastStudent = await Student.findOne().sort({ student_id: -1 });
                assignedStudentId = lastStudent ? lastStudent.student_id + 1 : 1;

                existingStudent = await Student.create({
                    student_id: assignedStudentId,
                    name: name.trim(),
                    email: normalizedEmail,
                    course: course ? course.trim() : 'BTech CSE',
                    year_of_study: Number(year_of_study || year || 1),
                    cgpa: Number(cgpa || 8.0),
                    family_income: Number(family_income || income || 150000),
                    category: category || 'General',
                    phone: phone ? phone.trim() : ''
                });
            }
        }

        // Create new User
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role,
            student_id: assignedStudentId
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                student_id: user.student_id
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. LOGIN
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // If user is a student, attach student details
        let studentProfile = null;
        if (user.role === 'student' && user.student_id) {
            studentProfile = await Student.findOne({ student_id: user.student_id });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                student_id: user.student_id,
                student: studentProfile ? {
                    id: studentProfile.student_id,
                    name: studentProfile.name,
                    course: studentProfile.course,
                    year: studentProfile.year_of_study,
                    cgpa: studentProfile.cgpa,
                    income: studentProfile.family_income,
                    category: studentProfile.category
                } : null
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. GET CURRENT USER
// ==========================================
router.get('/me', authenticate, async (req, res) => {
    try {
        let studentProfile = null;
        if (req.user.role === 'student' && req.user.student_id) {
            studentProfile = await Student.findOne({ student_id: req.user.student_id });
        }

        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                student_id: req.user.student_id,
                student: studentProfile ? {
                    id: studentProfile.student_id,
                    name: studentProfile.name,
                    course: studentProfile.course,
                    year: studentProfile.year_of_study,
                    cgpa: studentProfile.cgpa,
                    income: studentProfile.family_income,
                    category: studentProfile.category
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 4. DEMO ACCOUNTS FOR QUICK LOGIN
// ==========================================
router.get('/demo-accounts', (req, res) => {
    res.json({
        success: true,
        accounts: [
            {
                role: 'admin',
                label: 'Dr. Rajeshwar Sharma (Admin)',
                email: 'admin@scholarship.gov.in',
                password: 'admin123',
                description: 'Chief Portal Administrator - governance over students, scholarships, and applications'
            },
            {
                role: 'officer',
                label: 'Sanjay Verma (Review Officer)',
                email: 'officer@scholarship.gov.in',
                password: 'officer123',
                description: 'Senior Scrutiny Officer - review, audit, and approve/reject applications'
            },
            {
                role: 'student',
                label: 'Rahul Sharma (Student)',
                email: 'rahul.sharma@gmail.com',
                password: 'password123',
                description: 'BTech CSE Year 2, CGPA 8.20, OBC - check eligibility and track applications'
            },
            {
                role: 'student',
                label: 'Priya Verma (Student)',
                email: 'priya.verma@gmail.com',
                password: 'password123',
                description: 'BTech AI ML Year 1, CGPA 9.10, SC - high merit candidate'
            }
        ]
    });
});

module.exports = router;
