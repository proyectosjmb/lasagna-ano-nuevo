/* --- CONFIG DATA (Receta Masiva) --- */
const RECIPE_DATA = {
    shopping: {
        verduras: [
            { id: 's1', text: '🍅 1.8 kg de Jitomate (bien maduro)' },
            { id: 's2', text: '🧅 2 Cebollas grandes' },
            { id: 's3', text: '🥕 4 Zanahorias' },
            { id: 's4', text: '🥬 4 Ramitas de apio' },
            { id: 's5', text: '🧄 16 Dientes de ajo (2 cabezas)' },
            { id: 's6', text: '🌿 Hierbas Frescas (Albahaca/Perejil)' }
        ],
        proteina: [
            { id: 's7', text: '🥩 2 KG de Carne molida de res' },
            { id: 's8', text: '🥓 Queso Parmesano (bloque o rallado)' },
            { id: 's9', text: '🧀 Queso Mozzarella (rallado + rebanadas)' }
        ],
        abarrotes: [
            { id: 's10', text: '🥫 1.6 KG Puré de tomate (lata)' },
            { id: 's11', text: '🧈 Mantequilla (2 barras de 90g)' },
            { id: 's12', text: '🍞 2 Bolillos (o pan blanco)' },
            { id: 's13', text: '🍝 4 Paquetes de Pasta para Lasaña' },
            { id: 's14', text: '🧂 Aceite, Leche, Orégano, Tomillo, Sal' }
        ]
    },
    ingredients: {
        baseTomate: [
            { id: 't1', text: 'Picar los 1.8 kg de Jitomate' },
            { id: 't2', text: 'Abrir latas de puré (1.6 kg)' },
            { id: 't3', text: 'Picar las 2 Cebollas grandes (fino)' },
            { id: 't4', text: 'Picar 8 Dientes de ajo' },
            { id: 't5', text: 'Separar 12 cdas Mantequilla + 4 Aceite' },
            { id: 't6', text: 'Hierbas secas listas' }
        ],
        bolonesa: [
            { id: 'b1', text: 'Carne (2kg) lista' },
            { id: 'b2', text: 'Miga de 2 bolillos en leche' },
            { id: 'b3', text: 'Picar: 2 Cebollas, 4 Apio, 8 Ajo' },
            { id: 'b4', text: 'Rallar 4 Zanahorias' },
            { id: 'b5', text: 'Separar 4 cdas Mantequilla + 4 Aceite' },
            { id: 'b6', text: 'Hierbas frescas picadas' }
        ],
        montaje: [
            { id: 'm1', text: 'Pasta cocida (4 paquetes)' },
            { id: 'm2', text: 'Quesos rallados y listos' }
        ]
    },
    steps: [
        {
            title: "Fase 1: La Mega Salsa",
            text: "En olla grande: Derrite 12 cdas mantequilla + 4 aceite. Sofríe 2 cebollas y 8 ajos. Añade hierbas secas. Agrega 1.8kg jitomate picado. Tras 10 min, agrega 1.6kg puré y sal.",
            tip: "Paciencia. Es mucha salsa, tardará en hervir.",
            timers: [ { label: "Sofreír Cebolla", seconds: 480 }, { label: "Cocción Jitomate", seconds: 900 }, { label: "Reducir Salsa", seconds: 1500 } ],
            badge: "Maestro Salsero"
        },
        {
            title: "Fase 2: Batallón de Carne",
            text: "Mezcla 2kg carne con pan mojado y sal. En sartén gigante (o 2 tandas): sofríe 2 cebollas, apio, 8 ajos y zanahoria rallada en mantequilla/aceite. Añade carne y dora bien. Agrega salsa de tomate reservada y hierbas frescas.",
            tip: "Deshaz bien los grumos de carne para que quede fina.",
            timers: [ { label: "Sofreír Veggies", seconds: 600 }, { label: "Cocción Carne", seconds: 1800 } ],
            badge: "Comandante de Carne"
        },
        {
            title: "Fase 3: Arquitectura",
            text: "Sartén o refractarios. Capas: Salsa base -> Pasta -> Carne -> Queso. Repetir hasta el tope. Tapa y cocina a fuego medio-bajo.",
            tip: "El queso fundido es el pegamento.",
            timers: [ { label: "Cocción Tapada", seconds: 1800 } ],
            badge: "Ingeniero Civil"
        },
        {
            title: "Fase 4: Reposo",
            text: "Apaga. Deja reposar la lasaña antes de cortar.",
            tip: "Si cortas caliente, se desarma. ¡Espera!",
            timers: [ { label: "Reposo Crucial", seconds: 1200 } ],
            badge: "Paciencia de Oro"
        }
    ]
};

/* --- STATE --- */
let appState = {
    family: [],
    currentStep: 0,
    checkedIngredients: {},
    checkedShopping: {},
    score: 0,
    earnedBadges: [],
    memories: [], // Array para guardar bitácora
    timers: []
};

/* --- LOADING & SAVING --- */
function loadState() {
    const saved = localStorage.getItem('lasanaMega_Final');
    if (saved) {
        const parsed = JSON.parse(saved);
        appState = { ...appState, ...parsed };
        appState.timers = []; // Timers reset on reload
    }
}

function saveState() {
    const stateToSave = { ...appState, timers: [] };
    localStorage.setItem('lasanaMega_Final', JSON.stringify(stateToSave));
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // UI Events
    document.getElementById('btn-add-member').addEventListener('click', addFamilyMember);
    document.getElementById('btn-start-cooking').addEventListener('click', startCooking);
    document.getElementById('btn-reset-app').addEventListener('click', resetApp);
    
    // TABS FIX: Usar e.currentTarget para detectar el botón correctamente
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.target));
    });

    // Wizard & Tools
    document.getElementById('btn-next-step').addEventListener('click', nextStep);
    document.getElementById('btn-prev-step').addEventListener('click', prevStep);
    document.getElementById('btn-spin-wheel').addEventListener('click', spinChefWheel);
    document.getElementById('btn-clean-mode').addEventListener('click', toggleCleanMode);
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    
    // BITÁCORA PRO EVENTS
    document.getElementById('new-memory-photo').addEventListener('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : "Sin foto";
        document.getElementById('file-name-display').innerText = fileName.substring(0, 15) + (fileName.length>15?'...':'');
    });
    document.getElementById('btn-post-memory').addEventListener('click', addMemory);

    // Restaurar Estado si ya existe familia
    if (appState.family.length > 0) {
        renderFamilyList();
        goToScreen('dashboard');
        renderShopping();
        renderIngredients();
        renderWizard();
        renderScore();
        renderMemories();
    }

    setInterval(updateTimers, 1000);
});

/* --- NAVIGATION --- */
const screens = {
    setup: document.getElementById('screen-setup'),
    dashboard: document.getElementById('screen-dashboard'),
    finish: document.getElementById('screen-finish')
};

function goToScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const targetContent = document.getElementById(tabId);
    const targetBtn = document.querySelector(`[data-target="${tabId}"]`);
    
    if (targetContent && targetBtn) {
        targetContent.classList.add('active');
        targetBtn.classList.add('active');
    }
}

/* --- LOGIC MODULES --- */
function addFamilyMember() {
    const input = document.getElementById('input-name');
    const name = input.value.trim();
    if (name && appState.family.length < 6) {
        appState.family.push(name);
        input.value = '';
        renderFamilyList();
        saveState();
    }
}
function renderFamilyList() {
    const list = document.getElementById('family-list');
    list.innerHTML = appState.family.map(f => `<li>${f}</li>`).join('');
    document.getElementById('btn-start-cooking').disabled = appState.family.length === 0;
}
function startCooking() {
    if (appState.family.length === 0) return;
    goToScreen('dashboard');
    renderShopping();
    renderIngredients();
    renderWizard();
    triggerConfetti(true);
}

// SHOPPING
function renderShopping() {
    const container = document.getElementById('shopping-list-container');
    container.innerHTML = '';
    let total = 0, checked = 0;
    const sections = { "verduras": "🥗 Verduras", "proteina": "🍖 Carnes & Quesos", "abarrotes": "🥫 Abarrotes" };

    for (const [key, items] of Object.entries(RECIPE_DATA.shopping)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'ingredient-group';
        groupDiv.innerHTML = `<h3>${sections[key]}</h3>`;
        items.forEach(item => {
            total++;
            const isChecked = appState.checkedShopping[item.id];
            if (isChecked) checked++;
            const row = document.createElement('div');
            row.className = `ing-item ${isChecked ? 'checked' : ''}`;
            row.innerHTML = `<span style="font-size:1.2rem; margin-right:10px;">${isChecked?'✅':'🛒'}</span><span>${item.text}</span>`;
            row.onclick = () => toggleShoppingItem(item.id);
            groupDiv.appendChild(row);
        });
        container.appendChild(groupDiv);
    }
    const pct = total === 0 ? 0 : Math.round((checked/total)*100);
    document.getElementById('shopping-progress').style.width = `${pct}%`;
    if (pct === 100 && !appState.earnedBadges.includes('proveedor-vip')) {
        addPoints(100); addBadge('Proveedor VIP'); appState.earnedBadges.push('proveedor-vip'); triggerConfetti(true);
    }
}
function toggleShoppingItem(id) {
    appState.checkedShopping[id] = !appState.checkedShopping[id];
    if(appState.checkedShopping[id]) addPoints(5);
    renderShopping(); saveState();
}

// PREP
function renderIngredients() {
    const container = document.getElementById('ingredients-list');
    container.innerHTML = '';
    let total = 0, checked = 0;
    const groups = { "Base Tomate": RECIPE_DATA.ingredients.baseTomate, "Boloñesa": RECIPE_DATA.ingredients.bolonesa, "Montaje": RECIPE_DATA.ingredients.montaje };
    for (const [title, items] of Object.entries(groups)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'ingredient-group';
        groupDiv.innerHTML = `<h3>${title}</h3>`;
        items.forEach(item => {
            total++;
            const isChecked = appState.checkedIngredients[item.id];
            if (isChecked) checked++;
            const row = document.createElement('div');
            row.className = `ing-item ${isChecked ? 'checked' : ''}`;
            row.innerHTML = `<input type="checkbox" ${isChecked ? 'checked' : ''}><span>${item.text}</span>`;
            row.querySelector('input').addEventListener('change', () => toggleIngredient(item.id));
            groupDiv.appendChild(row);
        });
        container.appendChild(groupDiv);
    }
    const pct = total === 0 ? 0 : Math.round((checked/total)*100);
    document.getElementById('ingredients-progress').style.width = `${pct}%`;
    if (pct === 100 && !appState.earnedBadges.includes('mise-en-place')) {
        addPoints(50); addBadge('Mise En Place Master'); appState.earnedBadges.push('mise-en-place');
    }
}
function toggleIngredient(id) {
    appState.checkedIngredients[id] = !appState.checkedIngredients[id];
    if (appState.checkedIngredients[id]) addPoints(5);
    renderIngredients(); saveState();
}

// BITÁCORA PRO (Timeline)
function addMemory() {
    const textInput = document.getElementById('new-memory-text');
    const fileInput = document.getElementById('new-memory-photo');
    const text = textInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) { alert("Escribe algo o sube una foto."); return; }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { saveMemoryObject(text, e.target.result); };
        reader.readAsDataURL(file);
    } else {
        saveMemoryObject(text, null);
    }
}

function saveMemoryObject(text, imageBase64) {
    const newMemory = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: text,
        image: imageBase64
    };
    if (!appState.memories) appState.memories = [];
    appState.memories.unshift(newMemory);
    
    document.getElementById('new-memory-text').value = "";
    document.getElementById('new-memory-photo').value = "";
    document.getElementById('file-name-display').innerText = "Sin foto";

    addPoints(10);
    try { saveState(); renderMemories(); } catch (e) { alert("Memoria local llena. Borra fotos antiguas."); appState.memories.shift(); }
}

function renderMemories() {
    const feed = document.getElementById('memories-feed');
    feed.innerHTML = '';
    if (!appState.memories || appState.memories.length === 0) {
        feed.innerHTML = '<p class="empty-state-text">Aún no hay momentos registrados.</p>'; return;
    }
    appState.memories.forEach(mem => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        let imageHtml = mem.image ? `<div class="memory-img-container"><img src="${mem.image}" alt="Foto"></div>` : '';
        const textHtml = mem.text ? `<p>${mem.text}</p>` : '';
        card.innerHTML = `<div class="memory-header"><span style="font-weight:bold;">🕐 ${mem.time}</span><button class="btn-delete-memory" onclick="deleteMemory(${mem.id})">🗑️</button></div>${textHtml}${imageHtml}`;
        feed.appendChild(card);
    });
}
window.deleteMemory = function(id) {
    if(confirm("¿Borrar este recuerdo?")) { appState.memories = appState.memories.filter(m => m.id !== id); saveState(); renderMemories(); }
};

// WIZARD
function renderWizard() {
    const stepData = RECIPE_DATA.steps[appState.currentStep];
    document.getElementById('step-counter').innerText = `Fase ${appState.currentStep + 1}/${RECIPE_DATA.steps.length}`;
    document.getElementById('step-title').innerText = stepData.title;
    document.getElementById('step-content').innerText = stepData.text;
    const tipBox = document.getElementById('chef-tip');
    if (stepData.tip) { tipBox.classList.remove('hidden'); document.getElementById('tip-text').innerText = stepData.tip; } else { tipBox.classList.add('hidden'); }
    
    const timerContainer = document.getElementById('step-timers-area');
    timerContainer.innerHTML = '';
    stepData.timers.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'timer-trigger-btn';
        btn.innerHTML = `⏱️ ${t.label} (${Math.round(t.seconds/60)} min)`;
        btn.onclick = () => createTimer(t.seconds, t.label);
        timerContainer.appendChild(btn);
    });

    document.getElementById('wizard-progress').style.width = `${((appState.currentStep)/(RECIPE_DATA.steps.length-1))*100}%`;
    document.getElementById('btn-prev-step').disabled = appState.currentStep === 0;
    document.getElementById('btn-next-step').innerText = appState.currentStep === RECIPE_DATA.steps.length - 1 ? "¡Terminar!" : "Siguiente";
    spinChefWheel();
}
function nextStep() {
    const stepData = RECIPE_DATA.steps[appState.currentStep];
    if (!appState.earnedBadges.includes(stepData.badge)) {
        addBadge(stepData.badge); addPoints(100); appState.earnedBadges.push(stepData.badge); triggerConfetti(true);
    }
    if (appState.currentStep < RECIPE_DATA.steps.length - 1) {
        appState.currentStep++; renderWizard(); saveState(); window.scrollTo(0,0);
    } else { finishCooking(); }
}
function prevStep() { if (appState.currentStep > 0) { appState.currentStep--; renderWizard(); saveState(); } }
function spinChefWheel() {
    if (appState.family.length === 0) return;
    const el = document.getElementById('current-chef-name');
    el.style.opacity = 0;
    setTimeout(() => { el.innerText = appState.family[Math.floor(Math.random()*appState.family.length)]; el.style.opacity = 1; }, 200);
}

// TIMERS
function createTimer(seconds, label) { appState.timers.push({ id: Date.now(), label: label, remaining: seconds, paused: false }); renderActiveTimers(); }
function updateTimers() {
    if (appState.timers.length === 0) return;
    let needsRender = false;
    appState.timers.forEach(timer => {
        if (!timer.paused && timer.remaining > 0) {
            timer.remaining--; needsRender = true;
            if (timer.remaining === 0) { playAlarm(); setTimeout(() => alert(`¡TIEMPO! - ${timer.label}`), 100); }
        }
    });
    if (needsRender) renderActiveTimers();
}
function renderActiveTimers() {
    const container = document.getElementById('active-timers-container');
    container.innerHTML = '';
    appState.timers.forEach(timer => {
        const row = document.createElement('div');
        row.className = 'active-timer-row';
        const mins = Math.floor(timer.remaining/60).toString().padStart(2,'0');
        const secs = (timer.remaining%60).toString().padStart(2,'0');
        row.innerHTML = `<span class="timer-label">${timer.label}</span><span class="timer-val" style="color:${timer.remaining===0?'#4caf50':'white'}">${mins}:${secs}</span><div class="timer-controls"><button onclick="togglePauseTimer(${timer.id})">${timer.paused?'▶':'⏸'}</button><button onclick="addMinute(${timer.id})">+1m</button><button onclick="deleteTimer(${timer.id})">✖</button></div>`;
        container.appendChild(row);
    });
}
window.togglePauseTimer = (id) => { const t = appState.timers.find(x=>x.id===id); if(t)t.paused=!t.paused; renderActiveTimers(); };
window.addMinute = (id) => { const t = appState.timers.find(x=>x.id===id); if(t)t.remaining+=60; renderActiveTimers(); };
window.deleteTimer = (id) => { appState.timers = appState.timers.filter(x=>x.id!==id); renderActiveTimers(); };
function playAlarm() { const ctx = new (window.AudioContext||window.webkitAudioContext)(); const osc=ctx.createOscillator(); const gain=ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value=500; osc.start(); setTimeout(()=>osc.stop(),1000); }

// UTILS
function addPoints(pts) { appState.score += pts; renderScore(); saveState(); }
function addBadge(name) { const c = document.getElementById('badges-container'); const b = document.createElement('span'); b.className = 'badge'; b.innerText = `🏆 ${name}`; c.appendChild(b); }
function renderScore() { document.getElementById('score-val').innerText = appState.score; }
function finishCooking() { goToScreen('finish'); document.getElementById('final-score').innerText = appState.score; document.getElementById('final-badges-count').innerText = appState.earnedBadges.length; document.getElementById('final-badges-display').innerHTML = appState.earnedBadges.map(b=>`<span class="badge" style="font-size:1rem;margin:5px;">🏆 ${b}</span>`).join(''); triggerConfetti(false); }
function toggleCleanMode() { document.body.classList.toggle('clean-mode'); }
function resetApp() { if(confirm("¿Reiniciar TODO?")) { localStorage.clear(); location.reload(); } }
function triggerConfetti(short) {
    if(document.body.classList.contains('clean-mode')) return;
    const c = document.getElementById('confetti-container');
    const cols = ['#ffd700','#ffffff','#ff5252'];
    for(let i=0; i<(short?50:150); i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.backgroundColor = cols[Math.floor(Math.random()*cols.length)];
        p.style.left = Math.random()*100+'vw';
        p.style.width = Math.random()*10+5+'px'; p.style.height = Math.random()*10+5+'px';
        p.style.animation = `realistic-fall ${Math.random()*2+3}s linear ${Math.random()}s forwards`;
        c.appendChild(p);
        setTimeout(()=>p.remove(), 5000);
    }
}
