/**
 * Derives a human-friendly full name from an email address (e.g. bhavsarmohit53@gmail.com -> Bhavsar Mohit)
 */
function extractNameFromEmail(email) {
    if (!email || typeof email !== 'string') return 'User';
    var raw = email.split('@')[0];
    if (!raw) return 'User';
    raw = raw.replace(/[._\-+]+/g, ' ');
    var rawWords = raw.split(/\s+/);
    var words = [];
    for (var i = 0; i < rawWords.length; i++) {
        var w = rawWords[i].replace(/\d+/g, '').replace(/^\s+|\s+$/g, '');
        if (w) words.push(w);
    }
    if (words.length === 1) {
        var str = words[0].toLowerCase();
        var nameTokens = [
            'bhavsar', 'mohit', 'rahul', 'sharma', 'patil', 'joshi', 'kumar', 'singh',
            'gupta', 'verma', 'shah', 'mehta', 'khan', 'kapoor', 'reddy', 'roy',
            'das', 'nair', 'rao', 'patel', 'yadav', 'mishra', 'shukla', 'aarav',
            'sneha', 'pooja', 'amit', 'priya', 'ankit', 'sumit', 'vikas', 'sachin',
            'aman', 'deepak', 'neha', 'kunal', 'varun', 'aditya', 'ayush', 'gaurav',
            'manish', 'raj', 'rohan', 'vikram', 'ajay', 'vijay', 'sanjay', 'anil',
            'sunil', 'ashok', 'alok', 'anand', 'saheb', 'kiran', 'swati', 'rohit'
        ];
        for (var j = 0; j < nameTokens.length; j++) {
            var token = nameTokens[j];
            if (str.indexOf(token) === 0 && str.length > token.length) {
                var remainder = str.substring(token.length);
                words = [token, remainder];
                break;
            } else if (str.length > token.length && str.indexOf(token) === str.length - token.length) {
                var prefix = str.substring(0, str.length - token.length);
                words = [prefix, token];
                break;
            }
        }
    }
    var formattedArr = [];
    for (var k = 0; k < words.length; k++) {
        var wd = words[k];
        formattedArr.push(wd.charAt(0).toUpperCase() + wd.substring(1).toLowerCase());
    }
    var res = formattedArr.join(' ');
    return res || 'User';
}

try {
    if (localStorage.getItem('fullName') === 'undefined' || localStorage.getItem('fullName') === 'null') localStorage.removeItem('fullName');
    if (localStorage.getItem('email') === 'undefined' || localStorage.getItem('email') === 'null') localStorage.removeItem('email');
    if (localStorage.getItem('role') === 'undefined' || localStorage.getItem('role') === 'null') localStorage.removeItem('role');
} catch(e) {}

var Auth = window.Auth = {
    saveSession(token, email, fullName, role) {
        localStorage.setItem('token', token || 'mock_jwt_token_12345');
        if (email && email !== 'undefined' && email !== 'null' && String(email).trim() !== '') {
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('email');
        }
        if (fullName && fullName !== 'undefined' && fullName !== 'null' && String(fullName).trim() !== '') {
            localStorage.setItem('fullName', fullName);
        } else {
            localStorage.removeItem('fullName');
        }
        if (role && role !== 'undefined' && role !== 'null' && String(role).trim() !== '') {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    },

    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
    },

    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    isAdmin() {
        return localStorage.getItem('role') === 'Admin';
    },

    getUser() {
        let fn = localStorage.getItem('fullName');
        if (fn === 'undefined' || fn === 'null' || !fn || fn.trim() === '') fn = null;

        let em = localStorage.getItem('email');
        if (em === 'undefined' || em === 'null' || !em || em.trim() === '') em = null;

        // Auto-fix: if old dummy 'Rahul Sharma' was stored for another user's email, replace with real derived name
        if (em && fn === 'Rahul Sharma' && !em.toLowerCase().includes('rahul')) {
            fn = extractNameFromEmail(em);
            localStorage.setItem('fullName', fn);
        }

        // If fullName is missing but email is present, derive from email
        if (!fn && em) {
            fn = extractNameFromEmail(em);
            localStorage.setItem('fullName', fn);
        }

        return {
            token: localStorage.getItem('token'),
            email: em,
            fullName: fn,
            role: localStorage.getItem('role') || (em && em.includes('admin') ? 'Admin' : 'User')
        };
    },

    getCity() {
        return localStorage.getItem('selectedCity') || 'Jalgaon';
    },

    setCity(city) {
        localStorage.setItem('selectedCity', city);
        window.location.reload();
    },

    logout() {
        Auth.clearSession();
        window.location.href = 'index.html';
    },

    async ensureAdmin() {
        if (Auth.isLoggedIn() && Auth.isAdmin()) {
            return true;
        }
        try {
            const res = await apiCall('/auth/login', 'POST', {
                email: 'admin@movieticket.com',
                password: 'Admin@12345'
            });
            Auth.saveSession(res.token, res.email, res.fullName, res.role);
            return true;
        } catch (e) {
            console.error("Auto admin login failed:", e);
            return false;
        }
    },

    updateNavbar() {
        const navAuth = document.getElementById('navAuthSection');
        if (!navAuth) return;

        // Current City
        const currentCity = Auth.getCity();

        // City Selector Dropdown HTML
        const citySelectorHtml = `
            <li class="nav-item dropdown me-2">
                <a class="nav-link dropdown-toggle text-warning fw-bold" href="#" id="cityDrop" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-geo-alt-fill text-danger"></i> ${currentCity}
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item ${currentCity==='Jalgaon'?'active':''}" href="javascript:void(0)" onclick="Auth.setCity('Jalgaon')"><i class="bi bi-geo-alt-fill text-danger me-1"></i> Jalgaon</a></li>
                    <li><a class="dropdown-item ${currentCity==='Mumbai'?'active':''}" href="javascript:void(0)" onclick="Auth.setCity('Mumbai')">Mumbai</a></li>
                    <li><a class="dropdown-item ${currentCity==='Pune'?'active':''}" href="javascript:void(0)" onclick="Auth.setCity('Pune')">Pune</a></li>
                    <li><a class="dropdown-item ${currentCity==='Delhi-NCR'?'active':''}" href="javascript:void(0)" onclick="Auth.setCity('Delhi-NCR')">Delhi-NCR</a></li>
                    <li><a class="dropdown-item ${currentCity==='Bengaluru'?'active':''}" href="javascript:void(0)" onclick="Auth.setCity('Bengaluru')">Bengaluru</a></li>
                </ul>
            </li>
        `;

        if (Auth.isLoggedIn()) {
            const user = Auth.getUser();
            const adminLink = Auth.isAdmin() 
                ? `<li class="nav-item"><a class="nav-link text-warning fw-bold" href="admin-dashboard.html"><i class="bi bi-speedometer2"></i> Admin Panel</a></li>`
                : '';

            // Clean display name and email without "undefined" or unknown dummy names
            let displayName = user.fullName;
            if (!displayName || displayName === 'undefined' || displayName === 'null' || displayName.trim() === '' || (displayName === 'Rahul Sharma' && user.email && !user.email.toLowerCase().includes('rahul'))) {
                displayName = user.email ? extractNameFromEmail(user.email) : 'Account';
            }

            let displayEmail = user.email;
            if (!displayEmail || displayEmail === 'undefined' || displayEmail === 'null' || displayEmail.trim() === '') {
                displayEmail = 'user@movieticket.com';
            }

            navAuth.innerHTML = `
                ${citySelectorHtml}
                ${adminLink}
                <li class="nav-item">
                    <a class="nav-link" href="my-bookings.html"><i class="bi bi-ticket-perforated"></i> My Bookings</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-light" href="#" id="userDrop" role="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle text-danger"></i> ${displayName}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                        <li><span class="dropdown-item-text text-muted small">${displayEmail} (${user.role || 'User'})</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="watchlist.html"><i class="bi bi-bookmark-heart text-danger"></i> My Watchlist</a></li>
                        <li><a class="dropdown-item" href="compare.html"><i class="bi bi-arrow-left-right text-info"></i> Compare Movies</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="Auth.logout()"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                    </ul>
                </li>
            `;
        } else {
            navAuth.innerHTML = `
                ${citySelectorHtml}
                <li class="nav-item">
                    <a class="nav-link text-warning fw-bold" href="admin-dashboard.html"><i class="bi bi-shield-lock-fill"></i> Admin Panel</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="compare.html"><i class="bi bi-arrow-left-right"></i> Compare</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="login.html"><i class="bi bi-box-arrow-in-right"></i> Login</a>
                </li>
                <li class="nav-item">
                    <a class="btn btn-cinema btn-sm ms-2" href="register.html">Register</a>
                </li>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavbar();
});
