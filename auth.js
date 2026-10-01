/**
 * Authentication and Session Management
 */
const Auth = {
    saveSession(token, email, fullName, role) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('role', role);
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
        return {
            token: localStorage.getItem('token'),
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName'),
            role: localStorage.getItem('role')
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

            navAuth.innerHTML = `
                ${citySelectorHtml}
                ${adminLink}
                <li class="nav-item">
                    <a class="nav-link" href="my-bookings.html"><i class="bi bi-ticket-perforated"></i> My Bookings</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-light" href="#" id="userDrop" role="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle text-danger"></i> ${user.fullName || user.email}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                        <li><span class="dropdown-item-text text-muted small">${user.email} (${user.role})</span></li>
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

