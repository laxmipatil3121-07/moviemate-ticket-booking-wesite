/**
 * CineBot - AI Movie Matchmaker & Virtual Assistant
 * MovieMate Next-Gen Cinema Platform
 */
(function() {
    // Cinema catalog for AI reasoning
    const BOT_MOVIES = [
        { id: 4, title: "Kalki 2898 AD", rating: 8.1, language: "Hindi / Telugu", genres: ["Action", "Sci-Fi"], poster: "kalki_2898.jpg", desc: "Epic mythological futuristic action with Prabhas, Amitabh Bachchan & Deepika Padukone." },
        { id: 5, title: "Deadpool & Wolverine", rating: 8.0, language: "English / Hindi", genres: ["Action", "Comedy"], poster: "deadpool_wolverine.jpg", desc: "Hilarious MCU multiverse action packed with comedy & cameos." },
        { id: 6, title: "Stree 2: Sarkate Ka Aatank", rating: 7.7, language: "Hindi", genres: ["Comedy", "Horror"], poster: "stree_2.jpg", desc: "Blockbuster horror-comedy sensation starring Rajkummar Rao & Shraddha Kapoor." },
        { id: 7, title: "Oppenheimer", rating: 8.9, language: "English", genres: ["Drama"], poster: "oppenheimer.jpg", desc: "Christopher Nolan's Oscar-winning cinematic masterpiece." },
        { id: 8, title: "Jawan", rating: 8.2, language: "Hindi / Tamil", genres: ["Action", "Thriller"], poster: "jawan.jpg", desc: "High-octane Shah Rukh Khan mass action entertainment!" },
        { id: 9, title: "Pushpa 2: The Rule", rating: 8.8, language: "Hindi / Telugu", genres: ["Action", "Thriller"], poster: "pushpa_2.jpg", desc: "Allu Arjun returns with fiery swag & intense action." },
        { id: 11, title: "The Avengers", rating: 8.0, language: "English / Hindi", genres: ["Action", "Sci-Fi"], poster: "avengers_1.jpg", desc: "Earth's mightiest heroes unite in iconic cinematic glory." },
        { id: 14, title: "Avengers: Endgame", rating: 8.4, language: "English / Hindi", genres: ["Action", "Sci-Fi"], poster: "avengers_endgame.jpg", desc: "The greatest superhero climax in cinema history." },
        { id: 16, title: "Dilwale Dulhania Le Jayenge", rating: 8.0, language: "Hindi", genres: ["Drama", "Romance"], poster: "ddlj.jpg", desc: "Timeless romantic classic of Raj & Simran with Shah Rukh Khan & Kajol." },
        { id: 17, title: "Jab We Met", rating: 7.9, language: "Hindi", genres: ["Comedy", "Romance"], poster: "jab_we_met.jpg", desc: "Feel-good romantic journey with Shahid Kapoor & Kareena Kapoor." },
        { id: 18, title: "Kabir Singh", rating: 7.1, language: "Hindi", genres: ["Drama", "Romance"], poster: "kabir_singh.jpg", desc: "Intense emotional love story with iconic chartbuster songs." },
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
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Action movies')">🚀 Action Hits</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Horror movies')">👻 Horror Fun</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Romantic movies')">❤️ Romantic</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Top rated')">⭐ Top Rated</span>
                <span class="cinebot-quick-pill" onclick="window.cinebotSend('Shah Rukh Khan')">👑 SRK Specials</span>
            </div>

            <div class="cinebot-messages" id="cinebotMessages">
                <div class="cinebot-bubble bot">
                    Hello movie fan! 👋 I'm <strong>CineBot</strong>, your personal AI cinema guide. Tell me what mood you're in or which actor/genre you love, and I'll find your perfect show!
                </div>
            </div>

            <div class="cinebot-footer">
                <form id="cinebotForm" class="d-flex gap-2">
                    <input type="text" id="cinebotInput" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="Ask e.g. 'Suggest a comedy for tonight'..." autocomplete="off">
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

        // User bubble
        const userEl = document.createElement('div');
        userEl.className = 'cinebot-bubble user';
        userEl.innerText = text;
        msgContainer.appendChild(userEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Typing indicator
        const typingEl = document.createElement('div');
        typingEl.className = 'cinebot-bubble bot cinebot-typing';
        typingEl.id = 'cinebotTyping';
        typingEl.innerHTML = '<span class="cinebot-dot"></span><span class="cinebot-dot"></span><span class="cinebot-dot"></span>';
        msgContainer.appendChild(typingEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        setTimeout(() => {
            typingEl.remove();
            respondToUser(text);
        }, 500);
    };

    function respondToUser(query) {
        const msgContainer = document.getElementById('cinebotMessages');
        const q = query.toLowerCase();
        let matched = [];
        let replyText = "";

        if (q.includes('shah rukh') || q.includes('srk')) {
            matched = BOT_MOVIES.filter(m => m.id === 8 || m.id === 16);
            replyText = "Here are King Khan's blockbuster gems playing on MovieMate:";
        } else if (q.includes('horror') || q.includes('stree') || q.includes('darr')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Horror'));
            replyText = "Get ready for spine-chilling thrills and huge laughs with this horror-comedy:";
        } else if (q.includes('action') || q.includes('fight') || q.includes('marvel') || q.includes('avengers')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Action')).slice(0, 3);
            replyText = "Here are top-tier action blockbusters with mindblowing VFX:";
        } else if (q.includes('comedy') || q.includes('funny') || q.includes('chill') || q.includes('hasna')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Comedy'));
            replyText = "Guaranteed laugh riots for you and your friends:";
        } else if (q.includes('romance') || q.includes('love') || q.includes('date') || q.includes('couple')) {
            matched = BOT_MOVIES.filter(m => m.genres.includes('Romance')).slice(0, 3);
            replyText = "Perfect romantic titles for a memorable cinema date:";
        } else if (q.includes('top') || q.includes('best') || q.includes('rating') || q.includes('hit')) {
            matched = [...BOT_MOVIES].sort((a,b) => b.rating - a.rating).slice(0, 3);
            replyText = "Our highest critically acclaimed movies right now:";
        } else if (q.includes('prabhas') || q.includes('kalki')) {
            matched = BOT_MOVIES.filter(m => m.id === 4);
            replyText = "Prabhas in Kalki 2898 AD is an absolute spectacle on IMAX / 4K:";
        } else {
            matched = BOT_MOVIES.slice(0, 2);
            replyText = "Here are trending recommendations that audiences are loving today:";
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
                        <i class="bi bi-ticket-perforated"></i> Book Now
                    </a>
                </div>
            </div>
        `).join('');

        botEl.innerHTML = `
            <div>${replyText}</div>
            <div class="d-flex flex-column gap-1 mt-2">
                ${moviesHtml}
            </div>
            <div class="mt-2 text-muted" style="font-size: 0.72rem;">
                💡 <em>Tip: You can also ask for specific actors or genres!</em>
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
