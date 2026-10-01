/**
 * CineBot - AI Movie Matchmaker & Virtual Assistant
 * MovieMate Next-Gen Cinema Platform
 */
(function() {
    // Cinema catalog for AI reasoning
    const BOT_MOVIES = [
        { id: 20, title: "Ramayana: Part 1", rating: 9.3, language: "Hindi / Telugu", genres: ["Action", "Drama", "Adventure"], poster: "ramayana.jpg", desc: "Epic mythological saga starring Ranbir Kapoor, Sai Pallavi & Yash." },
        { id: 21, title: "War 2", rating: 8.7, language: "Hindi / Telugu", genres: ["Action", "Thriller"], poster: "war_2.jpg", desc: "Hrithik Roshan vs Jr. NTR in the explosive YRF Spy Universe clash." },
        { id: 22, title: "Toxic", rating: 8.9, language: "Kannada / Hindi", genres: ["Action", "Thriller"], poster: "toxic.jpg", desc: "Rocking Star Yash in a gritty, high-stakes underworld neo-noir." },
        { id: 23, title: "Kantara: Chapter 1", rating: 9.1, language: "Kannada / Hindi", genres: ["Action", "Drama"], poster: "kantara_1.jpg", desc: "Rishab Shetty's divine prequel uncovering the sacred origins." },
        { id: 24, title: "Mission: Impossible - Final Reckoning", rating: 8.8, language: "English / Hindi", genres: ["Action", "Thriller"], poster: "mission_impossible_8.jpg", desc: "Tom Cruise's ultimate, death-defying showdown against the Entity." },
        { id: 25, title: "King", rating: 9.2, language: "Hindi", genres: ["Action", "Thriller"], poster: "king.jpg", desc: "Shah Rukh Khan & Suhana Khan in an elite master assassin thriller." },
        { id: 26, title: "Spirit", rating: 9.0, language: "Hindi / Telugu", genres: ["Action", "Thriller"], poster: "spirit.jpg", desc: "Prabhas as a fierce, ruthless cop directed by Sandeep Reddy Vanga." },
        { id: 27, title: "Superman", rating: 8.9, language: "English / Hindi", genres: ["Action", "Sci-Fi"], poster: "superman.jpg", desc: "James Gunn's breathtaking dawn of the new DC superhero universe." },
        { id: 28, title: "Spider-Man: Beyond the Spider-Verse", rating: 9.4, language: "English / Hindi", genres: ["Action", "Sci-Fi"], poster: "spider_man_beyond.jpg", desc: "Miles Morales and Gwen Stacy defy the multiverse canon." },
        { id: 29, title: "Krrish 4", rating: 8.7, language: "Hindi", genres: ["Action", "Sci-Fi"], poster: "krrish_4.jpg", desc: "Hrithik Roshan returns as India's iconic superhero." },
        { id: 30, title: "The Batman: Part II", rating: 9.0, language: "English / Hindi", genres: ["Action", "Thriller"], poster: "the_batman_2.jpg", desc: "Robert Pattinson's Dark Knight confronts Gotham's darkest shadows." },
        { id: 4, title: "Kalki 2898 AD", rating: 8.1, language: "Hindi / Telugu", genres: ["Action", "Sci-Fi"], poster: "kalki_2898.jpg", desc: "Futuristic mythological epic with Prabhas & Amitabh Bachchan." },
        { id: 6, title: "Stree 2: Sarkate Ka Aatank", rating: 7.7, language: "Hindi", genres: ["Comedy", "Horror"], poster: "stree_2.jpg", desc: "Blockbuster horror-comedy sensation starring Rajkummar Rao & Shraddha Kapoor." },
        { id: 7, title: "Oppenheimer", rating: 8.9, language: "English", genres: ["Drama"], poster: "oppenheimer.jpg", desc: "Christopher Nolan's Oscar-winning cinematic masterpiece." },
        { id: 8, title: "Jawan", rating: 8.2, language: "Hindi / Tamil", genres: ["Action", "Thriller"], poster: "jawan.jpg", desc: "High-octane Shah Rukh Khan mass action entertainment!" },
        { id: 9, title: "Pushpa 2: The Rule", rating: 8.8, language: "Hindi / Telugu", genres: ["Action", "Thriller"], poster: "pushpa_2.jpg", desc: "Allu Arjun returns with fiery swag & intense action." },
        { id: 16, title: "Dilwale Dulhania Le Jayenge", rating: 8.0, language: "Hindi", genres: ["Drama", "Romance"], poster: "ddlj.jpg", desc: "Timeless romantic classic of Raj & Simran with Shah Rukh Khan & Kajol." },
        { id: 17, title: "Jab We Met", rating: 7.9, language: "Hindi", genres: ["Comedy", "Romance"], poster: "jab_we_met.jpg", desc: "Feel-good romantic journey with Shahid Kapoor & Kareena Kapoor." },
        { id: 19, title: "Titanic", rating: 7.9, language: "English / Hindi", genres: ["Drama", "Romance"], poster: "titanic.jpg", desc: "James Cameron's historic romantic masterpiece aboard Titanic." }
    ];

    function createCineBotUI() {
        if (document.getElementById('cinebotTrigger')) return;

        // 1. Floating trigger button
        const trigger = document.createElement('div');
        trigger.id = 'cinebotTrigger';
        trigger.className = 'cinebot-trigger-btn';
        trigger.title = 'Chat with CineBot AI';
        trigger.innerHTML = `
            🍿
            <span class="cinebot-badge-online"></span>
        `;
        document.body.appendChild(trigger);

        // 2. Chat card modal
        const card = document.createElement('div');
        card.id = 'cinebotCard';
        card.className = 'cinebot-card d-none';
        card.innerHTML = `
            <div class="cinebot-header">
                <div class="d-flex align-items-center gap-2">
                    <span class="fs-4">🍿</span>
                    <div>
                        <div class="fw-bold text-light small d-flex align-items-center gap-1">
                            CineBot AI <span class="badge bg-danger text-light" style="font-size: 0.65rem;">ONLINE</span>
                        </div>
                        <div class="text-muted" style="font-size: 0.72rem;">MovieMate Smart Assistant</div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white small" id="cinebotCloseBtn"></button>
            </div>

            <!-- Quick Action Pills -->
            <div class="px-3 pt-2 pb-1 d-flex gap-2 overflow-auto" style="scrollbar-width: none;">
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Ramayana & 2026 blockbusters')">🔥 2026 Hits</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Upcoming movies')">📅 Upcoming</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Action movies')">🚀 Action</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Horror movies')">👻 Horror</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Shah Rukh Khan')">👑 SRK</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Prabhas movies')">🏹 Prabhas</span>
            </div>

            <div class="cinebot-messages" id="cinebotMessages">
                <div class="cinebot-bubble bot">
                    Hello movie fan! 👋 I'm <strong>CineBot</strong>, your personal AI cinema guide. Check out our brand-new <strong>2026 blockbusters</strong> like <em>Ramayana</em>, <em>War 2</em>, <em>Toxic</em>, or upcoming hits like <em>King</em> & <em>Superman</em>! How can I help you today?
                </div>
            </div>

            <div class="cinebot-footer">
                <form id="cinebotForm" class="d-flex gap-2">
                    <input type="text" id="cinebotInput" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="Ask e.g. 'Show me 2026 movies' or 'Upcoming action'..." autocomplete="off">
                    <button type="submit" class="btn btn-danger btn-sm px-3"><i class="bi bi-send-fill"></i></button>
                </form>
            </div>
        `;
        document.body.appendChild(card);

        // Event listeners
        trigger.addEventListener('click', toggleCineBot);
        document.getElementById('cinebotCloseBtn').addEventListener('click', toggleCineBot);
        document.getElementById('cinebotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('cinebotInput');
            const q = input.value.trim();
            if (q) {
                window.cinebotSend(q);
                input.value = '';
            }
        });
    }

    function toggleCineBot() {
        const card = document.getElementById('cinebotCard');
        if (card.classList.contains('d-none')) {
            card.classList.remove('d-none');
            setTimeout(() => document.getElementById('cinebotInput')?.focus(), 150);
        } else {
            card.classList.add('d-none');
        }
    }

    window.cinebotSend = function(text) {
        const msgContainer = document.getElementById('cinebotMessages');
        if (!msgContainer) return;

        const userEl = document.createElement('div');
        userEl.className = 'cinebot-bubble user';
        userEl.innerText = text;
        msgContainer.appendChild(userEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        const typingEl = document.createElement('div');
        typingEl.className = 'cinebot-bubble bot cinebot-typing';
        typingEl.id = 'cinebotTyping';
        typingEl.innerHTML = '<span class="cinebot-dot"></span><span class="cinebot-dot"></span><span class="cinebot-dot"></span>';
        msgContainer.appendChild(typingEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        setTimeout(() => {
            typingEl.remove();
            respondToUser(text);
        }, 450);
    };

    function respondToUser(query) {
        const msgContainer = document.getElementById('cinebotMessages');
        const q = query.toLowerCase();
        let matched = [];
        let replyText = "";

        if (q.includes('ramayana') || q.includes('ranbir') || q.includes('2026')) {
            matched = BOT_MOVIES.filter(m => m.id === 20 || m.id === 21 || m.id === 22 || m.id === 23);
            replyText = "Here are the biggest 2026 blockbuster sensations running right now:";
        } else if (q.includes('upcoming') || q.includes('coming soon') || q.includes('next')) {
            matched = BOT_MOVIES.filter(m => [25, 26, 27, 28, 29, 30].includes(m.id)).slice(0, 3);
            replyText = "Here are the most anticipated upcoming mega-releases:";
        } else if (q.includes('shah rukh') || q.includes('srk') || q.includes('king')) {
            matched = BOT_MOVIES.filter(m => m.id === 25 || m.id === 8 || m.id === 16);
            replyText = "Here are King Khan's blockbuster gems (including his upcoming mega-hit King!):";
        } else if (q.includes('prabhas') || q.includes('spirit') || q.includes('kalki')) {
            matched = BOT_MOVIES.filter(m => m.id === 26 || m.id === 4);
            replyText = "Rebel Star Prabhas in his high-octane avatars:";
        } else if (q.includes('hrithik') || q.includes('war') || q.includes('krrish')) {
            matched = BOT_MOVIES.filter(m => m.id === 21 || m.id === 29);
            replyText = "Hrithik Roshan's biggest spectacles:";
        } else if (q.includes('yash') || q.includes('toxic')) {
            matched = BOT_MOVIES.filter(m => m.id === 22);
            replyText = "Rocking Star Yash in Toxic:";
        } else if (q.includes('horror') || q.includes('stree')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Horror'));
            replyText = "Get ready for spine-chilling thrills and huge laughs with this horror-comedy:";
        } else if (q.includes('action') || q.includes('superman') || q.includes('batman') || q.includes('spider')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Action')).slice(0, 3);
            replyText = "Here are top-tier action blockbusters with mindblowing VFX:";
        } else if (q.includes('romance') || q.includes('love') || q.includes('date')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Romance')).slice(0, 3);
            replyText = "Perfect romantic titles for a memorable cinema date:";
        } else {
            matched = BOT_MOVIES.slice(0, 3);
            replyText = "Here are top trending recommendations audiences are loving:";
        }

        const botEl = document.createElement('div');
        botEl.className = 'cinebot-bubble bot';
        
        let moviesHtml = matched.map(m => `
            <div class="cinebot-movie-card">
                <img src="${m.poster}" class="cinebot-movie-img" alt="${m.title}" onerror="this.src='default_poster.svg'">
                <div class="d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <div class="fw-bold text-light" style="font-size: 0.82rem;">${m.title}</div>
                        <div class="text-warning" style="font-size: 0.72rem;">★ ${m.rating} • ${m.language}</div>
                    </div>
                    <a href="movie-details.html?id=${m.id}" class="btn btn-danger btn-sm py-0 px-2 mt-1 align-self-start" style="font-size: 0.75rem;">
                        <i class="bi bi-ticket-perforated"></i> View / Book
                    </a>
                </div>
            </div>
        `).join('');

        botEl.innerHTML = `
            <div>${replyText}</div>
            <div class="d-flex flex-column gap-1 mt-2">
                ${moviesHtml}
            </div>
        `;

        msgContainer.appendChild(botEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCineBotUI);
    } else {
        createCineBotUI();
    }
})();
