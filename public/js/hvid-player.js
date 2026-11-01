// public/js/hvid-player.js
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hvid-video');
    const container = document.getElementById('hvid-container');
    const speedIndicator = document.getElementById('speed-indicator');

    // --- Screen Size Options (Fit, Scratch, Adaptive) ---
    window.changeFit = function(type) {
        video.className = 'hvid-video ' + type;
    };

    // --- Double Tap Logic (10s Skip & Play/Pause) ---
    let lastTapTime = 0;
    
    container.addEventListener('click', (e) => {
        // Ignore clicks on control buttons
        if(e.target.classList.contains('hvid-btn')) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double Tap Detected
            const containerWidth = container.offsetWidth;
            const clickX = e.offsetX;

            if (clickX < containerWidth * 0.3) {
                // Left 30%: Rewind 10s
                video.currentTime -= 10;
            } else if (clickX > containerWidth * 0.7) {
                // Right 30%: Forward 10s
                video.currentTime += 10;
            } else {
                // Center 40%: Play/Pause (Pulse)
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
        lastTapTime = currentTime;
    });

    // --- Hold (Long Press) for 2x Speed ---
    let holdTimer;
    let isHolding = false;

    const startHold = () => {
        holdTimer = setTimeout(() => {
            isHolding = true;
            video.playbackRate = 2.0;
            speedIndicator.style.display = 'block';
        }, 500); // 500ms press required to activate 2x
    };

    const endHold = () => {
        clearTimeout(holdTimer);
        if (isHolding) {
            video.playbackRate = 1.0;
            speedIndicator.style.display = 'none';
            isHolding = false;
        }
    };

    // Mouse events for PC
    container.addEventListener('mousedown', startHold);
    container.addEventListener('mouseup', endHold);
    container.addEventListener('mouseleave', endHold);

    // Touch events for Mobile
    container.addEventListener('touchstart', startHold);
    container.addEventListener('touchend', endHold);
    container.addEventListener('touchcancel', endHold);
});
