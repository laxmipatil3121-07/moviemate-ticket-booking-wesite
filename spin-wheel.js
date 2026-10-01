/**
 * Lucky Spin the Wheel Gamification for MovieMate
 */
(function() {
    const SEGMENTS = [
        { label: "FLAT ₹50", code: "MOVIE50", desc: "Flat ₹50 OFF on total bill!", color: "#e50914" },
        { label: "20% OFF", code: "FIRSTBOOK", desc: "20% Discount on tickets!", color: "#f59e0b" },
        { label: "15% OFF", code: "WEEKEND", desc: "15% Weekend cinema discount!", color: "#8b5cf6" },
        { label: "FLAT ₹75", code: "VIP75", desc: "VIP Flat ₹75 Special OFF!", color: "#10b981" },
        { label: "FREE SNACKS", code: "FREECOMBO", desc: "Flat ₹60 off on snacks combo!", color: "#06b6d4" },
        { label: "MEGA 30%", code: "JACKPOT30", desc: "Jackpot 30% Huge Discount!", color: "#ec4899" }
    ];

    let currentAngle = 0;
    let isSpinning = false;
    let audioCtx = null;
    let wonItem = null;

    function playTickSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
    }

    function playWinSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.1);
                gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + idx * 0.1);
                osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
            });
        } catch(e) {}
    }

    function drawWheel() {
        const canvas = document.getElementById('wheelCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const num = SEGMENTS.length;
        const arc = (2 * Math.PI) / num;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = cx - 8;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        SEGMENTS.forEach((seg, i) => {
            const angle = i * arc;
            ctx.beginPath();
            ctx.fillStyle = seg.color;
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, angle, angle + arc);
            ctx.lineTo(cx, cy);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Segment Label
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(seg.label, radius - 20, 5);
            ctx.restore();
        });
    }

    window.openSpinWheelModal = function() {
        const modalEl = document.getElementById('spinWheelModal');
        if (modalEl) {
            new bootstrap.Modal(modalEl).show();
            setTimeout(drawWheel, 200);
        }
    };

    window.spinWheel = function() {
        if (isSpinning) return;
        isSpinning = true;
        document.getElementById('btnSpinNow').disabled = true;
        document.getElementById('spinResultBox').classList.add('d-none');

        // Pick random segment
        const winIdx = Math.floor(Math.random() * SEGMENTS.length);
        wonItem = SEGMENTS[winIdx];

        const arc = 360 / SEGMENTS.length;
        // Pointer is at TOP (270 degrees in canvas coordinates)
        // Angle to land winIdx at 270 deg
        const targetDeg = (360 - (winIdx * arc) - (arc / 2) + 270) % 360;
        const totalRotations = 360 * 5; // 5 full spins
        const finalAngle = currentAngle + totalRotations + ((targetDeg - (currentAngle % 360) + 360) % 360);

        const canvas = document.getElementById('wheelCanvas');
        canvas.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)';
        canvas.style.transform = `rotate(${finalAngle}deg)`;

        // Sound ticker loop
        let tickCount = 0;
        const tickInterval = setInterval(() => {
            playTickSound();
            tickCount++;
            if (tickCount > 25) clearInterval(tickInterval);
        }, 150);

        setTimeout(() => {
            currentAngle = finalAngle;
            isSpinning = false;
            document.getElementById('btnSpinNow').disabled = false;
            playWinSound();
            triggerConfetti();

            // Display result
            document.getElementById('spinPrizeTitle').innerText = `🎉 You Won ${wonItem.label}!`;
            document.getElementById('spinPrizeDesc').innerText = wonItem.desc;
            document.getElementById('spinWonCoupon').innerText = wonItem.code;
            document.getElementById('spinResultBox').classList.remove('d-none');

            // Save to localStorage
            try {
                localStorage.setItem('moviemate_won_coupon', wonItem.code);
            } catch(e) {}
        }, 4600);
    };

    window.applyWonCoupon = function() {
        if (!wonItem) return;
        const couponInput = document.getElementById('couponInput');
        if (couponInput && typeof window.applyCoupon === 'function') {
            couponInput.value = wonItem.code;
            bootstrap.Modal.getInstance(document.getElementById('spinWheelModal'))?.hide();
            window.applyCoupon();
        } else {
            // On index or catalog: copy code
            navigator.clipboard?.writeText(wonItem.code);
            alert(`🎉 Coupon code "${wonItem.code}" copied! It will be automatically available at checkout.`);
            bootstrap.Modal.getInstance(document.getElementById('spinWheelModal'))?.hide();
        }
    };

    function triggerConfetti() {
        const modal = document.querySelector('#spinWheelModal .modal-body');
        if (!modal) return;
        for (let i = 0; i < 40; i++) {
            const conf = document.createElement('div');
            conf.style.position = 'absolute';
            conf.style.width = '8px';
            conf.style.height = '8px';
            conf.style.backgroundColor = ['#e50914', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'][Math.floor(Math.random()*5)];
            conf.style.left = (Math.random() * 80 + 10) + '%';
            conf.style.top = '10%';
            conf.style.zIndex = '99';
            conf.style.borderRadius = '50%';
            conf.style.transition = 'all 1.5s ease-out';
            modal.appendChild(conf);

            setTimeout(() => {
                conf.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 250 + 50}px) rotate(${Math.random() * 360}deg)`;
                conf.style.opacity = '0';
            }, 20);

            setTimeout(() => conf.remove(), 1600);
        }
    }

    // Auto-check if won coupon should be prefilled on booking summary
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const saved = localStorage.getItem('moviemate_won_coupon');
            const couponInput = document.getElementById('couponInput');
            if (saved && couponInput && !couponInput.value) {
                couponInput.value = saved;
            }
        }, 600);
    });
})();
