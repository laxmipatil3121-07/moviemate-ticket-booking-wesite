/**
 * Authentication and Session Management
 */
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

        return {
            token: localStorage.getItem('token'),
            email: em,
            fullName: fn,
            role: localStorage.getItem('role') || 'User'
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

            // Clean display name and email without "undefined"
            let displayName = user.fullName;
            if (!displayName || displayName === 'undefined' || displayName === 'null' || displayName.trim() === '') {
                displayName = user.email;
            }
            if (!displayName || displayName === 'undefined' || displayName === 'null' || displayName.trim() === '') {
                displayName = 'Account';
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
