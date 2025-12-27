/**
 * Freya Math Magic - Main Application Logic
 * Handles rendering, state management, and user interactions
 */

// --- Storage & State ---
const STORAGE_KEY = 'freya_math_magic_v1';
let userProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let totalPoints = 0;
let currentLevel = -1;

// --- Initialization ---
function init() {
    renderList();
    updateState();
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
                    <div class="checklist-item ${isChecked ? 'checked' : ''}" onclick="togglePoint('${pid}', this)">
                        <div class="rune-checkbox"></div>
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
                </div>
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
window.togglePoint = function(pid, domElement) {
    // Toggle state
    const current = userProgress[pid] || false;
    userProgress[pid] = !current;
    
    // Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));

    // UI visual feedback
    if (userProgress[pid]) {
        domElement.classList.add('checked');
    } else {
        domElement.classList.remove('checked');
    }

    // Update overall progress & section status
    updateState();
    
    // Refresh current section header count
    updateSectionHeader(domElement);
};

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
    } else {
        statusDiv.classList.remove('done');
        scrollEl.classList.remove('completed');
    }
}

// --- Global State Update (Progress Bar, Character) ---
function updateState() {
    const checkedCount = Object.values(userProgress).filter(v => v === true).length;
    const percent = Math.floor((checkedCount / totalPoints) * 100) || 0;

    // Update progress bar
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';

    // Calculate level (0-10)
    // Simple algorithm: 10% per level, 100% = level 10
    let level = Math.floor(percent / 10);
    if (level > 10) level = 10;
    
    updateFreya(level, percent);
}

// --- Update Character UI ---
function updateFreya(level, percent) {
    if (level === currentLevel) return; // No change

    const data = freyaForms[level];
    const avatar = document.getElementById('freya-avatar');
    const badge = document.getElementById('realm-level');
    const title = document.getElementById('realm-name');

    // Level up popup
    if (level > currentLevel && currentLevel !== -1) {
        showToast(`✨ 境界突破！晋升为：${data.name}`);
    }

    currentLevel = level;

    // Set styles - CSS character responds to data-level attribute
    avatar.dataset.level = level;
    avatar.style.borderColor = data.color;
    avatar.style.boxShadow = `0 0 20px ${data.color}`;

    if (level === 10) avatar.classList.add('level-max');
    else avatar.classList.remove('level-max');

    badge.innerText = `第 ${level} 重境界`;
    badge.style.background = `linear-gradient(90deg, ${data.color}, #fff)`;
    
    title.innerText = data.name;
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

