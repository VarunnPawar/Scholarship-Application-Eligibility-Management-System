// ====================================================
// APEX UNIVERSITY LMS — SCHOLARSHIP MANAGEMENT SYSTEM
// Clean, Professional Academic Information Desk
// ====================================================

const API_BASE = '/api';
let isBackendConnected = false;
let currentUser = null;
let currentPortal = 'admin'; // 'admin' | 'student'
let activeStudentId = 1; // Default active student ID for student portal

// Core Datasets
let scholarships = [];
let students = [];
let applications = [];
let overviewData = null;
let studentPortalData = null;

// UI Filter States
let appFilter = 'All';
let studentPage = 1;
const studentsPerPage = 12;

// Chart.js Instances
let chartStatus = null;
let chartDemand = null;
let chartFunding = null;
let chartCgpa = null;

// ====================================================
// 1. INITIALIZATION & AUTH STATE
// ====================================================

function getCurrentUser() {
    try {
        const u = localStorage.getItem('current_user');
        return u ? JSON.parse(u) : null;
    } catch (e) {
        return null;
    }
}

function renderAuthHeader() {
    currentUser = getCurrentUser();
    const container = document.getElementById('auth-header-container');
    if (!container) return;

    if (currentUser) {
        const role = currentUser.role || 'student';
        const roleIcon = role === 'admin' 
            ? `<svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
            : role === 'officer'
            ? `<svg class="icon" viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`
            : `<svg class="icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
        container.innerHTML = `
            <div class="user-profile-badge">
                <span style="display:flex; align-items:center; gap:0.4rem;">${roleIcon} <strong>${currentUser.name.split(' ')[0]}</strong></span>
                <span class="user-role ${role}">${role}</span>
                <button class="btn-outline btn-sm" onclick="logoutUser()" style="padding:0.18rem 0.5rem; font-size:0.72rem; border-color:transparent;">Sign out</button>
            </div>
        `;
    } else {
        container.innerHTML = `<a href="login.html" class="btn btn-sm">Sign In / Register</a>`;
    }
}

function logoutUser() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    currentUser = null;
    showToast('Signed out successfully', 'info');
    renderAuthHeader();
    switchPortal('admin');
    refreshAll();
}

function handleViewpointChange(val) {
    if (val === 'admin') {
        localStorage.setItem('current_user', JSON.stringify({
            name: 'Dr. Rajeshwar Sharma',
            email: 'admin@scholarship.gov.in',
            role: 'admin'
        }));
        showToast('Switched view to Admin: Dr. Rajeshwar Sharma', 'info');
        switchPortal('admin');
    } else if (val === 'officer') {
        localStorage.setItem('current_user', JSON.stringify({
            name: 'Sanjay Verma',
            email: 'officer@scholarship.gov.in',
            role: 'officer'
        }));
        showToast('Switched view to Review Officer: Sanjay Verma', 'info');
        switchPortal('admin');
    } else if (val.startsWith('student-')) {
        const sId = Number(val.split('-')[1]);
        activeStudentId = sId;
        const targetStudent = students.find(s => s.id === sId);
        if (targetStudent) {
            localStorage.setItem('current_user', JSON.stringify({
                name: targetStudent.name,
                email: targetStudent.email,
                role: 'student',
                student_id: sId
            }));
            showToast(`Switched view to Student: ${targetStudent.name}`, 'info');
            switchPortal('student');
        }
    }
    renderAuthHeader();
    refreshAll();
}

// ====================================================
// 2. PORTAL & NAVIGATION CONTROLLER
// ====================================================

function switchPortal(portal) {
    currentPortal = portal;
    const adminBtn = document.getElementById('btn-portal-admin');
    const studentBtn = document.getElementById('btn-portal-student');
    const adminView = document.getElementById('admin-portal-view');
    const studentView = document.getElementById('student-portal-view');
    const adminNav = document.getElementById('admin-sidebar-nav');
    const studentNav = document.getElementById('student-sidebar-nav');
    const bcRoot = document.getElementById('breadcrumb-portal-label');
    const bcSection = document.getElementById('breadcrumb-section-label');

    if (portal === 'admin') {
        if (adminBtn) adminBtn.classList.add('active');
        if (studentBtn) studentBtn.classList.remove('active');
        if (adminView) adminView.classList.add('active');
        if (studentView) studentView.classList.remove('active');
        if (adminNav) adminNav.style.display = 'block';
        if (studentNav) studentNav.style.display = 'none';
        if (bcRoot) bcRoot.textContent = 'Admin Portal';
        if (bcSection) bcSection.textContent = 'Executive Analytics';
    } else {
        if (studentBtn) studentBtn.classList.add('active');
        if (adminBtn) adminBtn.classList.remove('active');
        if (studentView) studentView.classList.add('active');
        if (adminView) adminView.classList.remove('active');
        if (adminNav) adminNav.style.display = 'none';
        if (studentNav) studentNav.style.display = 'block';
        if (bcRoot) bcRoot.textContent = 'Student Portal';
        if (bcSection) bcSection.textContent = 'Qualifying Schemes';
        renderStudentPortal();
    }
}

function switchAdminTab(tabId, btn) {
    document.querySelectorAll('#admin-portal-view .sub-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('#admin-sidebar-nav .nav-link-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');

    const bcSection = document.getElementById('breadcrumb-section-label');
    if (bcSection) {
        if (tabId === 'admin-analytics') bcSection.textContent = 'Executive Analytics';
        else if (tabId === 'admin-requests') bcSection.textContent = 'Review Scholarship Requests';
        else if (tabId === 'admin-scholarships') bcSection.textContent = 'Scholarships Directory';
        else if (tabId === 'admin-students') bcSection.textContent = 'Student Records';
        else if (tabId === 'admin-eligibility-inspector') bcSection.textContent = 'Eligibility Diagnostics';
    }

    if (tabId === 'admin-analytics') {
        setTimeout(renderCharts, 100);
    }
}

function switchStudentTab(tabId, btn) {
    document.querySelectorAll('#student-portal-view .student-sub-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('#student-sidebar-nav .nav-link-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');

    const bcSection = document.getElementById('breadcrumb-section-label');
    if (bcSection) {
        if (tabId === 'student-eligible-tab') bcSection.textContent = 'Qualifying Schemes';
        else if (tabId === 'student-my-apps-tab') bcSection.textContent = 'My Submitted Applications';
        else if (tabId === 'student-all-catalog-tab') bcSection.textContent = 'Full Scholarship Catalog';
    }
}

// ====================================================
// 3. CORE DATA FETCHING (REST API)
// ====================================================

async function fetchAllData() {
    try {
        const [scRes, stRes, appRes, ovRes] = await Promise.all([
            fetch(`${API_BASE}/scholarships`),
            fetch(`${API_BASE}/students`),
            fetch(`${API_BASE}/applications`),
            fetch(`${API_BASE}/overview`)
        ]);

        if (scRes.ok && stRes.ok && appRes.ok && ovRes.ok) {
            const scJson = await scRes.json();
            const stJson = await stRes.json();
            const appJson = await appRes.json();
            const ovJson = await ovRes.json();

            scholarships = scJson.data || [];
            students = stJson.data || [];
            applications = appJson.data || [];
            overviewData = ovJson.data || null;

            isBackendConnected = true;
            updateDbBadge(true, '● MongoDB Live');
            return true;
        } else {
            throw new Error('API request failed');
        }
    } catch (err) {
        console.warn('Backend API connection warning:', err);
        isBackendConnected = false;
        updateDbBadge(false, '● Offline Mode');
        return false;
    }
}

async function refreshAll() {
    renderAuthHeader();
    await fetchAllData();
    renderAdminKpis();
    renderCharts();
    renderApplications();
    renderScholarships();
    renderStudents();
    populateEligibilityDropdown();
    renderEligibility();
    if (currentPortal === 'student') {
        renderStudentPortal();
    }
}

// ====================================================
// 4. ADMIN PORTAL: EXECUTIVE KPIS & CHARTS
// ====================================================

function renderAdminKpis() {
    const kpiGrid = document.getElementById('admin-kpi-grid');
    if (!kpiGrid || !overviewData) return;

    const pendingCount = overviewData.pendingCount || 0;
    const approvedCount = overviewData.approvedCount || 0;
    const totalStudents = overviewData.totalStudents || students.length;
    const totalApprovedAmt = overviewData.totalApprovedAmount || 0;
    const avgCgpa = overviewData.averageCgpa || 0;

    // Update pending counter in sidebar
    const badgeCounter = document.getElementById('pending-badge-counter');
    if (badgeCounter) badgeCounter.textContent = pendingCount;

    // Integrated horizontal metrics bar (Clean glassmorphic style with subtle indicators)
    kpiGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${totalStudents}</div>
            <div class="stat-label">Registered Students</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                <span style="color:#60a5fa;">●</span> 100+ Enrolled
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${avgCgpa}</div>
            <div class="stat-label">Average CGPA</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                <span style="color:#a855f7;">●</span> Merit Benchmark
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color:#fbbf24; text-shadow:0 0 16px rgba(245, 158, 11, 0.3);">${pendingCount}</div>
            <div class="stat-label">Pending Requests</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                <span style="color:#fbbf24;">●</span> Audit Required
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color:#34d399; text-shadow:0 0 16px rgba(16, 185, 129, 0.3);">${approvedCount}</div>
            <div class="stat-label">Approved Applications</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                <span style="color:#34d399;">●</span> Verified Grants
            </div>
        </div>
        <div class="stat-card highlight">
            <div class="stat-value" style="color:#60a5fa; text-shadow:0 0 16px rgba(96, 165, 250, 0.3);">${formatINR(totalApprovedAmt)}</div>
            <div class="stat-label">Total Disbursed Funds</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                <span style="color:#60a5fa;">●</span> Allocated AY 26-27
            </div>
        </div>
    `;

    // Applications per scholarship demand list
    const appsPerScholarshipDiv = document.getElementById('apps-per-scholarship');
    if (appsPerScholarshipDiv && overviewData.applicationsPerScholarship) {
        appsPerScholarshipDiv.innerHTML = overviewData.applicationsPerScholarship.map(sc => `
            <div class="list-row">
                <span><strong>${sc.name}</strong> <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span></span>
                <strong>${sc.count} requests</strong>
            </div>
        `).join('');
    }

    // Unapplied students list
    const unappliedDiv = document.getElementById('unapplied-students');
    if (unappliedDiv && overviewData.unappliedStudents) {
        const unapplied = overviewData.unappliedStudents;
        if (unapplied.length === 0) {
            unappliedDiv.innerHTML = `<p class="subtitle">Every registered student has submitted at least one scholarship application.</p>`;
        } else {
            unappliedDiv.innerHTML = `<p class="subtitle" style="margin-bottom:0.6rem;">${overviewData.unappliedStudentsCount} candidates have not submitted any applications:</p>` +
                unapplied.slice(0, 5).map(s => `
                    <div class="list-row">
                        <span><strong>${s.name}</strong> (${s.course}, CGPA ${Number(s.cgpa).toFixed(2)})</span>
                        <button class="btn-outline btn-sm" onclick="jumpToEligibility(${s.id})">Diagnose</button>
                    </div>
                `).join('');
        }
    }
}

// Chart.js Analytical Render (Restrained Academic Theme)
function renderCharts() {
    if (typeof Chart === 'undefined' || !overviewData) return;

    // Chart 1: Application Lifecycle Status (Doughnut)
    const ctxStatus = document.getElementById('chart-status');
    if (ctxStatus) {
        if (chartStatus) chartStatus.destroy();
        chartStatus = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending Review', 'Rejected'],
                datasets: [{
                    data: [
                        overviewData.approvedCount || 0,
                        overviewData.pendingCount || 0,
                        overviewData.rejectedCount || 0
                    ],
                    backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(239, 68, 68, 0.85)'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#334155', font: { size: 11, weight: '550' }, padding: 16 }
                    }
                },
                cutout: '72%'
            }
        });
    }

    // Chart 2: Demand per Scholarship (Bar)
    const ctxDemand = document.getElementById('chart-scholarships-demand');
    if (ctxDemand && overviewData.applicationsPerScholarship) {
        if (chartDemand) chartDemand.destroy();
        const labels = overviewData.applicationsPerScholarship.map(s => s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name);
        const counts = overviewData.applicationsPerScholarship.map(s => s.count);

        chartDemand = new Chart(ctxDemand, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Applications Received',
                    data: counts,
                    backgroundColor: 'rgba(37, 99, 235, 0.78)',
                    borderColor: '#2563eb',
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: '#475569', stepSize: 1 }, grid: { color: 'rgba(148, 163, 184, 0.18)' } }
                }
            }
        });
    }

    // Chart 3: Approved Funds by Funding Type (Polar)
    const ctxFunding = document.getElementById('chart-funding');
    if (ctxFunding && overviewData.fundingDistribution) {
        if (chartFunding) chartFunding.destroy();
        const fTypes = Object.keys(overviewData.fundingDistribution);
        const fAmounts = Object.values(overviewData.fundingDistribution);

        chartFunding = new Chart(ctxFunding, {
            type: 'polarArea',
            data: {
                labels: fTypes.length ? fTypes : ['National', 'State Govt', 'Private', 'Corporate', 'International'],
                datasets: [{
                    data: fAmounts.length ? fAmounts : [50000, 20000, 30000, 40000, 75000],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.75)',
                        'rgba(16, 185, 129, 0.75)',
                        'rgba(245, 158, 11, 0.75)',
                        'rgba(147, 51, 234, 0.75)',
                        'rgba(236, 72, 153, 0.75)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#334155', font: { size: 10, weight: '550' } } }
                },
                scales: {
                    r: { ticks: { display: false }, grid: { color: 'rgba(148, 163, 184, 0.18)' } }
                }
            }
        });
    }

    // Chart 4: CGPA Ranges (Bar)
    const ctxCgpa = document.getElementById('chart-cgpa');
    if (ctxCgpa && overviewData.cgpaRanges) {
        if (chartCgpa) chartCgpa.destroy();
        chartCgpa = new Chart(ctxCgpa, {
            type: 'bar',
            data: {
                labels: Object.keys(overviewData.cgpaRanges),
                datasets: [{
                    label: 'Students Count',
                    data: Object.values(overviewData.cgpaRanges),
                    backgroundColor: 'rgba(96, 165, 250, 0.78)',
                    borderColor: '#3b82f6',
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#475569' }, grid: { display: false } },
                    y: { ticks: { color: '#475569' }, grid: { color: 'rgba(148, 163, 184, 0.18)' } }
                }
            }
        });
    }
}

// ====================================================
// 5. ADMIN REVIEW SCHOLARSHIP REQUESTS DESK
// ====================================================

function setAppFilter(status, btn) {
    appFilter = status;
    document.querySelectorAll('#app-status-pills .pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderApplications();
}

function renderApplications() {
    const query = (document.getElementById('request-search')?.value || '').toLowerCase();
    const tbody = document.getElementById('applications-tbody');
    const infoCount = document.getElementById('requests-count-info');
    if (!tbody) return;

    const filtered = applications.filter(a => {
        const matchesFilter = appFilter === 'All' || a.status === appFilter;
        const matchesSearch = !query ||
            (a.student_name || '').toLowerCase().includes(query) ||
            (a.scholarship_name || '').toLowerCase().includes(query) ||
            (a.remarks || '').toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    if (infoCount) {
        infoCount.textContent = `Showing ${filtered.length} of ${applications.length} applications`;
    }

    tbody.innerHTML = filtered.length ? filtered.map(a => {
        const student = a.student || students.find(s => s.id === a.student_id) || { name: 'Unknown', course: '', cgpa: 0 };
        const sc = a.scholarship || scholarships.find(s => s.id === a.scholarship_id) || { name: 'Unknown', amount: 0, funding_type: '', institution_type: '' };
        const statusClass = a.status === 'Approved' ? 'badge-green' : a.status === 'Rejected' ? 'badge-red' : 'badge-yellow';

        return `
            <tr>
                <td>
                    <strong>${student.name}</strong>
                    <div class="sub-text">${student.course || ''} · CGPA ${student.cgpa ? Number(student.cgpa).toFixed(2) : '-'}</div>
                </td>
                <td>
                    <strong>${sc.scholarship_name || sc.name}</strong> <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                    <div class="sub-text">${formatINR(sc.amount)} · ${sc.institution_type || ''}</div>
                </td>
                <td>${a.date || a.application_date}</td>
                <td><span class="badge ${statusClass}">${a.status}</span></td>
                <td><span style="font-size:0.84rem; color:var(--text-secondary);">${a.remarks}</span></td>
                <td>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                        <button class="btn btn-sm" onclick="openReviewModal(${a.id})">
                            <svg class="icon" viewBox="0 0 24 24" style="width:13px;height:13px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m8 11 2 2 4-4"/></svg>
                            <span>Audit</span>
                        </button>
                        ${a.status === 'Pending' ? `
                            <button class="btn-outline btn-sm" onclick="quickDecision(${a.id}, 'Approved')" title="Approve">✓</button>
                            <button class="btn-outline btn-sm" onclick="quickDecision(${a.id}, 'Rejected')" title="Reject">✕</button>
                        ` : ''}
                        <button class="btn-outline btn-sm" onclick="deleteApp(${a.id})" title="Delete record" style="color:var(--text-muted); padding:0.35rem 0.5rem;">
                            <svg class="icon" viewBox="0 0 24 24" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('') : `<tr><td colspan="6" class="subtitle" style="text-align:center; padding: 2rem;">No applications found matching the selected filter.</td></tr>`;
}

// Open Dedicated Review & Audit Modal
function openReviewModal(appId) {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const student = students.find(s => s.id === app.student_id) || { name: 'Student #' + app.student_id, course: 'BTech', cgpa: 8.0, income: 150000, category: 'General', email: '' };
    const sc = scholarships.find(s => s.id === app.scholarship_id) || { name: 'Scholarship #' + app.scholarship_id, min_cgpa: 7.0, max_income: 300000, category: 'All', amount: 25000 };

    document.getElementById('rev-app-id').value = appId;
    document.getElementById('review-modal-subtitle').textContent = `Application Audit Record #${appId} · Submitted ${app.date || app.application_date}`;
    document.getElementById('rev-remarks').value = app.remarks || '';

    // Render Student profile snapshot
    document.getElementById('rev-student-info').innerHTML = `
        <div class="review-field"><span class="review-field-label">Student:</span><span class="review-field-val">${student.name}</span></div>
        <div class="review-field"><span class="review-field-label">Email:</span><span class="review-field-val">${student.email || 'N/A'}</span></div>
        <div class="review-field"><span class="review-field-label">Course:</span><span class="review-field-val">${student.course}, Year ${student.year || student.year_of_study || 1}</span></div>
        <div class="review-field"><span class="review-field-label">CGPA:</span><span class="review-field-val" style="color:#60a5fa;">${Number(student.cgpa).toFixed(2)}</span></div>
        <div class="review-field"><span class="review-field-label">Income:</span><span class="review-field-val">${formatINR(student.income || student.family_income)}</span></div>
        <div class="review-field"><span class="review-field-label">Category:</span><span class="review-field-val">${student.category}</span></div>
    `;

    // Render Scholarship terms snapshot
    document.getElementById('rev-scholarship-info').innerHTML = `
        <div class="review-field"><span class="review-field-label">Scheme:</span><span class="review-field-val">${sc.name || sc.scholarship_name}</span></div>
        <div class="review-field"><span class="review-field-label">Grant Award:</span><span class="review-field-val" style="font-size:0.95rem;">${formatINR(sc.amount)}</span></div>
        <div class="review-field"><span class="review-field-label">Required CGPA:</span><span class="review-field-val">${Number(sc.min_cgpa).toFixed(2)}+</span></div>
        <div class="review-field"><span class="review-field-label">Income Ceiling:</span><span class="review-field-val">Up to ${formatINR(sc.max_income)}</span></div>
        <div class="review-field"><span class="review-field-label">Eligible Category:</span><span class="review-field-val">${sc.category || sc.eligible_category}</span></div>
        <div class="review-field"><span class="review-field-label">Deadline:</span><span class="review-field-val">${sc.deadline}</span></div>
    `;

    // Automated Criteria Verification Checklist
    const cgpaPass = (student.cgpa || 0) >= (sc.min_cgpa || 0);
    const incomePass = (student.income || student.family_income || 0) <= (sc.max_income || 9999999);
    const categoryPass = (sc.category === 'All' || sc.eligible_category === 'All' || student.category === sc.category || student.category === sc.eligible_category);

    document.getElementById('rev-criteria-checklist').innerHTML = `
        <div class="criteria-row ${cgpaPass ? 'pass' : 'fail'}">
            <span><strong>CGPA Verification:</strong> Candidate has ${Number(student.cgpa).toFixed(2)} (Scheme requires ${Number(sc.min_cgpa).toFixed(2)})</span>
            <span class="badge ${cgpaPass ? 'badge-green' : 'badge-red'}">${cgpaPass ? '✓ MET' : '✕ BELOW CRITERIA'}</span>
        </div>
        <div class="criteria-row ${incomePass ? 'pass' : 'fail'}">
            <span><strong>Income Verification:</strong> Candidate income ${formatINR(student.income || student.family_income)} (Ceiling ${formatINR(sc.max_income)})</span>
            <span class="badge ${incomePass ? 'badge-green' : 'badge-red'}">${incomePass ? '✓ WITHIN LIMIT' : '✕ EXCEEDS CEILING'}</span>
        </div>
        <div class="criteria-row ${categoryPass ? 'pass' : 'fail'}">
            <span><strong>Category Check:</strong> Candidate is ${student.category} (Accepted: ${sc.category || sc.eligible_category})</span>
            <span class="badge ${categoryPass ? 'badge-green' : 'badge-red'}">${categoryPass ? '✓ ELIGIBLE' : '✕ MISMATCH'}</span>
        </div>
    `;

    openModal('review-modal');
}

function setRevRemark(txt) {
    document.getElementById('rev-remarks').value = txt;
}

async function executeDecision(status) {
    const appId = Number(document.getElementById('rev-app-id').value);
    const remarks = document.getElementById('rev-remarks').value.trim();

    await submitStatusChange(appId, status, remarks);
    closeModal('review-modal');
}

async function quickDecision(appId, status) {
    const defaultRemark = status === 'Approved' ? 'Eligible for scholarship' : 'Does not meet criteria';
    await submitStatusChange(appId, status, defaultRemark);
}

async function submitStatusChange(id, status, remarks) {
    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/applications/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, remarks })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Application #${id} updated: ${status}`, 'success');
                await refreshAll();
                return;
            } else {
                showToast(data.message || 'Failed to update application status', 'error');
            }
        } catch (e) {
            showToast('Network error updating status', 'error');
        }
    }

    // Local fallback
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = status;
        app.remarks = remarks || (status === 'Approved' ? 'Eligible for scholarship' : 'Does not meet criteria');
        showToast(`Application #${id} marked as ${status}`, 'success');
        refreshAll();
    }
}

// ====================================================
// 6. DEDICATED STUDENT PORTAL (RESTRAINED ACADEMIC)
// ====================================================

async function renderStudentPortal() {
    let student = students.find(s => s.id === activeStudentId) || students[0];
    if (!student) return;

    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/student-portal/${student.id}`);
            if (res.ok) {
                const data = await res.json();
                studentPortalData = data;
                renderStudentPortalViews(data.student, data.stats, data.eligibleScholarships, data.myApplications);
                return;
            }
        } catch (e) {
            console.warn('Student portal API fallback:', e);
        }
    }

    // Client-side fallback calculation
    const myApps = applications.filter(a => a.student_id === student.id).map(a => {
        const sc = scholarships.find(s => s.id === a.scholarship_id) || {};
        return {
            id: a.id,
            scholarship_id: a.scholarship_id,
            scholarship_name: sc.name || 'Scholarship #' + a.scholarship_id,
            amount: sc.amount || 0,
            funding_type: sc.funding_type || '',
            institution_type: sc.institution_type || '',
            date: a.date || a.application_date,
            status: a.status,
            remarks: a.remarks
        };
    });

    const appliedIds = new Set(myApps.map(a => a.scholarship_id));
    const eligibleSc = [];
    let potentialGrant = 0;
    let approvedGrant = 0;

    scholarships.forEach(sc => {
        const pass = student.cgpa >= sc.min_cgpa &&
                     student.income <= sc.max_income &&
                     (sc.category === 'All' || student.category === sc.category);
        if (pass) {
            potentialGrant += sc.amount;
            eligibleSc.push({
                id: sc.id,
                name: sc.name,
                amount: sc.amount,
                funding_type: sc.funding_type,
                institution_type: sc.institution_type,
                deadline: sc.deadline,
                min_cgpa: sc.min_cgpa,
                max_income: sc.max_income,
                category: sc.category,
                applied: appliedIds.has(sc.id),
                application: myApps.find(a => a.scholarship_id === sc.id) || null
            });
        }
    });

    myApps.filter(a => a.status === 'Approved').forEach(a => approvedGrant += a.amount);

    const stats = {
        eligibleCount: eligibleSc.length,
        totalScholarships: scholarships.length,
        applicationsCount: myApps.length,
        totalPotentialGrant: potentialGrant,
        totalApprovedGrant: approvedGrant
    };

    renderStudentPortalViews(student, stats, eligibleSc, myApps);
}

function renderStudentPortalViews(student, stats, eligibleList, myApps) {
    // 1. Hero Profile Banner (Clean, Academic, Not Oversized)
    const hero = document.getElementById('student-hero-profile');
    if (hero) {
        hero.innerHTML = `
            <div class="student-hero-info">
                <div class="student-avatar">${student.name.charAt(0)}</div>
                <div class="student-hero-text">
                    <h2>${student.name}</h2>
                    <p class="subtitle">${student.course} · Year ${student.year || student.year_of_study || 1} · Student ID #${student.id || student.student_id} · ${student.email}</p>
                    <div class="student-hero-pills">
                        <span class="badge badge-gray">CGPA: <strong>${Number(student.cgpa).toFixed(2)}</strong></span>
                        <span class="badge badge-gray">Family Income: <strong>${formatINR(student.income || student.family_income)}</strong></span>
                        <span class="badge badge-gray">Category: <strong>${student.category}</strong></span>
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size:0.76rem; color:var(--text-muted); text-transform:uppercase; font-weight:600;">Student:</label>
                <select style="background:var(--bg-input); color:var(--text-primary); font-size:0.8rem; padding:0.35rem 0.6rem;" onchange="activeStudentId=Number(this.value); renderStudentPortal();">
                    ${students.slice(0, 15).map(s => `
                        <option value="${s.id}" ${s.id === (student.id || student.student_id) ? 'selected' : ''}>${s.name} (${s.category}, CGPA ${s.cgpa})</option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    // 2. Student Metrics Strip (Clean glassmorphic bar with status indicators)
    const statsRow = document.getElementById('student-stats-row');
    if (statsRow) {
        statsRow.innerHTML = `
            <div class="stat-card">
                <div class="stat-value" style="color:#34d399; text-shadow:0 0 16px rgba(16, 185, 129, 0.3);">${stats.eligibleCount} of ${scholarships.length}</div>
                <div class="stat-label">Qualifying Schemes</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                    <span style="color:#34d399;">●</span> Matches CGPA & Income
                </div>
            </div>
            <div class="stat-card highlight">
                <div class="stat-value" style="color:#60a5fa; text-shadow:0 0 16px rgba(96, 165, 250, 0.3);">${formatINR(stats.totalPotentialGrant)}</div>
                <div class="stat-label">Potential Grant Value</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                    <span style="color:#60a5fa;">●</span> Available Aid Cap
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${myApps.length}</div>
                <div class="stat-label">Submitted Applications</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                    <span style="color:#a855f7;">●</span> Active In Pipeline
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color:#fbbf24; text-shadow:0 0 16px rgba(245, 158, 11, 0.3);">${formatINR(stats.totalApprovedGrant)}</div>
                <div class="stat-label">Approved Scholarships Total</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem;">
                    <span style="color:#fbbf24;">●</span> Verified Grants
                </div>
            </div>
        `;
    }

    // 3. Recommended Eligible Scholarships
    const eligibleContainer = document.getElementById('student-eligible-cards');
    if (eligibleContainer) {
        eligibleContainer.innerHTML = eligibleList.length ? eligibleList.map(item => {
            const sc = item.scholarship || item;
            const hasApplied = item.applied;
            const app = item.application;

            let actionHtml = '';
            if (hasApplied && app) {
                const statusBadge = app.status === 'Approved' ? 'badge-green' : app.status === 'Rejected' ? 'badge-red' : 'badge-yellow';
                actionHtml = `
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="badge ${statusBadge}">${app.status}</span>
                        <span class="sub-text" style="font-size:0.78rem;">Submitted on ${app.date || app.application_date}</span>
                    </div>
                `;
            } else {
                actionHtml = `<button class="btn btn-sm" onclick="applyScholarship(${student.id || student.student_id}, ${sc.id || sc.scholarship_id})">Submit Application</button>`;
            }

            return `
                <div class="scholarship-card eligible-border">
                    <div>
                        <div class="card-top">
                            <div class="card-title">${sc.name || sc.scholarship_name}</div>
                            <div class="card-amount">${formatINR(sc.amount)}</div>
                        </div>
                        <div class="tags-row">
                            <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                            <span class="badge badge-gray">${sc.institution_type}</span>
                            <span class="badge badge-green">✓ Eligible</span>
                        </div>
                        <div class="card-meta">
                            Min CGPA ${Number(sc.min_cgpa).toFixed(2)}+ (Your CGPA: <strong>${Number(student.cgpa).toFixed(2)}</strong>)<br>
                            Income Ceiling: ${formatINR(sc.max_income)} · Deadline: <strong>${sc.deadline}</strong>
                        </div>
                    </div>
                    <div class="card-footer">
                        ${actionHtml}
                    </div>
                </div>
            `;
        }).join('') : `<p class="subtitle" style="padding:1.5rem;">No qualifying scholarships found matching your criteria at this moment.</p>`;
    }

    // 4. Applications Tracker with Milestone Progress
    const appsTracker = document.getElementById('student-applications-tracker');
    if (appsTracker) {
        appsTracker.innerHTML = myApps.length ? myApps.map(a => {
            const isApproved = a.status === 'Approved';
            const isRejected = a.status === 'Rejected';
            const isPending = a.status === 'Pending';

            return `
                <div class="app-track-card">
                    <div class="app-track-left">
                        <h3>${a.scholarship_name} <span class="badge ${getFundingBadgeClass(a.funding_type)}">${a.funding_type}</span></h3>
                        <div class="app-track-meta">
                            <span>Award: <strong>${formatINR(a.amount)}</strong></span>
                            <span>Submitted: <strong>${a.date}</strong></span>
                            <span>Audit Remarks: <em>"${a.remarks}"</em></span>
                        </div>
                    </div>
                    <div class="app-track-stepper">
                        <div class="stepper-step completed">
                            <div class="stepper-circle">
                                <svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <span>Submitted</span>
                        </div>
                        <div class="stepper-line ${isPending ? '' : 'done'}"></div>
                        <div class="stepper-step ${isPending ? 'active-pending' : 'completed'}">
                            <div class="stepper-circle">
                                ${isPending 
                                    ? `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
                                    : `<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`}
                            </div>
                            <span>In Review</span>
                        </div>
                        <div class="stepper-line ${isPending ? '' : 'done'}"></div>
                        <div class="stepper-step ${isApproved ? 'completed' : isRejected ? 'active-rejected' : ''}">
                            <div class="stepper-circle">
                                ${isApproved 
                                    ? `<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>` 
                                    : isRejected 
                                    ? `<svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
                                    : '3'}
                            </div>
                            <span>${isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Decision'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('') : `
            <div class="panel" style="text-align:center; padding:2rem;">
                <p class="subtitle">You have not submitted any scholarship requests yet.</p>
                <button class="btn btn-sm" style="margin-top:0.75rem;" onclick="switchStudentTab('student-eligible-tab', document.querySelectorAll('#student-sidebar-nav .nav-link-btn')[0])">Browse Eligible Schemes</button>
            </div>
        `;
    }

    // 5. Complete Catalog
    const catalogCards = document.getElementById('student-catalog-cards');
    if (catalogCards) {
        catalogCards.innerHTML = scholarships.map(sc => {
            const eligible = student.cgpa >= sc.min_cgpa && student.income <= sc.max_income && (sc.category === 'All' || student.category === sc.category);
            return `
                <div class="scholarship-card ${eligible ? 'eligible-border' : ''}">
                    <div>
                        <div class="card-top">
                            <div class="card-title">${sc.name}</div>
                            <div class="card-amount">${formatINR(sc.amount)}</div>
                        </div>
                        <div class="tags-row">
                            <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                            <span class="badge badge-gray">${sc.institution_type}</span>
                            ${eligible ? '<span class="badge badge-green">Eligible</span>' : '<span class="badge badge-red">Not Eligible</span>'}
                        </div>
                        <div class="card-meta">
                            Needs CGPA ${Number(sc.min_cgpa).toFixed(2)}+ · Max Income ${formatINR(sc.max_income)}<br>
                            Accepted Category: <strong>${sc.category}</strong> · Deadline: ${sc.deadline}
                        </div>
                    </div>
                    <div class="card-footer">
                        <span class="badge badge-gray">Due ${sc.deadline}</span>
                        ${eligible ? `<button class="btn btn-sm" onclick="applyScholarship(${student.id || student.student_id}, ${sc.id})">Apply</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ====================================================
// 7. COMMON UTILITIES & SCHOLARSHIPS DIRECTORY
// ====================================================

function renderScholarships() {
    const fundFilter = document.getElementById('filter-funding')?.value || 'All';
    const instFilter = document.getElementById('filter-institution')?.value || 'All';
    const grid = document.getElementById('scholarships-grid');
    if (!grid) return;

    const sorted = [...scholarships]
        .filter(sc => (fundFilter === 'All' || sc.funding_type === fundFilter) && (instFilter === 'All' || sc.institution_type === instFilter))
        .sort((a, b) => b.amount - a.amount);

    grid.innerHTML = sorted.map(sc => {
        const appCount = applications.filter(a => a.scholarship_id === sc.id).length;
        return `
            <div class="scholarship-card">
                <div>
                    <div class="card-top">
                        <div class="card-title">${sc.name}</div>
                        <div class="card-amount">${formatINR(sc.amount)}</div>
                    </div>
                    <div class="tags-row">
                        <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                        <span class="badge badge-gray">${sc.institution_type}</span>
                    </div>
                    <div class="card-meta">
                        Minimum CGPA: <strong>${Number(sc.min_cgpa).toFixed(2)}</strong> · Family Income Limit: <strong>${formatINR(sc.max_income)}</strong><br>
                        Reserved Category: <strong>${sc.category}</strong>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="badge badge-gray">Due ${sc.deadline}</span>
                    <span class="meta-tag">${appCount} requests received</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderStudents() {
    const query = (document.getElementById('student-search')?.value || '').toLowerCase();
    const catFilter = document.getElementById('student-category-filter')?.value || 'All';
    const tbody = document.getElementById('students-tbody');
    const pagination = document.getElementById('students-pagination');
    if (!tbody) return;

    const filtered = students.filter(s => {
        const matchesText = (s.name || '').toLowerCase().includes(query) ||
                            (s.course || '').toLowerCase().includes(query) ||
                            (s.email || '').toLowerCase().includes(query) ||
                            (s.category || '').toLowerCase().includes(query);
        const matchesCat = catFilter === 'All' || s.category === catFilter;
        return matchesText && matchesCat;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / studentsPerPage));
    if (studentPage > totalPages) studentPage = totalPages;
    const start = (studentPage - 1) * studentsPerPage;
    const pageItems = filtered.slice(start, start + studentsPerPage);

    tbody.innerHTML = pageItems.length ? pageItems.map(s => `
        <tr>
            <td>#${s.id}</td>
            <td><strong>${s.name}</strong><span class="sub-text">${s.email}</span></td>
            <td>${s.course}</td>
            <td>Year ${s.year || s.year_of_study || 1}</td>
            <td><strong>${Number(s.cgpa).toFixed(2)}</strong></td>
            <td>${formatINR(s.income || s.family_income)}</td>
            <td><span class="badge badge-gray">${s.category}</span></td>
            <td><button class="btn-outline btn-sm" onclick="jumpToEligibility(${s.id})">Diagnose</button></td>
        </tr>
    `).join('') : `<tr><td colspan="8" class="subtitle" style="text-align:center;">No students found matching your criteria.</td></tr>`;

    if (pagination) {
        pagination.innerHTML = `
            <span>Showing ${filtered.length ? start + 1 : 0}–${Math.min(start + studentsPerPage, filtered.length)} of ${filtered.length} candidates</span>
            <div style="display:flex; gap:0.5rem; align-items:center;">
                <button class="btn-outline btn-sm" ${studentPage <= 1 ? 'disabled' : ''} onclick="studentPage--; renderStudents()">Previous</button>
                <span style="padding: 0.2rem 0.5rem;">Page ${studentPage} of ${totalPages}</span>
                <button class="btn-outline btn-sm" ${studentPage >= totalPages ? 'disabled' : ''} onclick="studentPage++; renderStudents()">Next</button>
            </div>
        `;
    }
}

// Eligibility Diagnostics Section
function populateEligibilityDropdown() {
    const select = document.getElementById('eligibility-student-select');
    if (!select || !students.length) return;
    const currentVal = select.value;
    select.innerHTML = students.map(s => `<option value="${s.id}">${s.id}. ${s.name} (${s.course}, CGPA ${s.cgpa})</option>`).join('');
    if (currentVal && students.some(s => s.id == currentVal)) {
        select.value = currentVal;
    }
}

function jumpToEligibility(studentId) {
    switchPortal('admin');
    const inspBtn = document.querySelectorAll('#admin-sidebar-nav .nav-link-btn')[4];
    switchAdminTab('admin-eligibility-inspector', inspBtn);
    const select = document.getElementById('eligibility-student-select');
    if (select) {
        select.value = studentId;
        renderEligibility();
    }
}

async function renderEligibility() {
    const select = document.getElementById('eligibility-student-select');
    if (!select || !students.length) return;

    const studentId = Number(select.value) || students[0].id;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const metaSpan = document.getElementById('eligibility-student-meta');
    if (metaSpan) {
        metaSpan.textContent = `${student.course}, Year ${student.year || 1} · CGPA ${Number(student.cgpa).toFixed(2)} · Income ${formatINR(student.income || student.family_income)} · ${student.category}`;
    }

    let qualifiedCount = 0;
    let maxWorth = 0;

    const cardsHtml = scholarships.map(sc => {
        const reasons = [];
        if (student.cgpa < sc.min_cgpa) reasons.push(`Requires CGPA ${sc.min_cgpa.toFixed(2)}+`);
        if ((student.income || student.family_income) > sc.max_income) reasons.push(`Income exceeds ceiling ${formatINR(sc.max_income)}`);
        if (sc.category !== 'All' && student.category !== sc.category) reasons.push(`Category mismatch: Scheme restricted to ${sc.category}`);

        const isEligible = reasons.length === 0;
        if (isEligible) {
            qualifiedCount++;
            maxWorth += sc.amount;
        }

        const existingApp = applications.find(a => a.student_id === student.id && a.scholarship_id === sc.id);

        let actionHtml = '';
        if (!isEligible) {
            actionHtml = `<span class="badge badge-red">Not eligible</span>`;
        } else if (existingApp) {
            const statusBadge = existingApp.status === 'Approved' ? 'badge-green' : existingApp.status === 'Rejected' ? 'badge-red' : 'badge-yellow';
            actionHtml = `
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span class="badge badge-green">Eligible</span>
                    <span class="badge ${statusBadge}">${existingApp.status}</span>
                </div>`;
        } else {
            actionHtml = `
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span class="badge badge-green">Eligible</span>
                    <button class="btn btn-sm" onclick="applyScholarship(${student.id}, ${sc.id})">Submit Request</button>
                </div>`;
        }

        return `
            <div class="scholarship-card ${isEligible ? 'eligible-border' : ''}">
                <div>
                    <div class="card-top">
                        <div class="card-title">${sc.name}</div>
                        <div class="card-amount">${formatINR(sc.amount)}</div>
                    </div>
                    <div class="tags-row">
                        <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                        <span class="badge badge-gray">${sc.institution_type}</span>
                    </div>
                    <div class="card-meta">
                        Prerequisites: CGPA ${sc.min_cgpa.toFixed(2)}+ · Income up to ${formatINR(sc.max_income)} · ${sc.category} · Due ${sc.deadline}
                        ${reasons.length ? `<ul style="margin-top:0.4rem; padding-left:1.2rem; color:var(--text-secondary); font-size:0.78rem;"><li>${reasons.join('</li><li>')}</li></ul>` : ''}
                    </div>
                </div>
                <div class="card-footer">
                    ${actionHtml}
                </div>
            </div>
        `;
    }).join('');

    const summaryEl = document.getElementById('eligibility-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `<strong>${student.name}</strong> qualifies for <strong>${qualifiedCount} of ${scholarships.length}</strong> scholarship schemes, worth up to <strong>${formatINR(maxWorth)}</strong> in total grant value.`;
    }
    const cardsEl = document.getElementById('eligibility-cards');
    if (cardsEl) {
        cardsEl.innerHTML = cardsHtml;
    }
}

// ====================================================
// 8. DATA MODIFICATIONS (APPLY, ADD, DELETE, RESEED)
// ====================================================

async function applyScholarship(studentId, scholarshipId) {
    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, scholarship_id: scholarshipId })
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Scholarship application submitted successfully!', 'success');
                await refreshAll();
                return;
            } else {
                showToast(data.message || 'Error submitting application', 'error');
            }
        } catch (e) {
            showToast('Network error while submitting request', 'error');
        }
    }

    const newId = applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1;
    applications.unshift({
        id: newId,
        student_id: studentId,
        scholarship_id: scholarshipId,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        remarks: 'Application submitted'
    });
    showToast('Application submitted (Offline mode)', 'success');
    refreshAll();
}

async function deleteApp(id) {
    if (currentUser && currentUser.role === 'student') {
        showToast('Permission denied: Only Review Officers or Admins can delete applications.', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this application record?')) return;

    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast(`Application #${id} deleted`, 'info');
                await refreshAll();
                return;
            }
        } catch (e) {
            showToast('Network error deleting application', 'error');
        }
    }

    applications = applications.filter(a => a.id !== id);
    showToast(`Application #${id} deleted`, 'info');
    refreshAll();
}

async function addStudent(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('st-name').value,
        email: document.getElementById('st-email').value,
        course: document.getElementById('st-course').value,
        year: Number(document.getElementById('st-year').value),
        cgpa: Number(document.getElementById('st-cgpa').value),
        income: Number(document.getElementById('st-income').value),
        category: document.getElementById('st-category').value
    };

    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Candidate ${payload.name} enrolled in registry!`, 'success');
                e.target.reset();
                closeModal('student-modal');
                await refreshAll();
                return;
            } else {
                showToast(data.message || 'Failed to add student', 'error');
                return;
            }
        } catch (err) {
            showToast('Network error adding student', 'error');
        }
    }

    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.unshift({ id: newId, ...payload });
    e.target.reset();
    closeModal('student-modal');
    showToast(`Candidate ${payload.name} added`, 'success');
    refreshAll();
}

async function addScholarship(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('sc-name').value,
        amount: Number(document.getElementById('sc-amount').value),
        funding_type: document.getElementById('sc-funding').value,
        institution_type: document.getElementById('sc-institution').value,
        min_cgpa: Number(document.getElementById('sc-cgpa').value),
        max_income: Number(document.getElementById('sc-income').value),
        category: document.getElementById('sc-category').value,
        deadline: document.getElementById('sc-deadline').value
    };

    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/scholarships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Scholarship "${payload.name}" cataloged in database!`, 'success');
                e.target.reset();
                closeModal('scholarship-modal');
                await refreshAll();
                return;
            } else {
                showToast(data.message || 'Failed to create scholarship', 'error');
                return;
            }
        } catch (err) {
            showToast('Network error adding scholarship', 'error');
        }
    }

    const newId = scholarships.length ? Math.max(...scholarships.map(s => s.id)) + 1 : 1;
    scholarships.push({ id: newId, ...payload });
    e.target.reset();
    closeModal('scholarship-modal');
    showToast(`Scholarship "${payload.name}" saved`, 'success');
    refreshAll();
}

async function reseedDatabase() {
    if (!confirm('Reset MongoDB database and reload the 100 students, 8 scholarships, and 15 applications?')) return;

    if (isBackendConnected) {
        try {
            const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
            if (res.ok) {
                showToast('Database reset and seeded successfully!', 'success');
                await refreshAll();
                return;
            }
        } catch (e) {
            showToast('Network error during reset', 'error');
        }
    } else {
        showToast('Backend not connected for reset', 'error');
    }
}

// Helpers
function formatINR(num) {
    return '₹' + Number(num || 0).toLocaleString('en-IN');
}

function getFundingBadgeClass(type) {
    if (type === 'International') return 'badge-purple';
    if (type === 'National') return 'badge-blue';
    if (type === 'Private' || type === 'Corporate') return 'badge-yellow';
    return 'badge-green';
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
}

function updateDbBadge(connected, text) {
    const badge = document.getElementById('db-status-badge');
    if (!badge) return;
    if (connected) {
        badge.className = 'badge badge-green';
        badge.textContent = text || '● Live';
    } else {
        badge.className = 'badge badge-yellow';
        badge.textContent = text || '● Offline';
    }
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// Initial execution
refreshAll();
