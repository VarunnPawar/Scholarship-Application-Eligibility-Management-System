// login.js - Authentication Client Logic
const API_BASE = '/api';

// Toggle between Sign In and Sign Up tabs
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const subtitle = document.getElementById('auth-subtitle');
    const alertBox = document.getElementById('auth-alert');

    alertBox.style.display = 'none';

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        subtitle.textContent = 'Sign in to check eligibility, track applications, and manage awards.';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabLoginBtn.classList.remove('active');
        tabRegisterBtn.classList.add('active');
        subtitle.textContent = 'Register your student profile or officer account to get started.';
    }
}

// Show/Hide password field
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// Show error or success banner
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('auth-alert');
    if (!alertBox) return;
    alertBox.className = `auth-alert ${type}`;
    alertBox.textContent = message;
    alertBox.style.display = 'block';
}

// Dynamic toggle of student specific fields
function handleRoleChange() {
    const roleRadio = document.querySelector('input[name="reg-role"]:checked');
    const studentFields = document.getElementById('student-specific-fields');
    if (!roleRadio || !studentFields) return;

    if (roleRadio.value === 'student') {
        studentFields.style.display = 'block';
    } else {
        studentFields.style.display = 'none';
    }
}

// Handle Login Submission
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit-btn');

    if (!email || !password) {
        showAlert('Please enter both email and password.');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Signing in...</span>';

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            showAlert('Login successful! Redirecting...', 'success');
            // Save token and user details to localStorage
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('current_user', JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        } else {
            showAlert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (err) {
        console.error('Login error:', err);
        showAlert('Network error. Make sure the Node.js server is running on port 5050.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span>';
    }
}

// 1-Click Quick Demo Login
async function oneClickLogin(email, password) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
    switchAuthTab('login');
    const fakeEvent = { preventDefault: () => {} };
    await handleLogin(fakeEvent);
}

// Populate credentials without auto-submitting
function populateDemo(type) {
    if (type === 'student1') {
        document.getElementById('login-email').value = 'rahul.sharma@gmail.com';
        document.getElementById('login-password').value = 'password123';
    }
}

// Handle Register Submission
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const roleRadio = document.querySelector('input[name="reg-role"]:checked');
    const role = roleRadio ? roleRadio.value : 'student';

    const submitBtn = document.getElementById('register-submit-btn');

    const payload = {
        name,
        email,
        password,
        role
    };

    if (role === 'student') {
        payload.course = document.getElementById('reg-course').value;
        payload.year = Number(document.getElementById('reg-year').value);
        payload.cgpa = Number(document.getElementById('reg-cgpa').value);
        payload.income = Number(document.getElementById('reg-income').value);
        payload.category = document.getElementById('reg-category').value;
        payload.phone = document.getElementById('reg-phone').value.trim();
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Creating Account...</span>';

        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            showAlert('Registration successful! Redirecting...', 'success');
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('current_user', JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 700);
        } else {
            showAlert(data.message || 'Registration failed.');
        }
    } catch (err) {
        console.error('Registration error:', err);
        showAlert('Network error during registration.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account & Continue</span>';
    }
}

// If already logged in, check token validity or redirect
document.addEventListener('DOMContentLoaded', () => {
    const existingUser = localStorage.getItem('current_user');
    const token = localStorage.getItem('auth_token');
    if (existingUser && token) {
        const userObj = JSON.parse(existingUser);
        showAlert(`You are already logged in as ${userObj.name} (${userObj.role}). You can go to the dashboard or switch accounts.`, 'info');
    }
});
