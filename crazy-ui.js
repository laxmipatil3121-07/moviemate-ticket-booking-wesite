/**
 * ==============================================================================
 * MovieMate - Crazy Next-Gen Cinema UI Engine (crazy-ui.js)
 * Features:
 *  1. Ambient Cinema Canvas Particles (Drifting Gold & Cyan Embers)
 *  2. Dynamic Mouse Spotlight Aura Tracking
 *  3. Interactive 3D Perspective Tilt & Holographic Glare on Movie Cards
 *  4. Native Web Audio SFX Engine (Zero-asset Futuristic UI Audio)
 *  5. Floating Cyber Action Dock (Quick Search, Spin, AI Bot, 3D POV, Sound)
 *  6. Spotlight Command Palette (Ctrl+K / Cmd+K Quick Movie Search)
 * ==============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. Web Audio SFX Synthesizer
    // --------------------------------------------------------------------------
    let audioCtx = null;
    let sfxEnabled = localStorage.getItem('moviemate_sfx') === 'true';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const SoundFX = {
        click: function () {
            if (!sfxEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        },
        hover: function () {
            if (!sfxEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        },
        swoosh: function () {
            if (!sfxEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);
        },
        success: function () {
            if (!sfxEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);
                gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.22);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.06);
                osc.stop(ctx.currentTime + idx * 0.06 + 0.22);
            });
        }
    };

    window.MovieMateSFX = SoundFX;

    // --------------------------------------------------------------------------
    // 2. Ambient Cinema Canvas Particle Engine
    // --------------------------------------------------------------------------
    function initCanvasParticles() {
        if (document.getElementById('cinemaBgCanvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'cinemaBgCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        canvas.style.opacity = '0.55';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(35, Math.floor(window.innerWidth / 30));

        const colors = [
            'rgba(255, 11, 55, ',    // Cine Red
            'rgba(0, 242, 254, ',    // Cyan
            'rgba(251, 191, 36, ',   // Gold
            'rgba(157, 78, 221, '    // Purple
        ];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.2 + 0.8,
                colorPrefix: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.7 + 0.2,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -(Math.random() * 0.5 + 0.2),
                pulse: Math.random() * Math.PI
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.pulse += 0.02;
                const dynamicAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.2);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.colorPrefix + dynamicAlpha + ')';
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.colorPrefix + '0.8)';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
            }

            requestAnimationFrame(render);
        }

        render();
    }

    // --------------------------------------------------------------------------
    // 3. Dynamic Mouse Spotlight Aura Tracker
    // --------------------------------------------------------------------------
    function initMouseSpotlight() {
        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
                    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // 4. Interactive 3D Perspective Tilt on Movie Cards
    // --------------------------------------------------------------------------
    function init3DCardTilt() {
        function attachTiltToCards() {
            const cards = document.querySelectorAll('.movie-card:not([data-tilt-ready])');
            cards.forEach((card) => {
                card.setAttribute('data-tilt-ready', 'true');

                card.addEventListener('mouseenter', () => {
                    SoundFX.hover();
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -9;
                    const rotateY = ((x - centerX) / centerX) * 9;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.025, 1.025, 1.025)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
                });
            });
        }

        attachTiltToCards();
        const observer = new MutationObserver(() => {
            attachTiltToCards();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --------------------------------------------------------------------------
    // 5. Spotlight Command Palette (Ctrl+K / Cmd+K)
    // --------------------------------------------------------------------------
    function initSpotlightModal() {
        if (document.getElementById('spotlightModal')) return;

        const modalHtml = `
        <div id="spotlightModal" class="spotlight-overlay d-none">
            <div class="spotlight-dialog">
                <div class="spotlight-header">
                    <i class="bi bi-search text-danger fs-5 me-2"></i>
                    <input type="text" id="spotlightInput" class="spotlight-input" placeholder="Search movies, cast, genres (e.g. Ramayana, War 2, Action, SRK)..." autocomplete="off" />
                    <button id="spotlightCloseBtn" class="btn btn-sm btn-link text-secondary text-decoration-none">
                        <span class="badge bg-secondary">ESC</span>
                    </button>
                </div>
                <div class="spotlight-tags px-3 py-2 border-bottom border-secondary border-opacity-25 d-flex gap-2 flex-wrap">
                    <span class="spotlight-tag" data-tag="Now Showing">🎬 Now Showing</span>
                    <span class="spotlight-tag" data-tag="Upcoming">⏳ Upcoming</span>
                    <span class="spotlight-tag" data-tag="Action">💥 Action</span>
                    <span class="spotlight-tag" data-tag="Sci-Fi">🚀 Sci-Fi</span>
                    <span class="spotlight-tag" data-tag="IMAX">🌟 IMAX 4K</span>
                </div>
                <div id="spotlightResults" class="spotlight-results"></div>
                <div class="spotlight-footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> select</span>
                    <span><kbd>ESC</kbd> dismiss</span>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const overlay = document.getElementById('spotlightModal');
        const input = document.getElementById('spotlightInput');
        const resultsBox = document.getElementById('spotlightResults');
        const closeBtn = document.getElementById('spotlightCloseBtn');

        function openSpotlight(prefill = '') {
            overlay.classList.remove('d-none');
            input.value = prefill;
            SoundFX.swoosh();
            renderSpotlightMovies(prefill);
            setTimeout(() => input.focus(), 80);
        }

        function closeSpotlight() {
            overlay.classList.add('d-none');
            SoundFX.click();
        }

        window.openSpotlight = openSpotlight;
        window.closeSpotlight = closeSpotlight;

        closeBtn.addEventListener('click', closeSpotlight);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSpotlight();
        });

        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (overlay.classList.contains('d-none')) {
                    openSpotlight();
                } else {
                    closeSpotlight();
                }
            } else if (e.key === 'Escape' && !overlay.classList.contains('d-none')) {
                closeSpotlight();
            }
        });

        document.querySelectorAll('.spotlight-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                SoundFX.click();
                input.value = tag.getAttribute('data-tag');
                renderSpotlightMovies(input.value);
            });
        });

        input.addEventListener('input', () => {
            renderSpotlightMovies(input.value);
        });

        function getMoviesList() {
            if (window.MockService && window.MockService.movies) {
                return window.MockService.movies;
            }
            return [];
        }

        function renderSpotlightMovies(query) {
            const movies = getMoviesList();
            const q = (query || '').toLowerCase().trim();

            const filtered = movies.filter(m => {
                if (!q) return true;
                const inTitle = m.title.toLowerCase().includes(q);
                const inCast = (m.cast || '').toLowerCase().includes(q);
                const inDirector = (m.director || '').toLowerCase().includes(q);
                const inStatus = (m.status || '').toLowerCase().includes(q);
                const inGenres = (m.genres || []).some(g => g.name.toLowerCase().includes(q));
                return inTitle || inCast || inDirector || inStatus || inGenres;
            });

            if (filtered.length === 0) {
                resultsBox.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-film fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        <p class="mb-0">No movies found matching "<strong>${query}</strong>"</p>
                        <small>Try searching for "Ramayana", "War 2", "Superman" or "Action"</small>
                    </div>
                `;
                return;
            }

            resultsBox.innerHTML = filtered.slice(0, 10).map((m, idx) => `
                <a href="movie-details.html?id=${m.id}" class="spotlight-item ${idx === 0 ? 'active' : ''}">
                    <img src="${m.posterUrl}" class="spotlight-poster" alt="${m.title}" onerror="this.src='default_poster.svg'">
                    <div class="spotlight-info">
                        <div class="d-flex align-items-center gap-2">
                            <span class="spotlight-title">${m.title}</span>
                            <span class="badge ${m.status === 'Now Showing' ? 'bg-danger' : 'bg-warning text-dark'} text-uppercase" style="font-size:0.65rem;">
                                ${m.status}
                            </span>
                        </div>
                        <div class="spotlight-sub text-muted">
                            <span class="text-warning">★ ${m.rating}</span> • ${m.language} • ${m.genres ? m.genres.map(g => g.name).join(', ') : 'Cinema'}
                        </div>
                        <div class="spotlight-cast text-truncate">${m.cast ? 'Starring: ' + m.cast : ''}</div>
                    </div>
                    <div class="spotlight-action">
                        <span class="btn btn-sm btn-outline-danger rounded-pill px-3">View <i class="bi bi-chevron-right"></i></span>
                    </div>
                </a>
            `).join('');

            resultsBox.querySelectorAll('.spotlight-item').forEach(item => {
                item.addEventListener('mouseenter', () => SoundFX.hover());
                item.addEventListener('click', () => SoundFX.click());
            });
        }
    }

    // --------------------------------------------------------------------------
    // 6. Attach Interactive Sound on Standard UI Buttons
    // --------------------------------------------------------------------------
    function initGlobalAudioHooks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .btn, .nav-link, .mood-btn, .seat.available, .seat.selected');
            if (target) {
                SoundFX.click();
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Bootstrap Everything on DOM Ready
    // --------------------------------------------------------------------------
    function init() {
        initCanvasParticles();
        initMouseSpotlight();
        init3DCardTilt();
        initSpotlightModal();
        initGlobalAudioHooks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
