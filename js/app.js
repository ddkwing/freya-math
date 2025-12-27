/**
 * Freya Math Magic - Main Application Logic
 * Handles rendering, state management, and user interactions
 */

// --- Storage & State ---
const STORAGE_KEY = 'freya_math_magic_v1';
let userProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let totalPoints = 0;
let currentLevel = -1;

// --- Encouraging Messages ---
const encourageMessages = [
    "✨ Perfect mastery!",
    "⭐ Magic +1!",
    "🌟 Excellent!",
    "💫 Knowledge absorbed!",
    "❄️ Ice magic enhanced!",
    "🔮 Wisdom grows!",
    "✦ Brilliantly done!",
    "⚡ Power surge!"
];

// --- Initialization ---
function init() {
    renderList();
    updateState();
    createScreenFlashOverlay();
}

// --- Create Screen Flash Overlay ---
function createScreenFlashOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'screen-flash';
    overlay.className = 'screen-flash-overlay';
    document.body.appendChild(overlay);
}

// --- Render List ---
function renderList() {
    const container = document.getElementById('app-container');
    let globalPointIndex = 0;

    magicData.forEach((section, index) => {
        const scrollEl = document.createElement('div');
        scrollEl.className = 'magic-scroll';
        // Expand first section by default
        if (index === 0) scrollEl.classList.add('open');

        // Check section completion
        let sectionTotal = 0;
        let sectionChecked = 0;

        // Build inner HTML
        let contentHtml = '';
        section.topics.forEach(topic => {
            let pointsHtml = '';
            topic.points.forEach(point => {
                const pid = `p_${section.id}_${globalPointIndex}`;
                const isChecked = userProgress[pid] === true;
                
                sectionTotal++;
                if(isChecked) sectionChecked++;
                totalPoints++;
                
                pointsHtml += `
                    <div class="checklist-item ${isChecked ? 'checked' : ''}" onclick="togglePoint('${pid}', this, event)">
                        <div class="rune-checkbox">
                            <div class="checkbox-ring"></div>
                            <div class="checkbox-core"></div>
                        </div>
                        <div class="item-text">
                            ${point.t}
                            <small>${point.d}</small>
                        </div>
                    </div>
                `;
                globalPointIndex++;
            });

            contentHtml += `
                <div class="topic-group">
                    <div class="topic-name">${topic.name}</div>
                    ${pointsHtml}
                </topic-group>
            `;
        });

        // Section completion status
        const isSectionDone = sectionChecked === sectionTotal && sectionTotal > 0;
        if (isSectionDone) scrollEl.classList.add('completed');

        scrollEl.innerHTML = `
            <div class="scroll-header" onclick="toggleScroll(this)">
                <div class="scroll-title">${section.icon} ${section.title}</div>
                <div class="scroll-status ${isSectionDone ? 'done' : ''}">
                    ${isSectionDone ? '封印解除' : '修炼中 ' + sectionChecked + '/' + sectionTotal}
                </div>
            </div>
            <div class="scroll-content">
                ${contentHtml}
            </div>
        `;

        container.appendChild(scrollEl);
    });

    // Fix totalPoints
    totalPoints = globalPointIndex;
}

// --- Toggle Scroll Collapse ---
window.toggleScroll = function(header) {
    const parent = header.parentElement;
    parent.classList.toggle('open');
};

// --- Toggle Knowledge Point ---
window.togglePoint = function(pid, domElement, event) {
    // Toggle state
    const current = userProgress[pid] || false;
    const newState = !current;
    userProgress[pid] = newState;
    
    // Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));

    // UI visual feedback
    if (newState) {
        domElement.classList.add('checked');
        
        // Enhanced feedback effects
        createParticleBurst(event);
        triggerScreenFlash();
        triggerCheckboxRipple(domElement);
        showEncourageToast();
        triggerFreyaCelebration();
    } else {
        domElement.classList.remove('checked');
    }

    // Update overall progress & section status
    updateState();
    
    // Refresh current section header count
    updateSectionHeader(domElement);
};

// --- Create Particle Burst Effect ---
function createParticleBurst(event) {
    const particleCount = 12;
    const particles = ['✦', '✧', '⋆', '❄', '✨', '⭐'];
    const colors = ['#a5f2f3', '#6b48ff', '#ffd700', '#ff79c6', '#50fa7b', '#8be9fd'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-burst-particle';
        particle.innerText = particles[Math.floor(Math.random() * particles.length)];
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = event.clientX + 'px';
        particle.style.top = event.clientY + 'px';
        
        // Random direction
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.setProperty('--rotate', (Math.random() * 720 - 360) + 'deg');
        
        document.body.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

// --- Screen Flash Effect ---
function triggerScreenFlash() {
    const flash = document.getElementById('screen-flash');
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 300);
}

// --- Checkbox Ripple Effect ---
function triggerCheckboxRipple(domElement) {
    const checkbox = domElement.querySelector('.rune-checkbox');
    checkbox.classList.add('ripple');
    setTimeout(() => checkbox.classList.remove('ripple'), 600);
}

// --- Show Random Encourage Toast ---
function showEncourageToast() {
    const msg = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
    
    // Create floating encourage text
    const floater = document.createElement('div');
    floater.className = 'encourage-floater';
    floater.innerText = msg;
    floater.style.left = (Math.random() * 60 + 20) + '%';
    document.body.appendChild(floater);
    
    setTimeout(() => floater.remove(), 1500);
}

// --- Freya Celebration Animation ---
function triggerFreyaCelebration() {
    const avatar = document.getElementById('freya-avatar');
    avatar.classList.add('celebrating');
    setTimeout(() => avatar.classList.remove('celebrating'), 800);
}

// --- Update Single Section Header Status ---
function updateSectionHeader(domElement) {
    const scrollEl = domElement.closest('.magic-scroll');
    const checkboxes = scrollEl.querySelectorAll('.checklist-item');
    const checked = scrollEl.querySelectorAll('.checklist-item.checked');
    
    const isDone = checkboxes.length === checked.length;
    const statusDiv = scrollEl.querySelector('.scroll-status');
    
    statusDiv.innerText = isDone ? '封印解除' : `修炼中 ${checked.length}/${checkboxes.length}`;
    if (isDone) {
        statusDiv.classList.add('done');
        scrollEl.classList.add('completed');
        // Section complete celebration
        showToast('🎉 Section complete! Seal broken!');
    } else {
        statusDiv.classList.remove('done');
        scrollEl.classList.remove('completed');
    }
}

// --- Global State Update (Progress Bar, Character) ---
function updateState() {
    const checkedCount = Object.values(userProgress).filter(v => v === true).length;
    const percent = Math.floor((checkedCount / totalPoints) * 100) || 0;

    // Update progress bar with glow effect
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = percent + '%';
    progressBar.classList.add('updating');
    setTimeout(() => progressBar.classList.remove('updating'), 500);
    
    document.getElementById('progress-percent').innerText = percent + '%';

    // Calculate level (0-10)
    // Simple algorithm: 10% per level, 100% = level 10
    let level = Math.floor(percent / 10);
    if (level > 10) level = 10;
    
    updateFreya(level, percent);
}

// --- Update Equipment UI ---
function updateFreya(level, percent) {
    if (level === currentLevel) return; // No change

    const data = freyaForms[level];
    const equipment = document.getElementById('freya-avatar');
    const heroSection = document.querySelector('.hero-section');
    const badge = document.getElementById('realm-level');
    const title = document.getElementById('realm-name');

    // Level up popup with grand effect
    if (level > currentLevel && currentLevel !== -1) {
        showToast(`✨ Realm breakthrough! Ascended to: ${data.name}`);
        triggerLevelUpEffect();
    }

    currentLevel = level;

    // Set data-level attribute - CSS equipment and landscape respond to this
    equipment.dataset.level = level;
    heroSection.dataset.level = level;

    if (level === 10) equipment.classList.add('level-max');
    else equipment.classList.remove('level-max');

    badge.innerText = `Realm ${level}`;
    badge.style.background = `linear-gradient(90deg, ${data.color}, #fff)`;
    
    title.innerText = data.name;
}

// --- Level Up Grand Effect ---
function triggerLevelUpEffect() {
    const avatar = document.getElementById('freya-avatar');
    avatar.classList.add('level-up');
    
    // Create burst of particles around avatar
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'levelup-particle';
            particle.innerText = ['✦', '✧', '⋆', '★'][Math.floor(Math.random() * 4)];
            
            const avatarRect = avatar.getBoundingClientRect();
            const centerX = avatarRect.left + avatarRect.width / 2;
            const centerY = avatarRect.top + avatarRect.height / 2;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 50;
            particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);
        }, i * 30);
    }
    
    setTimeout(() => avatar.classList.remove('level-up'), 1000);
}

// --- Toast Popup ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Easter Egg: Click Character to Talk ---
window.triggerFreyaTalk = function() {
    const data = freyaForms[currentLevel];
    showToast(`Freya: "${data.quote}"`);
};

// --- Start Application ---
document.addEventListener('DOMContentLoaded', init);
