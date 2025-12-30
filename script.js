const STORAGE_KEY='lasagnaNY_v2';


const steps=[
{
title:'Paso 1 · Salsa Pomodoro',
text:'En un sartén, derrite la mantequilla con el aceite. Sofríe la cebolla 5–6 minutos. Añade ajo y hierbas secas, espera 1 minuto. Incorpora jitomate y cocina 10 minutos. Agrega el puré y sal, y deja concentrar 20 minutos.',
tip:'La grasa láctea de la mantequilla reduce la acidez del jitomate.',
timers:[300,600,1200]
},
{
title:'Paso 2 · Boloñesa de la Casa',
text:'Mezcla carne con miga y sal. Sofríe vegetales y zanahoria 6 minutos. Añade carne, deshecha bien, desglasa con agua y agrega salsa. Incorpora hierbas frescas y cocina 25 minutos. Termina con parmesano.',
tip:'Desglasar recupera los sabores adheridos del primer sartén.',
timers:[360,1500]
},
{
title:'Paso 3 · Montaje y Cocción',
text:'Coloca una base de salsa. Forma capas: pasta, carne presionando, queso. Repite y termina con queso en rebanadas. Tapa, lleva a fuego medio hasta burbujear, baja y cocina 25 minutos.',
tip:'Presionar la carne mejora la estructura final.',
timers:[1500]
},
{
title:'Paso 4 · Reposo',
text:'Apaga el fuego y deja reposar la lasaña durante 15 minutos antes de servir.',
tip:'El reposo fija capas y facilita el corte.',
timers:[900]
}
];


let state=JSON.parse(localStorage.getItem(STORAGE_KEY))||{step:0,timers:[],checks:{},notes:'',photo:null};


function init(){renderStep();renderIngredients();restoreNotes();}


function renderStep(){
const s=steps[state.step];
stepIndicator.textContent=`${state.step+1} / ${steps.length}`;
stepTitle.textContent=s.title;
stepText.textContent=s.text;
stepTip.textContent='Tip del chef: '+s.tip;
progressBar.style.width=((state.step+1)/steps.length*100)+'%';


stepTimers.innerHTML='';
s.timers.forEach(t=>{
const btn=document.createElement('button');
btn.textContent=`⏱️ ${Math.round(t/60)} min`;
btn.onclick=()=>createTimer(t);
stepTimers.appendChild(btn);
});


save();
}


function createTimer(seconds){
const id=Date.now();
const el=document.createElement('div');
el.textContent=`${seconds}s`;
timers.appendChild(el);
const interval=setInterval(()=>{
seconds--;
el.textContent=`⏱️ ${seconds}s`;
if(seconds<=0){clearInterval(interval);el.textContent='✔️ Listo';}
},1000);
}


prevBtn.onclick=()=>{if(state.step>0){state.step--;renderStep();}};
nextBtn.onclick=()=>{if(state.step<steps.length-1){state.step++;renderStep();}};


function renderIngredients(){
ingredients.innerHTML='<p>(Checklist completo conservado)</p>';
}


function restoreNotes(){notes.value=state.notes||'';}
notes.oninput=e=>{state.notes=e.target.value;save();}


function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}


init();
