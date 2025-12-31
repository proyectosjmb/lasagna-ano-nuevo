/* --- CONFIG DATA --- */
const RECIPE_DATA = {
    shopping: {
        verduras: [ { id: 's1', text: '🍅 1.8 kg de Jitomate' }, { id: 's2', text: '🧅 2 Cebollas grandes' }, { id: 's3', text: '🥕 4 Zanahorias' }, { id: 's4', text: '🥬 4 Ramitas de apio' }, { id: 's5', text: '🧄 16 Dientes de ajo' }, { id: 's6', text: '🌿 Hierbas Frescas' } ],
        proteina: [ { id: 's7', text: '🥩 2 KG de Carne molida' }, { id: 's8', text: '🥓 Queso Parmesano' }, { id: 's9', text: '🧀 Queso Mozzarella' } ],
        abarrotes: [ { id: 's10', text: '🥫 1.6 KG Puré lata' }, { id: 's11', text: '🧈 Mantequilla (180g)' }, { id: 's12', text: '🍞 2 Bolillos' }, { id: 's13', text: '🍝 4 Paq. Pasta' }, { id: 's14', text: '🧂 Aceite, Leche, Especias' } ]
    },
    ingredients: {
        baseTomate: [ { id: 't1', text: 'Picar 1.8 kg Jitomate' }, { id: 't2', text: 'Abrir puré' }, { id: 't3', text: 'Picar 2 Cebollas' }, { id: 't4', text: 'Picar 8 Ajos' }, { id: 't5', text: 'Separar Mantequilla/Aceite' }, { id: 't6', text: 'Hierbas listas' } ],
        bolonesa: [ { id: 'b1', text: 'Carne lista' }, { id: 'b2', text: 'Pan en leche' }, { id: 'b3', text: 'Picar Veggies' }, { id: 'b4', text: 'Rallar Zanahoria' }, { id: 'b5', text: 'Grasas listas' }, { id: 'b6', text: 'Hierbas frescas' } ],
        montaje: [ { id: 'm1', text: 'Pasta cocida' }, { id: 'm2', text: 'Quesos listos' } ]
    },
    steps: [
        { title: "Fase 1: Mega Salsa", text: "Olla grande: Derrite 12 cdas mantequilla + 4 aceite. Sofríe 2 cebollas y 8 ajos. Añade 1.8kg jitomate. 10min después, puré y sal.", tip: "Paciencia al reducir.", timers: [ { label: "Sofreír", seconds: 480 }, { label: "Cocción Jitomate", seconds: 900 }, { label: "Reducir", seconds: 1500 } ], badge: "Maestro Salsero" },
        { title: "Fase 2: Batallón Carne", text: "Mezcla carne con pan. Sofríe veggies restantes. Añade carne, dora. Añade salsa reservada.", tip: "Deshaz grumos.", timers: [ { label: "Sofreír Veggies", seconds: 600 }, { label: "Cocción Carne", seconds: 1800 } ], badge: "Comandante Carne" },
        { title: "Fase 3: Arquitectura", text: "Capas: Salsa -> Pasta -> Carne -> Queso. Repetir. Tapar.", tip: "Queso = Pegamento.", timers: [ { label: "Cocción Tapada", seconds: 1800 } ], badge: "Ingeniero Civil" },
        { title: "Fase 4: Reposo", text: "Apaga y deja reposar.", tip: "NO cortar caliente.", timers: [ { label: "Reposo", seconds: 1200 } ], badge: "Paciencia Oro" }
    ]
};

/* --- STATE --- */
let appState = {
    family: [], currentStep: 0,
    checkedIngredients: {}, checkedShopping: {}, ingredientCosts: {}, diners: 10,
    score: 0, earnedBadges: [], memories: [], timers: []
};

/* --- LOADING --- */
function loadState() {
    const saved = localStorage.getItem('lasanaMega_Finance_v3');
    if (saved) { const parsed = JSON.parse(saved); appState = { ...appState, ...parsed }; appState.timers = []; }
}
function saveState() {
    const stateToSave = { ...appState, timers: [] };
    localStorage.setItem('lasanaMega_Finance_v3', JSON.stringify(stateToSave));
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    document.getElementById('btn-add-member').addEventListener('click', addFamilyMember);
    document.getElementById('btn-start-cooking').addEventListener('click', startCooking);
    document.getElementById('btn-reset-app').addEventListener('click', resetApp);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.target)));
    
    document.getElementById('btn-next-step').addEventListener('click', nextStep);
    document.getElementById('btn-prev-step').addEventListener('click', prevStep);
    document.getElementById('btn-spin-wheel').addEventListener('click', spinChefWheel);
    document.getElementById('btn-clean-mode').addEventListener('click', toggleCleanMode);
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    
    document.getElementById('new-memory-photo').addEventListener('change', function(e) { document.getElementById('file-name-display').innerText = e.target.files[0]?e.target.files[0].name.substring(0,15):"Sin foto"; });
    document.getElementById('btn-post-memory').addEventListener('click', addMemory);

    const dinersInput = document.getElementById('shopping-diners');
    dinersInput.value = appState.diners || 10;
    dinersInput.addEventListener('input', (e) => {
        appState.diners = parseInt(e.target.value) || 1;
        saveState(); calculateFinance();
    });

    if (appState.family.length > 0) {
        renderFamilyList(); goToScreen('dashboard');
        renderShopping(); renderIngredients(); renderWizard(); renderScore(); renderMemories();
    }
    setInterval(updateTimers, 1000);
});

/* --- NAVIGATION --- */
const screens = { setup: document.getElementById('screen-setup'), dashboard: document.getElementById('screen-dashboard'), finish: document.getElementById('screen-finish') };
function goToScreen(name) { Object.values(screens).forEach(s => s.classList.add('hidden')); screens[name].classList.remove('hidden'); screens[name].classList.add('active'); }
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const content = document.getElementById(tabId); const btn = document.querySelector(`[data-target="${tabId}"]`);
    if (content && btn) { content.classList.add('active'); btn.classList.add('active'); }
}

/* --- LOGIC --- */
function addFamilyMember() {
    const name = document.getElementById('input-name').value.trim();
    if (name && appState.family.length < 6) { appState.family.push(name); document.getElementById('input-name').value=''; renderFamilyList(); saveState(); }
}
function renderFamilyList() {
    document.getElementById('family-list').innerHTML = appState.family.map(f => `<li>${f}</li>`).join('');
    document.getElementById('btn-start-cooking').disabled = appState.family.length === 0;
}
function startCooking() { if (appState.family.length > 0) { goToScreen('dashboard'); renderShopping(); renderIngredients(); renderWizard(); triggerConfetti(true); } }

/* --- SHOPPING & FINANCE --- */
function renderShopping() {
    const container = document.getElementById('shopping-list-container'); container.innerHTML = '';
    let totalItems = 0, checked = 0;
    const sections = { "verduras": "🥗 Verduras", "proteina": "🍖 Carnes", "abarrotes": "🥫 Abarrotes" };

    for (const [key, items] of Object.entries(RECIPE_DATA.shopping)) {
        const grp = document.createElement('div'); grp.className = 'ingredient-group';
        grp.innerHTML = `<h3>${sections[key]}</h3>`;
        items.forEach(item => {
            totalItems++;
            const isChecked = appState.checkedShopping[item.id];
            if (isChecked) checked++;
            const costVal = appState.ingredientCosts[item.id] || '';
            const row = document.createElement('div'); row.className = `ing-item ${isChecked ? 'checked' : ''}`;
            row.innerHTML = `<div class="ing-left" onclick="toggleShoppingItem('${item.id}')"><span style="font-size:1.2rem; margin-right:10px;">${isChecked?'✅':'🛒'}</span><span>${item.text}</span></div><input type="number" class="cost-input" placeholder="$" value="${costVal}" onchange="updateItemCost('${item.id}', this.value)" onclick="event.stopPropagation()">`;
            grp.appendChild(row);
        });
        container.appendChild(grp);
    }
    const pct = totalItems===0?0:Math.round((checked/totalItems)*100);
    document.getElementById('shopping-progress').style.width = `${pct}%`;
    calculateFinance();
    if (pct === 100 && !appState.earnedBadges.includes('proveedor-vip')) { addPoints(100); addBadge('Proveedor VIP'); appState.earnedBadges.push('proveedor-vip'); triggerConfetti(true); }
}
function toggleShoppingItem(id) { appState.checkedShopping[id] = !appState.checkedShopping[id]; if(appState.checkedShopping[id]) addPoints(5); renderShopping(); saveState(); }
window.updateItemCost = function(id, val) {
    const num = parseFloat(val); if (!isNaN(num)) appState.ingredientCosts[id] = num; else delete appState.ingredientCosts[id];
    saveState(); calculateFinance();
};
function calculateFinance() {
    const total = Object.values(appState.ingredientCosts).reduce((acc, curr) => acc + curr, 0);
    const perPerson = total / (appState.diners || 1);
    
    document.getElementById('shopping-total').innerText = `$${total.toFixed(2)}`;
    document.getElementById('shopping-per-person').innerText = `$${perPerson.toFixed(2)}`;
    
    document.getElementById('final-total-cost').innerText = `$${total.toFixed(2)}`;
    document.getElementById('final-cost-per-person').innerText = `$${perPerson.toFixed(2)}`;
    document.getElementById('final-diners-display').innerText = appState.diners;
}

/* --- PREP & WIZARD --- */
function renderIngredients() {
    const container = document.getElementById('ingredients-list'); container.innerHTML = '';
    const groups = { "Base Tomate": RECIPE_DATA.ingredients.baseTomate, "Boloñesa": RECIPE_DATA.ingredients.bolonesa, "Montaje": RECIPE_DATA.ingredients.montaje };
    for (const [title, items] of Object.entries(groups)) {
        const grp = document.createElement('div'); grp.className = 'ingredient-group'; grp.innerHTML = `<h3>${title}</h3>`;
        items.forEach(item => {
            const isChecked = appState.checkedIngredients[item.id];
            const row = document.createElement('div'); row.className = `ing-item ${isChecked ? 'checked' : ''}`;
            row.innerHTML = `<div class="ing-left"><input type="checkbox" ${isChecked?'checked':''}><span>${item.text}</span></div>`;
            row.onclick = () => { appState.checkedIngredients[item.id] = !isChecked; if(!isChecked) addPoints(5); renderIngredients(); saveState(); };
            grp.appendChild(row);
        });
        container.appendChild(grp);
    }
}
function renderWizard() {
    const step = RECIPE_DATA.steps[appState.currentStep];
    document.getElementById('step-counter').innerText = `Fase ${appState.currentStep + 1}/${RECIPE_DATA.steps.length}`;
    document.getElementById('step-title').innerText = step.title;
    document.getElementById('step-content').innerText = step.text;
    const tip = document.getElementById('chef-tip');
    if (step.tip) { tip.classList.remove('hidden'); document.getElementById('tip-text').innerText = step.tip; } else { tip.classList.add('hidden'); }
    const timersDiv = document.getElementById('step-timers-area'); timersDiv.innerHTML = '';
    step.timers.forEach(t => {
        const btn = document.createElement('button'); btn.className = 'timer-trigger-btn';
        btn.innerHTML = `⏱️ ${t.label} (${Math.round(t.seconds/60)}m)`;
        btn.onclick = () => createTimer(t.seconds, t.label);
        timersDiv.appendChild(btn);
    });
    document.getElementById('wizard-progress').style.width = `${((appState.currentStep)/(RECIPE_DATA.steps.length-1))*100}%`;
    document.getElementById('btn-prev-step').disabled = appState.currentStep === 0;
    document.getElementById('btn-next-step').innerText = appState.currentStep === RECIPE_DATA.steps.length - 1 ? "¡Terminar!" : "Siguiente";
    spinChefWheel();
}
function nextStep() {
    const badge = RECIPE_DATA.steps[appState.currentStep].badge;
    if (!appState.earnedBadges.includes(badge)) { addBadge(badge); addPoints(100); appState.earnedBadges.push(badge); triggerConfetti(true); }
    if (appState.currentStep < RECIPE_DATA.steps.length - 1) { appState.currentStep++; renderWizard(); saveState(); window.scrollTo(0,0); } else { finishCooking(); }
}
function prevStep() { if (appState.currentStep > 0) { appState.currentStep--; renderWizard(); saveState(); } }
function spinChefWheel() {
    if (appState.family.length === 0) return;
    const el = document.getElementById('current-chef-name'); el.style.opacity = 0;
    setTimeout(() => { el.innerText = appState.family[Math.floor(Math.random()*appState.family.length)]; el.style.opacity = 1; }, 200);
}

/* --- MEMORY & TIMERS --- */
function addMemory() {
    const txt = document.getElementById('new-memory-text').value.trim(); const file = document.getElementById('new-memory-photo').files[0];
    if (!txt && !file) { alert("Escribe o sube foto."); return; }
    if (file) { const r = new FileReader(); r.onload = e => saveMem(txt, e.target.result); r.readAsDataURL(file); } else { saveMem(txt, null); }
}
function saveMem(txt, img) {
    appState.memories.unshift({ id: Date.now(), time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), text: txt, image: img });
    document.getElementById('new-memory-text').value=''; document.getElementById('new-memory-photo').value=''; document.getElementById('file-name-display').innerText='Sin foto';
    addPoints(10); try{ saveState(); renderMemories(); } catch(e){ alert("Memoria llena"); appState.memories.shift(); }
}
function renderMemories() {
    const feed = document.getElementById('memories-feed'); feed.innerHTML = '';
    if (!appState.memories.length) { feed.innerHTML = '<p class="empty-state-text">Vacío...</p>'; return; }
    appState.memories.forEach(m => {
        const c = document.createElement('div'); c.className = 'memory-card';
        c.innerHTML = `<div class="memory-header"><span>🕐 ${m.time}</span><button class="btn-delete-memory" onclick="delMem(${m.id})">🗑️</button></div>${m.text?`<p>${m.text}</p>`:''}${m.image?`<div class="memory-img-container"><img src="${m.image}"></div>`:''}`;
        feed.appendChild(c);
    });
}
window.delMem = id => { if(confirm("¿Borrar?")) { appState.memories=appState.memories.filter(m=>m.id!==id); saveState(); renderMemories(); }};

function createTimer(sec, lbl) { appState.timers.push({ id: Date.now(), label: lbl, remaining: sec, paused: false }); renderActiveTimers(); }
function updateTimers() {
    if (!appState.timers.length) return; let update=false;
    appState.timers.forEach(t => { if(!t.paused && t.remaining>0) { t.remaining--; update=true; if(t.remaining===0){ playAlarm(); alert(`¡TIEMPO! ${t.label}`); } } });
    if(update) renderActiveTimers();
}
function renderActiveTimers() {
    const c = document.getElementById('active-timers-container'); c.innerHTML='';
    appState.timers.forEach(t => {
        const row = document.createElement('div'); row.className='active-timer-row';
        row.innerHTML = `<span class="timer-label">${t.label}</span><span class="timer-val" style="color:${t.remaining===0?'#4caf50':'white'}">${Math.floor(t.remaining/60).toString().padStart(2,'0')}:${(t.remaining%60).toString().padStart(2,'0')}</span><div class="timer-controls"><button onclick="pauseT(${t.id})">${t.paused?'▶':'⏸'}</button><button onclick="addT(${t.id})">+1m</button><button onclick="delT(${t.id})">✖</button></div>`;
        c.appendChild(row);
    });
}
window.pauseT = id => { const t=appState.timers.find(x=>x.id===id); if(t)t.paused=!t.paused; renderActiveTimers(); };
window.addT = id => { const t=appState.timers.find(x=>x.id===id); if(t)t.remaining+=60; renderActiveTimers(); };
window.delT = id => { appState.timers=appState.timers.filter(x=>x.id!==id); renderActiveTimers(); };
function playAlarm() { const c=new (window.AudioContext||window.webkitAudioContext)(); const o=c.createOscillator(); const g=c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value=500; o.start(); setTimeout(()=>o.stop(),1000); }

/* --- EXTRAS --- */
function addPoints(p) { appState.score+=p; document.getElementById('score-val').innerText=appState.score; saveState(); }
function addBadge(n) { document.getElementById('badges-container').innerHTML += `<span class="badge">🏆 ${n}</span>`; }
function renderScore() { document.getElementById('score-val').innerText=appState.score; document.getElementById('badges-container').innerHTML=appState.earnedBadges.map(b=>`<span class="badge">🏆 ${b}</span>`).join(''); }
function finishCooking() { goToScreen('finish'); calculateFinance(); document.getElementById('final-score').innerText = appState.score; document.getElementById('final-badges-count').innerText = appState.earnedBadges.length; document.getElementById('final-badges-display').innerHTML = appState.earnedBadges.map(b=>`<span class="badge" style="font-size:1rem;margin:5px;">🏆 ${b}</span>`).join(''); triggerConfetti(false); }
function toggleCleanMode() { document.body.classList.toggle('clean-mode'); }
function resetApp() { if(confirm("¿Borrar todo?")) { localStorage.clear(); location.reload(); } }

/* --- FIXED CONFETTI --- */
function triggerConfetti(short) {
    if(document.body.classList.contains('clean-mode')) return;
    const container = document.getElementById('confetti-container');
    const colors = ['#ffd700', '#ffffff', '#ff5252'];
    const count = short ? 50 : 150;

    for(let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + 'vw';
        
        // Random duration between 3s and 6s
        const duration = Math.random() * 3 + 3;
        // Random delay
        const delay = Math.random() * 2;
        
        // Set specific animation directly
        piece.style.animation = `confetti-fall ${duration}s linear ${delay}s forwards`;
        
        container.appendChild(piece);
        
        // Cleanup
        setTimeout(() => { piece.remove(); }, (duration + delay) * 1000);
    }
}
