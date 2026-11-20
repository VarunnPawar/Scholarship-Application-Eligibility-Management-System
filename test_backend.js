const http = require('http');

async function runTests() {
    console.log('🧪 Starting Backend API Automated Verification...\n');

    // Import app
    process.env.PORT = '5051';
    process.env.NODE_ENV = 'test';
    const express = require('express');
    const mongoose = require('mongoose');
    require('dotenv').config();

    const connectDB = require('./config/db');
    const apiRoutes = require('./routes/apiRoutes');
    const authRoutes = require('./routes/authRoutes');
    const Student = require('./models/Student');
    const Scholarship = require('./models/Scholarship');
    const Application = require('./models/Application');
    const User = require('./models/User');

    await connectDB();

    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api', apiRoutes);

    const server = app.listen(5051);

    const fetchJson = async (path, options = {}) => {
        return new Promise((resolve, reject) => {
            const url = `http://127.0.0.1:5051${path}`;
            const parsedUrl = new URL(url);
            const req = http.request({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname + parsedUrl.search,
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve({ status: res.statusCode, data: parsed });
                    } catch (e) {
                        resolve({ status: res.statusCode, raw: data });
                    }
                });
            });
            req.on('error', reject);
            if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            req.end();
        });
    };

    let passed = 0;
    let failed = 0;

    const assert = (name, condition) => {
        if (condition) {
            console.log(`  ✅ ${name}`);
            passed++;
        } else {
            console.error(`  ❌ ${name}`);
            failed++;
        }
    };

    try {
        // Test 1: Overview
        const overview = await fetchJson('/api/overview');
        assert('GET /api/overview returns 200', overview.status === 200);
        assert('Total students in DB >= 100', overview.data.data.totalStudents >= 100);
        assert('Average CGPA is a valid number', overview.data.data.averageCgpa > 0);
        assert('Total approved amount is calculated', overview.data.data.totalApprovedAmount > 0);
        assert('Applications per scholarship grouped', overview.data.data.applicationsPerScholarship.length === 8);
        assert('Enhanced analytics: Category breakdown populated', !!overview.data.data.categoryDistribution);
        assert('Enhanced analytics: CGPA ranges populated', !!overview.data.data.cgpaRanges);
        assert('Enhanced analytics: Funding distribution populated', !!overview.data.data.fundingDistribution);

        // Test 2: Students List & Filter
        const students = await fetchJson('/api/students?limit=10');
        assert('GET /api/students returns 200', students.status === 200);
        assert('Students pagination limit respected', students.data.data.length <= 10);
        const obcStudents = await fetchJson('/api/students?category=OBC');
        assert('Category filter works (all OBC)', obcStudents.data.data.every(s => s.category === 'OBC'));

        // Test 3: Scholarships List
        const scholarships = await fetchJson('/api/scholarships');
        assert('GET /api/scholarships returns 200', scholarships.status === 200);
        assert('8 Scholarships found', scholarships.data.data.length === 8);
        assert('Scholarships sorted by amount desc', scholarships.data.data[0].amount >= scholarships.data.data[1].amount);

        // Test 4: Eligibility Check
        const eligibility = await fetchJson('/api/eligibility/1');
        assert('GET /api/eligibility/1 returns 200', eligibility.status === 200);
        assert('Student Rahul Sharma found', eligibility.data.student.name === 'Rahul Sharma');
        assert('Qualifies for scholarships calculation', eligibility.data.summary.qualifiedCount > 0);
        assert('Results array populated with reasons', Array.isArray(eligibility.data.results));

        // Test 5: Applications List
        const applications = await fetchJson('/api/applications');
        assert('GET /api/applications returns 200', applications.status === 200);
        assert('Initial applications found', applications.data.data.length >= 15);
        assert('Applications contain student & scholarship names', !!applications.data.data[0].student_name && !!applications.data.data[0].scholarship_name);

        // Test 6: Create New Student
        const newStudentRes = await fetchJson('/api/students', {
            method: 'POST',
            body: {
                name: 'Automated Test Student',
                email: 'test.verification@university.edu',
                course: 'BTech AI ML',
                year: 2,
                cgpa: 9.35,
                income: 180000,
                category: 'General'
            }
        });
        assert('POST /api/students returns 201', newStudentRes.status === 201);
        const createdStudentId = newStudentRes.data.data.id;
        assert('Created student has assigned ID', createdStudentId > 100);

        // Test 7: Submit Application for created student
        const applyRes = await fetchJson('/api/applications', {
            method: 'POST',
            body: {
                student_id: createdStudentId,
                scholarship_id: 1, // National Merit Scholarship (min 8.0, max 300k, All)
                remarks: 'Verified merit'
            }
        });
        assert('POST /api/applications returns 201', applyRes.status === 201);
        const createdAppId = applyRes.data.data.id;

        // Test 8: Prevent duplicate application
        const dupRes = await fetchJson('/api/applications', {
            method: 'POST',
            body: {
                student_id: createdStudentId,
                scholarship_id: 1
            }
        });
        assert('Duplicate application prevented (400 Bad Request)', dupRes.status === 400);

        // Test 9: Update Application Status
        const patchRes = await fetchJson(`/api/applications/${createdAppId}/status`, {
            method: 'PATCH',
            body: { status: 'Approved' }
        });
        assert('PATCH /api/applications/:id/status updates to Approved', patchRes.status === 200 && patchRes.data.data.status === 'Approved');

        // Clean up test records
        await fetchJson(`/api/applications/${createdAppId}`, { method: 'DELETE' });
        await fetchJson(`/api/students/${createdStudentId}`, { method: 'DELETE' });
        console.log('  🧹 Cleaned up test student and test application');

        // Test 10: Auth - Demo Accounts list
        const demoRes = await fetchJson('/api/auth/demo-accounts');
        assert('GET /api/auth/demo-accounts returns 200', demoRes.status === 200);
        assert('Demo accounts include admin, officer, and students', demoRes.data.accounts.length >= 3);

        // Test 11: Auth - Admin Login
        const adminLoginRes = await fetchJson('/api/auth/login', {
            method: 'POST',
            body: { email: 'admin@scholarship.gov.in', password: 'admin123' }
        });
        assert('POST /api/auth/login with admin returns 200 and token', adminLoginRes.status === 200 && !!adminLoginRes.data.token);
        assert('Admin user role is admin', adminLoginRes.data.user.role === 'admin');

        // Test 12: Auth - Invalid Password Rejection
        const badLoginRes = await fetchJson('/api/auth/login', {
            method: 'POST',
            body: { email: 'admin@scholarship.gov.in', password: 'wrongpassword' }
        });
        assert('Invalid password returns 401 Unauthorized', badLoginRes.status === 401);

        // Test 13: Auth - Student Registration
        const testStudentEmail = `test.student.${Date.now()}@scholarship.gov.in`;
        const regRes = await fetchJson('/api/auth/register', {
            method: 'POST',
            body: {
                name: 'Arunav Sengupta',
                email: testStudentEmail,
                password: 'password123',
                role: 'student',
                course: 'BTech AI ML',
                year: 1,
                cgpa: 9.15,
                income: 140000,
                category: 'SC'
            }
        });
        assert('POST /api/auth/register returns 201', regRes.status === 201 && !!regRes.data.token);
        assert('Registered student has linked student_id', !!regRes.data.user.student_id);

        // Test 14: Auth - Verify Token via GET /api/auth/me
        const meRes = await fetchJson('/api/auth/me', {
            headers: { Authorization: `Bearer ${regRes.data.token}` }
        });
        assert('GET /api/auth/me with Bearer token returns 200', meRes.status === 200);
        assert('Profile contains student details', meRes.data.user.email === testStudentEmail);

        // Clean up registered test user and student
        await User.deleteOne({ email: testStudentEmail });
        await Student.deleteOne({ email: testStudentEmail });
        console.log('  🧹 Cleaned up registered test user');

        // Test 15: Student Portal Dedicated Endpoint
        const spRes = await fetchJson('/api/student-portal/1');
        assert('GET /api/student-portal/1 returns 200', spRes.status === 200);
        assert('Student portal data contains student details', spRes.data.student.name === 'Rahul Sharma');
        assert('Student portal calculates eligible scholarships', spRes.data.stats.eligibleCount > 0);
        assert('Student portal includes submitted applications with tracking info', spRes.data.myApplications.length > 0);

        console.log(`\n====================================================`);
        console.log(`Verification Summary: ${passed} Passed, ${failed} Failed`);
        console.log(`====================================================\n`);

    } catch (e) {
        console.error('Fatal test error:', e);
        failed++;
    } finally {
        server.close();
        await mongoose.disconnect();
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
