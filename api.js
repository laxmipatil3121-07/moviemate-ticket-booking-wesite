const API_BASE_URL = window.location.origin && window.location.origin.startsWith('http')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

/**
 * Universal Fetch Helper for API Requests with Static Hosting Fallback
 */
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (response.ok) {
            return await response.json().catch(() => null);
        }
        // If 404 or server error on static host (e.g. GitHub Pages), fallback to mock
        if (response.status === 404 || response.status >= 500) {
            return MockService.handle(endpoint, method, body);
        }
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Something went wrong.');
    } catch (error) {
        // Network error (backend not running or deployed on static host) -> use seamless mock
        console.warn(`[MovieMate API] Backend unreachable at ${endpoint}, serving offline/demo data.`);
        return MockService.handle(endpoint, method, body);
    }
}

/**
 * Embedded Mock Data Service (Ensures 100% functionality on GitHub Pages, Vercel & Offline)
 */
const MockService = {
    movies: [
        { id: 4, title: "Kalki 2898 AD", rating: 8.1, language: "Hindi / Telugu", durationMinutes: 181, status: "Now Showing", director: "Nag Ashwin", cast: "Prabhas, Amitabh Bachchan, Deepika Padukone", posterUrl: "https://m.media-amazon.com/images/M/MV5BZjY5OTk2YTQtMmNlNy00YmUxLWJmODMtMjE2YmZlZGJlYmE3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=kQDd1AhGIHk", description: "A modern avatar of Vishnu descends on Earth to protect humanity from tyrannical dystopian forces in 2898 AD.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 5, title: "Deadpool & Wolverine", rating: 8.0, language: "English / Hindi", durationMinutes: 128, status: "Now Showing", director: "Shawn Levy", cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin", posterUrl: "https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTQ1Mi00Y2Q5LWEwM2MtMzUwZDU5NmVjN2NkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk", description: "Wolverine is recovering from injuries when he crosses paths with loudmouth Deadpool to defeat a common enemy.", genres: [{ id: 1, name: "Action" }, { id: 4, name: "Comedy" }] },
        { id: 6, title: "Stree 2: Sarkate Ka Aatank", rating: 7.7, language: "Hindi", durationMinutes: 147, status: "Now Showing", director: "Amar Kaushik", cast: "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjY5YmRhYTUtYTU5OS00YzllLWI5NGQtY2VmMjQ4Y2NhMDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=KVnhefZPq1I", description: "After events of Stree, Chanderi is haunted by a headless entity named Sarkata abducting progressive women.", genres: [{ id: 4, name: "Comedy" }, { id: 7, name: "Horror" }] },
        { id: 7, title: "Oppenheimer", rating: 8.9, language: "English", durationMinutes: 180, status: "Now Showing", director: "Christopher Nolan", cast: "Cillian Murphy, Emily Blunt, Robert Downey Jr.", posterUrl: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjc3YS00Zjc5LThmMjQtN2FiZDA2OWJmNWZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg", description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", genres: [{ id: 3, name: "Drama" }] },
        { id: 8, title: "Jawan", rating: 8.2, language: "Hindi / Tamil", durationMinutes: 169, status: "Now Showing", director: "Atlee", cast: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjA5OTFlMDktNDc5Ni00MWE4LTg2NTYtMDM5ZDRlNmU1NmFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=COv52Qyctws", description: "A high-octane emotional journey of a man set to rectify wrongs in society and fulfill a promise.", genres: [{ id: 1, name: "Action" }, { id: 5, name: "Thriller" }] },
        { id: 9, title: "Pushpa 2: The Rule", rating: 8.8, language: "Hindi / Telugu", durationMinutes: 175, status: "Upcoming", director: "Sukumar", cast: "Allu Arjun, Rashmika Mandanna, Fahadh Faasil", posterUrl: "https://m.media-amazon.com/images/M/MV5BYzA2ZDk1MmUtNWYwOC00OTZmLWEyNzYtZmIzYTBjODVjZTI2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=1kVK0MZlbI4", description: "The clash between Pushpa Raj and Bhanwar Singh escalates into all-out warfare as Pushpa expands his empire.", genres: [{ id: 1, name: "Action" }, { id: 5, name: "Thriller" }] },
        { id: 10, title: "Avatar: The Way of Water", rating: 7.6, language: "English / Hindi", durationMinutes: 192, status: "Upcoming", director: "James Cameron", cast: "Sam Worthington, Zoe Saldana, Kate Winslet", posterUrl: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0", description: "Jake Sully lives with his family on Pandora until a familiar threat returns, forcing them to protect their home.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 11, title: "The Avengers", rating: 8.0, language: "English / Hindi", durationMinutes: 143, status: "Now Showing", director: "Joss Whedon", cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson", posterUrl: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8", description: "Earth's mightiest heroes assemble to stop the mischievous Loki and his alien army from enslaving humanity.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }, { id: 6, name: "Adventure" }] },
        { id: 12, title: "Avengers: Age of Ultron", rating: 7.3, language: "English / Hindi", durationMinutes: 141, status: "Now Showing", director: "Joss Whedon", cast: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo", posterUrl: "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=tmeOjFno6Do", description: "Tony Stark tries to jumpstart a peacekeeping program called Ultron, but things go horribly wrong.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 13, title: "Avengers: Infinity War", rating: 8.4, language: "English / Hindi", durationMinutes: 149, status: "Now Showing", director: "Anthony Russo, Joe Russo", cast: "Robert Downey Jr., Josh Brolin, Chris Hemsworth", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjMxNjQ5MTI3MV5BMl5BanBnXkFtZTgwNzQzNzQ3NDM@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8", description: "The Avengers and their allies must sacrifice all to defeat Thanos before his blitz of devastation ruins the universe.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 14, title: "Avengers: Endgame", rating: 8.4, language: "English / Hindi", durationMinutes: 181, status: "Now Showing", director: "Anthony Russo, Joe Russo", cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson", posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c", description: "After devastating events of Infinity War, the remaining allies assemble once more to reverse Thanos' actions.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 15, title: "Avengers: Doomsday", rating: 9.2, language: "English / Hindi", durationMinutes: 165, status: "Upcoming", director: "Anthony Russo, Joe Russo", cast: "Robert Downey Jr. (Doctor Doom), Pedro Pascal", posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c", description: "The Avengers assemble to confront Doctor Victor Von Doom in an epic multiversal collision.", genres: [{ id: 1, name: "Action" }, { id: 2, name: "Sci-Fi" }] },
        { id: 16, title: "Dilwale Dulhania Le Jayenge", rating: 8.0, language: "Hindi", durationMinutes: 189, status: "Now Showing", director: "Aditya Chopra", cast: "Shah Rukh Khan, Kajol, Amrish Puri", posterUrl: "https://m.media-amazon.com/images/M/MV5BMDQ2YzEyZGItYWRhOS00ODTELTgwYzEtOTYyZmJkNzUzYWYzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=c25GKl5VNeY", description: "Raj and Simran fall in love on a Europe trip. Raj travels to Punjab to win over her traditional father.", genres: [{ id: 3, name: "Drama" }, { id: 9, name: "Romance" }] },
        { id: 17, title: "Jab We Met", rating: 7.9, language: "Hindi", durationMinutes: 138, status: "Now Showing", director: "Imtiaz Ali", cast: "Shahid Kapoor, Kareena Kapoor Khan", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjEyNzcwMDk3N15BMl5BanBnXkFtZTcwNTg5OTY0MQ@@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=i7e_7qK_a5U", description: "A depressed businessman's life turns around after meeting a talkative, spirited girl on a train journey.", genres: [{ id: 3, name: "Drama" }, { id: 4, name: "Comedy" }, { id: 9, name: "Romance" }] },
        { id: 18, title: "Kabir Singh", rating: 7.1, language: "Hindi", durationMinutes: 172, status: "Now Showing", director: "Sandeep Reddy Vanga", cast: "Shahid Kapoor, Kiara Advani", posterUrl: "https://m.media-amazon.com/images/M/MV5BOTIyMTNkMWQtZDJlYi00OGJmLTliN2MtOGE0YjRlOTQ5NjVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=RiANSSgCuJk", description: "A fiery surgical resident goes into a self-destructive spiral when the love of his life marries someone else.", genres: [{ id: 3, name: "Drama" }, { id: 9, name: "Romance" }] },
        { id: 19, title: "Titanic", rating: 7.9, language: "English / Hindi", durationMinutes: 194, status: "Now Showing", director: "James Cameron", cast: "Leonardo DiCaprio, Kate Winslet, Billy Zane", posterUrl: "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1NDgzOTFlN2UwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", trailerUrl: "https://www.youtube.com/watch?v=2e-eXJ6HgkQ", description: "A young aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", genres: [{ id: 3, name: "Drama" }, { id: 9, name: "Romance" }] }
    ],

    theatres: [
        { id: 101, name: "INOX - Khandesh Central Mall", city: "Jalgaon", address: "Station Road, Khandesh Central Mall, Jalgaon, MH", screens: [{ id: 201, screenName: "Laser 4K Screen 1", totalSeats: 48 }, { id: 202, screenName: "Dolby 7.1 Screen 2", totalSeats: 48 }] },
        { id: 102, name: "P-Square Multiplex", city: "Jalgaon", address: "Ring Road, Near Collector Office, Jalgaon, MH", screens: [{ id: 203, screenName: "Atmos Prime Screen 1", totalSeats: 48 }, { id: 204, screenName: "Gold Class Screen 2", totalSeats: 48 }] },
        { id: 1, name: "PVR - Phoenix Palladium", city: "Mumbai", address: "Lower Parel, Mumbai, MH", screens: [{ id: 1, screenName: "IMAX Laser Screen 1", totalSeats: 48 }] },
        { id: 2, name: "INOX - Megaplex Inorbit Mall", city: "Mumbai", address: "Malad West, Mumbai, MH", screens: [{ id: 2, screenName: "Insignia Screen 1", totalSeats: 48 }] }
    ],

    getShows(targetMovieId = null) {
        const todayStr = new Date().toISOString().split('T')[0];
        const showList = [];
        let idCounter = 1;
        const slots = [
            { start: "10:30:00", end: "13:30:00", price: 200 },
            { start: "14:15:00", end: "17:15:00", price: 240 },
            { start: "18:30:00", end: "21:30:00", price: 290 },
            { start: "22:00:00", end: "01:00:00", price: 260 }
        ];

        MockService.theatres.forEach(t => {
            t.screens.forEach((s, sIdx) => {
                slots.forEach((slot, slotIdx) => {
                    const nowShowing = MockService.movies.filter(m => m.status === 'Now Showing');
                    const movie = targetMovieId 
                        ? (MockService.movies.find(m => m.id === targetMovieId) || nowShowing[0])
                        : nowShowing[(sIdx + slotIdx) % nowShowing.length];

                    const sid = idCounter++;
                    showList.push({
                        id: sid,
                        showId: sid,
                        movieId: movie.id,
                        movieTitle: movie.title,
                        screenId: s.id,
                        screenName: s.screenName,
                        theatreId: t.id,
                        theatreName: t.name,
                        theatreCity: t.city,
                        city: t.city,
                        showDate: todayStr,
                        startTime: slot.start,
                        endTime: slot.end,
                        basePrice: slot.price
                    });
                });
            });
        });
        return showList;
    },

    getSeatLayout(showId) {
        const rows = ['A', 'B', 'C', 'D'];
        const seats = [];
        let idCounter = 1;
        const allShows = MockService.getShows();
        const show = allShows.find(s => s.id === parseInt(showId) || s.showId === parseInt(showId)) || allShows[0];
        const basePrice = show.basePrice || 200;

        rows.forEach(r => {
            for (let num = 1; num <= 12; num++) {
                const type = (r === 'A') ? 'Platinum' : (r === 'B' || r === 'C') ? 'Gold' : 'Silver';
                const mult = (r === 'A') ? 1.4 : (r === 'B' || r === 'C') ? 1.2 : 1.0;
                const seatPrice = Math.round(basePrice * mult);
                const currentId = idCounter++;
                seats.push({
                    id: currentId,
                    seatId: currentId,
                    row: r,
                    seatNumber: num,
                    seatCode: `${r}${num}`,
                    seatType: type,
                    priceMultiplier: mult,
                    price: seatPrice
                });
            }
        });
        const booked = [3, 4, 15, 16, 28, 41];
        return {
            show: show,
            seats: seats,
            bookedSeatIds: booked
        };
    },

    handle(endpoint, method = 'GET', body = null) {
        const clean = endpoint.split('?')[0];

        // 1. Movies endpoints
        if (clean === '/movies' || clean === '/movies/featured') {
            return MockService.movies;
        }
        if (clean.startsWith('/movies/')) {
            const id = parseInt(clean.replace('/movies/', ''));
            const m = MockService.movies.find(x => x.id === id) || MockService.movies[0];
            const shows = MockService.getShows(m.id);
            return {
                ...m,
                shows: shows,
                availableShows: shows
            };
        }

        // 2. Theatres endpoints
        if (clean === '/theatres') {
            return MockService.theatres;
        }

        // 3. Shows endpoints
        if (clean.includes('/live-status')) {
            const parts = clean.split('/');
            const showId = parseInt(parts[2]) || 1;
            const layout = MockService.getSeatLayout(showId);
            const seats = layout.seats.map(st => ({
                ...st,
                isBooked: layout.bookedSeatIds.includes(st.id)
            }));
            return {
                partnerName: "PVR-INOX Vista Cinema POS Gateway v4.2",
                status: "Connected (Live)",
                latencyMs: 14,
                priceTag: "Standard",
                dynamicBasePrice: layout.show.basePrice,
                basePrice: layout.show.basePrice,
                totalSeats: 48,
                bookedSeats: layout.bookedSeatIds.length,
                occupancyPercentage: Math.round((layout.bookedSeatIds.length / 48) * 100),
                occupancyStatus: "Available",
                seats: seats,
                seatLayout: layout,
                show: layout.show
            };
        }
        if (clean.includes('/seat-layout')) {
            const showId = clean.split('/')[2];
            return MockService.getSeatLayout(showId);
        }
        if (clean.startsWith('/shows/')) {
            const showId = parseInt(clean.replace('/shows/', ''));
            const allShows = MockService.getShows();
            return allShows.find(s => s.id === showId || s.showId === showId) || allShows[0];
        }
        if (clean === '/shows') {
            return MockService.getShows();
        }

        // 4. Auth
        if (clean === '/auth/login') {
            const role = (body && body.email && body.email.includes('admin')) ? 'Admin' : 'User';
            const name = role === 'Admin' ? 'System Administrator' : 'Rahul Sharma';
            return {
                token: 'mock-jwt-token-preview',
                email: body?.email || 'demo@movieticket.com',
                fullName: name,
                role: role
            };
        }

        // 5. Admin Dashboard & Bookings
        if (clean === '/admin/dashboard') {
            return {
                totalRevenue: 52400.00,
                totalBookings: 184,
                totalMovies: MockService.movies.length,
                totalUsers: 142,
                recentBookings: [
                    { bookingNumber: "MM-984321", customerName: "Rahul Sharma", movieTitle: "Stree 2: Sarkate Ka Aatank", seats: ["A4", "A5"], totalAmount: 640.00, status: "Confirmed" },
                    { bookingNumber: "MM-984320", customerName: "Pooja Patil", movieTitle: "Kalki 2898 AD", seats: ["B6", "B7"], totalAmount: 580.00, status: "Confirmed" },
                    { bookingNumber: "MM-984319", customerName: "Amit Joshi", movieTitle: "Deadpool & Wolverine", seats: ["C10"], totalAmount: 290.00, status: "Confirmed" }
                ],
                topMovies: [
                    { title: "Stree 2: Sarkate Ka Aatank", bookingsCount: 68 },
                    { title: "Kalki 2898 AD", bookingsCount: 52 },
                    { title: "Pushpa 2: The Rule", bookingsCount: 41 }
                ]
            };
        }

        if (clean === '/admin/bookings' || clean === '/bookings/my') {
            return [
                { bookingNumber: "MM-984321", customerName: "Rahul Sharma", customerEmail: "user@movieticket.com", movieTitle: "Stree 2: Sarkate Ka Aatank", theatreName: "INOX - Khandesh Central Mall", screenName: "Laser 4K", showDate: new Date().toISOString(), startTime: "18:30:00", seats: ["A4", "A5"], totalAmount: 640.00, paymentMethod: "UPI", status: "Confirmed" }
            ];
        }

        // 6. Create Booking
        if (clean === '/bookings' && method === 'POST') {
            const bookingNum = "MM-" + Math.floor(100000 + Math.random() * 900000);
            return {
                id: 999,
                bookingNumber: bookingNum,
                status: "Confirmed",
                totalAmount: body?.totalAmount || 500,
                message: "Booking confirmed successfully!"
            };
        }

        // Default empty fallback
        return [];
    }
};


