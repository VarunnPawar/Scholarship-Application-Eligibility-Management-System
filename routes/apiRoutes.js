const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const seedData = require('../seed');

// ==========================================
// 1. OVERVIEW & ANALYTICS
// ==========================================
// Corresponds to SQL:
// - SELECT AVG(cgpa) FROM Students
// - SELECT status, COUNT(*) FROM Applications GROUP BY status
// - SELECT SUM(sc.amount) FROM Applications a JOIN Scholarships sc WHERE status = 'Approved'
// - SELECT sc.scholarship_name, COUNT(a.application_id) ... GROUP BY ...
// - SELECT s.student_id, s.name FROM Students s LEFT JOIN Applications a WHERE a.application_id IS NULL
router.get('/overview', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        
        // Average CGPA
        const avgCgpaResult = await Student.aggregate([
            { $group: { _id: null, avgCgpa: { $avg: '$cgpa' } } }
        ]);
        const avgCgpa = avgCgpaResult.length ? Number(avgCgpaResult[0].avgCgpa.toFixed(2)) : 0;

        // Application status counts
        const statusCounts = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        let pendingCount = 0;
        let approvedCount = 0;
        let rejectedCount = 0;
        statusCounts.forEach(item => {
            if (item._id === 'Pending') pendingCount = item.count;
            if (item._id === 'Approved') approvedCount = item.count;
            if (item._id === 'Rejected') rejectedCount = item.count;
        });

        // Total Approved Amount
        const approvedApps = await Application.find({ status: 'Approved' });
        const approvedScholarshipIds = approvedApps.map(a => a.scholarship_id);
        const scholarshipsMap = {};
        const allScholarships = await Scholarship.find({});
        allScholarships.forEach(sc => {
            scholarshipsMap[sc.scholarship_id] = sc;
        });

        const totalApprovedAmount = approvedApps.reduce((sum, app) => {
            const sc = scholarshipsMap[app.scholarship_id];
            return sum + (sc ? sc.amount : 0);
        }, 0);

        // Applications per scholarship
        const appsPerScholarshipCounts = await Application.aggregate([
            { $group: { _id: '$scholarship_id', count: { $sum: 1 } } }
        ]);
        const appsCountMap = {};
        appsPerScholarshipCounts.forEach(item => {
            appsCountMap[item._id] = item.count;
        });

        const applicationsPerScholarship = allScholarships.map(sc => ({
            id: sc.scholarship_id,
            name: sc.scholarship_name,
            funding_type: sc.funding_type,
            amount: sc.amount,
            count: appsCountMap[sc.scholarship_id] || 0
        }));

        // Category breakdown of students
        const categoryCounts = await Student.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        const categoryDistribution = {};
        categoryCounts.forEach(c => { categoryDistribution[c._id] = c.count; });

        // CGPA Ranges (6-6.99, 7-7.99, 8-8.99, 9-10)
        const cgpaRanges = {
            '6.0 - 6.9': await Student.countDocuments({ cgpa: { $gte: 6.0, $lt: 7.0 } }),
            '7.0 - 7.9': await Student.countDocuments({ cgpa: { $gte: 7.0, $lt: 8.0 } }),
            '8.0 - 8.9': await Student.countDocuments({ cgpa: { $gte: 8.0, $lt: 9.0 } }),
            '9.0 - 10.0': await Student.countDocuments({ cgpa: { $gte: 9.0 } })
        };

        // Funding Type breakdown of approved scholarships
        const fundingDistribution = {};
        approvedApps.forEach(app => {
            const sc = scholarshipsMap[app.scholarship_id];
            if (sc) {
                const ft = sc.funding_type || 'Other';
                fundingDistribution[ft] = (fundingDistribution[ft] || 0) + sc.amount;
            }
        });

        // Students who have not applied
        const appliedStudentIds = await Application.distinct('student_id');
        const unappliedStudents = await Student.find({
            student_id: { $nin: appliedStudentIds }
        }).select('student_id name course year_of_study cgpa category family_income email');

        res.json({
            success: true,
            data: {
                totalStudents,
                averageCgpa: avgCgpa,
                pendingCount,
                approvedCount,
                rejectedCount,
                totalApprovedAmount,
                applicationsPerScholarship,
                categoryDistribution,
                cgpaRanges,
                fundingDistribution,
                unappliedStudentsCount: unappliedStudents.length,
                unappliedStudents: unappliedStudents.map(s => ({
                    id: s.student_id,
                    name: s.name,
                    course: s.course,
                    year: s.year_of_study,
                    cgpa: s.cgpa,
                    income: s.family_income,
                    category: s.category,
                    email: s.email
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching overview data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. STUDENTS API
// ==========================================
// List students (with search, category filter, pagination)
router.get('/students', async (req, res) => {
    try {
        const { search = '', category = 'All', page, limit } = req.query;
        const filter = {};

        if (search) {
            const searchRegex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { course: searchRegex },
                { category: searchRegex }
            ];
        }

        if (category && category !== 'All') {
            filter.category = category;
        }

        const total = await Student.countDocuments(filter);

        let query = Student.find(filter).sort({ student_id: 1 });

        // If pagination parameters are provided
        if (page || limit) {
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, parseInt(limit, 10) || 15);
            query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
        }

        const students = await query;

        const formatted = students.map(s => ({
            id: s.student_id,
            student_id: s.student_id,
            name: s.name,
            email: s.email,
            course: s.course,
            year: s.year_of_study,
            year_of_study: s.year_of_study,
            income: s.family_income,
            family_income: s.family_income,
            category: s.category,
            cgpa: s.cgpa,
            phone: s.phone
        }));

        res.json({
            success: true,
            total,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : total,
            data: formatted
        });
    } catch (error) {
        console.error('Error listing students:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single student
router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findOne({ student_id: Number(req.params.id) });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({
            success: true,
            data: {
                id: student.student_id,
                student_id: student.student_id,
                name: student.name,
                email: student.email,
                course: student.course,
                year: student.year_of_study,
                income: student.family_income,
                category: student.category,
                cgpa: student.cgpa,
                phone: student.phone
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create student
router.post('/students', async (req, res) => {
    try {
        const { name, email, course, year, year_of_study, income, family_income, category, cgpa, phone } = req.body;

        if (!name || !email || !course || cgpa === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const existingEmail = await Student.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Student with this email already exists' });
        }

        // Get max student_id
        const lastStudent = await Student.findOne().sort({ student_id: -1 });
        const nextId = lastStudent ? lastStudent.student_id + 1 : 1;

        const newStudent = await Student.create({
            student_id: nextId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            course: course.trim(),
            year_of_study: Number(year_of_study || year || 1),
            family_income: Number(family_income || income || 0),
            category: category || 'General',
            cgpa: Number(cgpa),
            phone: phone ? phone.trim() : ''
        });

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: {
                id: newStudent.student_id,
                student_id: newStudent.student_id,
                name: newStudent.name,
                email: newStudent.email,
                course: newStudent.course,
                year: newStudent.year_of_study,
                income: newStudent.family_income,
                category: newStudent.category,
                cgpa: newStudent.cgpa,
                phone: newStudent.phone
            }
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update student
router.put('/students/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, course, year, year_of_study, income, family_income, category, cgpa, phone } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim().toLowerCase();
        if (course) updateData.course = course.trim();
        if (year !== undefined || year_of_study !== undefined) updateData.year_of_study = Number(year_of_study || year);
        if (income !== undefined || family_income !== undefined) updateData.family_income = Number(family_income || income);
        if (category) updateData.category = category;
        if (cgpa !== undefined) updateData.cgpa = Number(cgpa);
        if (phone !== undefined) updateData.phone = phone.trim();

        const student = await Student.findOneAndUpdate({ student_id: id }, updateData, { new: true });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.json({ success: true, message: 'Student updated successfully', data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await Student.findOneAndDelete({ student_id: id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        // Also cascade delete applications
        await Application.deleteMany({ student_id: id });

        res.json({ success: true, message: 'Student and related applications deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. SCHOLARSHIPS API
// ==========================================
// List scholarships (with filter by funding_type and institution_type, sorted by amount desc)
router.get('/scholarships', async (req, res) => {
    try {
        const { funding_type = 'All', institution_type = 'All' } = req.query;
        const filter = {};

        if (funding_type && funding_type !== 'All') {
            filter.funding_type = funding_type;
        }

        if (institution_type && institution_type !== 'All') {
            filter.institution_type = institution_type;
        }

        const scholarships = await Scholarship.find(filter).sort({ amount: -1 });

        const formatted = scholarships.map(sc => ({
            id: sc.scholarship_id,
            scholarship_id: sc.scholarship_id,
            name: sc.scholarship_name,
            scholarship_name: sc.scholarship_name,
            amount: sc.amount,
            funding_type: sc.funding_type,
            institution_type: sc.institution_type,
            min_cgpa: sc.min_cgpa,
            max_income: sc.max_income,
            category: sc.eligible_category,
            eligible_category: sc.eligible_category,
            deadline: sc.deadline
        }));

        res.json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        console.error('Error listing scholarships:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single scholarship
router.get('/scholarships/:id', async (req, res) => {
    try {
        const sc = await Scholarship.findOne({ scholarship_id: Number(req.params.id) });
        if (!sc) {
            return res.status(404).json({ success: false, message: 'Scholarship not found' });
        }
        res.json({
            success: true,
            data: {
                id: sc.scholarship_id,
                scholarship_id: sc.scholarship_id,
                name: sc.scholarship_name,
                scholarship_name: sc.scholarship_name,
                amount: sc.amount,
                funding_type: sc.funding_type,
                institution_type: sc.institution_type,
                min_cgpa: sc.min_cgpa,
                max_income: sc.max_income,
                category: sc.eligible_category,
                eligible_category: sc.eligible_category,
                deadline: sc.deadline
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create scholarship
router.post('/scholarships', async (req, res) => {
    try {
        const { name, scholarship_name, amount, funding_type, institution_type, min_cgpa, max_income, category, eligible_category, deadline } = req.body;

        const title = (scholarship_name || name || '').trim();
        if (!title || !amount || !funding_type || !institution_type) {
            return res.status(400).json({ success: false, message: 'Missing required scholarship fields' });
        }

        const lastSc = await Scholarship.findOne().sort({ scholarship_id: -1 });
        const nextId = lastSc ? lastSc.scholarship_id + 1 : 1;

        const newSc = await Scholarship.create({
            scholarship_id: nextId,
            scholarship_name: title,
            amount: Number(amount),
            funding_type,
            institution_type,
            min_cgpa: Number(min_cgpa || 0),
            max_income: Number(max_income || 0),
            eligible_category: eligible_category || category || 'All',
            deadline: deadline || '2026-12-31'
        });

        res.status(201).json({
            success: true,
            message: 'Scholarship created successfully',
            data: {
                id: newSc.scholarship_id,
                scholarship_id: newSc.scholarship_id,
                name: newSc.scholarship_name,
                scholarship_name: newSc.scholarship_name,
                amount: newSc.amount,
                funding_type: newSc.funding_type,
                institution_type: newSc.institution_type,
                min_cgpa: newSc.min_cgpa,
                max_income: newSc.max_income,
                category: newSc.eligible_category,
                eligible_category: newSc.eligible_category,
                deadline: newSc.deadline
            }
        });
    } catch (error) {
        console.error('Error creating scholarship:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update scholarship
router.put('/scholarships/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, scholarship_name, amount, funding_type, institution_type, min_cgpa, max_income, category, eligible_category, deadline } = req.body;

        const updateData = {};
        if (name || scholarship_name) updateData.scholarship_name = (scholarship_name || name).trim();
        if (amount !== undefined) updateData.amount = Number(amount);
        if (funding_type) updateData.funding_type = funding_type;
        if (institution_type) updateData.institution_type = institution_type;
        if (min_cgpa !== undefined) updateData.min_cgpa = Number(min_cgpa);
        if (max_income !== undefined) updateData.max_income = Number(max_income);
        if (category || eligible_category) updateData.eligible_category = eligible_category || category;
        if (deadline) updateData.deadline = deadline;

        const sc = await Scholarship.findOneAndUpdate({ scholarship_id: id }, updateData, { new: true });
        if (!sc) {
            return res.status(404).json({ success: false, message: 'Scholarship not found' });
        }
        res.json({ success: true, message: 'Scholarship updated successfully', data: sc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete scholarship
router.delete('/scholarships/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const sc = await Scholarship.findOneAndDelete({ scholarship_id: id });
        if (!sc) {
            return res.status(404).json({ success: false, message: 'Scholarship not found' });
        }
        await Application.deleteMany({ scholarship_id: id });
        res.json({ success: true, message: 'Scholarship and related applications deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 4. ELIGIBILITY EVALUATION API
// ==========================================
// Matches the core SQL logic:
// WHERE s.cgpa >= sc.min_cgpa
// AND s.family_income <= sc.max_income
// AND (sc.eligible_category = 'All' OR s.category = sc.eligible_category)
router.get('/eligibility/:studentId', async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);
        const student = await Student.findOne({ student_id: studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const scholarships = await Scholarship.find().sort({ amount: -1 });
        const existingApplications = await Application.find({ student_id: studentId });
        const appMap = {};
        existingApplications.forEach(app => {
            appMap[app.scholarship_id] = app;
        });

        let qualifiedCount = 0;
        let maxWorth = 0;

        const results = scholarships.map(sc => {
            const reasons = [];
            if (student.cgpa < sc.min_cgpa) {
                reasons.push(`Requires CGPA ${sc.min_cgpa.toFixed(2)}+ (student has ${student.cgpa.toFixed(2)})`);
            }
            if (student.family_income > sc.max_income) {
                reasons.push(`Income exceeds limit of ₹${sc.max_income.toLocaleString('en-IN')} (student has ₹${student.family_income.toLocaleString('en-IN')})`);
            }
            if (sc.eligible_category !== 'All' && student.category !== sc.eligible_category) {
                reasons.push(`Only for ${sc.eligible_category} category (student is ${student.category})`);
            }

            const isEligible = reasons.length === 0;
            if (isEligible) {
                qualifiedCount++;
                maxWorth += sc.amount;
            }

            const existingApp = appMap[sc.scholarship_id] || null;

            return {
                scholarship: {
                    id: sc.scholarship_id,
                    scholarship_id: sc.scholarship_id,
                    name: sc.scholarship_name,
                    scholarship_name: sc.scholarship_name,
                    amount: sc.amount,
                    funding_type: sc.funding_type,
                    institution_type: sc.institution_type,
                    min_cgpa: sc.min_cgpa,
                    max_income: sc.max_income,
                    category: sc.eligible_category,
                    deadline: sc.deadline
                },
                isEligible,
                reasons,
                existingApplication: existingApp ? {
                    id: existingApp.application_id,
                    status: existingApp.status,
                    date: existingApp.application_date,
                    remarks: existingApp.remarks
                } : null
            };
        });

        res.json({
            success: true,
            student: {
                id: student.student_id,
                name: student.name,
                email: student.email,
                course: student.course,
                year: student.year_of_study,
                income: student.family_income,
                category: student.category,
                cgpa: student.cgpa
            },
            summary: {
                qualifiedCount,
                totalScholarships: scholarships.length,
                maxWorth
            },
            results
        });
    } catch (error) {
        console.error('Error evaluating eligibility:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 4B. DEDICATED STUDENT PORTAL DATA API
// ==========================================
router.get('/student-portal/:studentId', async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);
        const student = await Student.findOne({ student_id: studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const [scholarships, myApplications] = await Promise.all([
            Scholarship.find().sort({ amount: -1 }),
            Application.find({ student_id: studentId }).sort({ application_id: -1 })
        ]);

        const scholarshipMap = {};
        scholarships.forEach(sc => { scholarshipMap[sc.scholarship_id] = sc; });

        const enrichedApplications = myApplications.map(app => {
            const sc = scholarshipMap[app.scholarship_id] || {};
            return {
                id: app.application_id,
                application_id: app.application_id,
                scholarship_id: app.scholarship_id,
                scholarship_name: sc.scholarship_name || 'Scholarship #' + app.scholarship_id,
                amount: sc.amount || 0,
                funding_type: sc.funding_type || '',
                institution_type: sc.institution_type || '',
                date: app.application_date,
                status: app.status,
                remarks: app.remarks
            };
        });

        const appliedScMap = {};
        myApplications.forEach(a => { appliedScMap[a.scholarship_id] = a; });

        const eligibleScholarships = [];
        let totalPotentialGrant = 0;
        let totalApprovedGrant = 0;

        scholarships.forEach(sc => {
            const reasons = [];
            if (student.cgpa < sc.min_cgpa) reasons.push(`Requires CGPA ${sc.min_cgpa.toFixed(2)}+`);
            if (student.family_income > sc.max_income) reasons.push(`Income exceeds ₹${sc.max_income.toLocaleString('en-IN')}`);
            if (sc.eligible_category !== 'All' && student.category !== sc.eligible_category) reasons.push(`Only for ${sc.eligible_category}`);

            const isEligible = reasons.length === 0;
            const applied = appliedScMap[sc.scholarship_id] || null;

            if (isEligible) {
                totalPotentialGrant += sc.amount;
                eligibleScholarships.push({
                    id: sc.scholarship_id,
                    name: sc.scholarship_name,
                    amount: sc.amount,
                    funding_type: sc.funding_type,
                    institution_type: sc.institution_type,
                    deadline: sc.deadline,
                    category: sc.eligible_category,
                    min_cgpa: sc.min_cgpa,
                    max_income: sc.max_income,
                    applied: !!applied,
                    application: applied ? {
                        id: applied.application_id,
                        status: applied.status,
                        date: applied.application_date,
                        remarks: applied.remarks
                    } : null
                });
            }

            if (applied && applied.status === 'Approved') {
                totalApprovedGrant += sc.amount;
            }
        });

        res.json({
            success: true,
            student: {
                id: student.student_id,
                name: student.name,
                email: student.email,
                course: student.course,
                year: student.year_of_study,
                income: student.family_income,
                category: student.category,
                cgpa: student.cgpa,
                phone: student.phone
            },
            stats: {
                eligibleCount: eligibleScholarships.length,
                totalScholarships: scholarships.length,
                applicationsCount: enrichedApplications.length,
                pendingCount: enrichedApplications.filter(a => a.status === 'Pending').length,
                approvedCount: enrichedApplications.filter(a => a.status === 'Approved').length,
                rejectedCount: enrichedApplications.filter(a => a.status === 'Rejected').length,
                totalPotentialGrant,
                totalApprovedGrant
            },
            eligibleScholarships,
            myApplications: enrichedApplications
        });
    } catch (error) {
        console.error('Error fetching student portal data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 5. APPLICATIONS API
// ==========================================
// List applications (with status filter, joined with student and scholarship data)
router.get('/applications', async (req, res) => {
    try {
        const { status = 'All' } = req.query;
        const filter = {};
        if (status && status !== 'All') {
            filter.status = status;
        }

        const apps = await Application.find(filter).sort({ application_id: -1 });

        // Batch fetch students and scholarships
        const studentIds = [...new Set(apps.map(a => a.student_id))];
        const scholarshipIds = [...new Set(apps.map(a => a.scholarship_id))];

        const [students, scholarships] = await Promise.all([
            Student.find({ student_id: { $in: studentIds } }),
            Scholarship.find({ scholarship_id: { $in: scholarshipIds } })
        ]);

        const studentMap = {};
        students.forEach(s => { studentMap[s.student_id] = s; });

        const scholarshipMap = {};
        scholarships.forEach(sc => { scholarshipMap[sc.scholarship_id] = sc; });

        const formatted = apps.map(a => {
            const st = studentMap[a.student_id] || { name: 'Unknown', email: '' };
            const sc = scholarshipMap[a.scholarship_id] || { scholarship_name: 'Unknown', amount: 0, funding_type: '', institution_type: '' };

            return {
                id: a.application_id,
                application_id: a.application_id,
                student_id: a.student_id,
                scholarship_id: a.scholarship_id,
                student_name: st.name,
                student_email: st.email,
                student: {
                    id: st.student_id,
                    name: st.name,
                    course: st.course,
                    category: st.category
                },
                scholarship_name: sc.scholarship_name || sc.name,
                scholarship: {
                    id: sc.scholarship_id,
                    name: sc.scholarship_name,
                    amount: sc.amount,
                    funding_type: sc.funding_type,
                    institution_type: sc.institution_type
                },
                date: a.application_date,
                application_date: a.application_date,
                status: a.status,
                remarks: a.remarks
            };
        });

        res.json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Submit a new application
router.post('/applications', async (req, res) => {
    try {
        const { student_id, scholarship_id, remarks } = req.body;

        const stId = Number(student_id);
        const scId = Number(scholarship_id);

        if (!stId || !scId) {
            return res.status(400).json({ success: false, message: 'student_id and scholarship_id are required' });
        }

        // Verify student exists
        const student = await Student.findOne({ student_id: stId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Verify scholarship exists
        const scholarship = await Scholarship.findOne({ scholarship_id: scId });
        if (!scholarship) {
            return res.status(404).json({ success: false, message: 'Scholarship not found' });
        }

        // Check if application already exists
        const existingApp = await Application.findOne({ student_id: stId, scholarship_id: scId });
        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: `Application already submitted on ${existingApp.application_date} (Status: ${existingApp.status})`
            });
        }

        // Check eligibility criteria
        const reasons = [];
        if (student.cgpa < scholarship.min_cgpa) reasons.push(`CGPA is below ${scholarship.min_cgpa}`);
        if (student.family_income > scholarship.max_income) reasons.push(`Income exceeds ${scholarship.max_income}`);
        if (scholarship.eligible_category !== 'All' && student.category !== scholarship.eligible_category) {
            reasons.push(`Category mismatch (Requires ${scholarship.eligible_category})`);
        }

        // Find next application_id
        const lastApp = await Application.findOne().sort({ application_id: -1 });
        const nextId = lastApp ? lastApp.application_id + 1 : 1;

        const newApp = await Application.create({
            application_id: nextId,
            student_id: stId,
            scholarship_id: scId,
            application_date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            remarks: remarks || (reasons.length ? `Submitted with remarks: ${reasons.join(', ')}` : 'Application submitted')
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                id: newApp.application_id,
                application_id: newApp.application_id,
                student_id: newApp.student_id,
                scholarship_id: newApp.scholarship_id,
                date: newApp.application_date,
                status: newApp.status,
                remarks: newApp.remarks
            }
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update application status (Approve / Reject)
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status, remarks } = req.body;

        if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Valid status required: Pending, Approved, or Rejected' });
        }

        let updatedRemarks = remarks;
        if (!updatedRemarks) {
            if (status === 'Approved') updatedRemarks = 'Eligible for scholarship';
            else if (status === 'Rejected') updatedRemarks = 'Does not meet criteria';
            else updatedRemarks = 'Application pending review';
        }

        const app = await Application.findOneAndUpdate(
            { application_id: id },
            { status, remarks: updatedRemarks },
            { new: true }
        );

        if (!app) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.json({
            success: true,
            message: `Application marked as ${status}`,
            data: {
                id: app.application_id,
                application_id: app.application_id,
                status: app.status,
                remarks: app.remarks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete application
router.delete('/applications/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const app = await Application.findOneAndDelete({ application_id: id });
        if (!app) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 6. DATABASE RESET / RESEED API
// ==========================================
router.post('/seed', async (req, res) => {
    try {
        await seedData();
        res.json({ success: true, message: 'Database reset & seeded successfully from SQL dataset' });
    } catch (error) {
        console.error('Error reseeding database:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
