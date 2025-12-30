/* Estado global */
ul.innerHTML = `<strong>${group}</strong>`;
data[group].forEach(item=>{
const id = group+item;
const checked = state.checks[id]?'checked':'';
ul.innerHTML += `<li><label><input type="checkbox" data-id="${id}" ${checked}/> ${item}</label></li>`;
});
wrap.appendChild(ul);
});
}


function bindUI(){
document.getElementById('nextBtn').onclick=()=>{if(state.step<steps.length-1){state.step++;state.points+=10;renderWizard();}};
document.getElementById('prevBtn').onclick=()=>{if(state.step>0){state.step--;renderWizard();}};


document.getElementById('ingredients').addEventListener('change',e=>{
if(e.target.dataset.id){state.checks[e.target.dataset.id]=e.target.checked;saveState();}
});


document.getElementById('checkAll').onclick=()=>{
document.querySelectorAll('#ingredients input').forEach(i=>{i.checked=true;state.checks[i.dataset.id]=true});saveState();
};
document.getElementById('resetChecks').onclick=()=>{state.checks={};renderIngredients();saveState();};


document.getElementById('spinWheel').onclick=spinChefWheel;


document.getElementById('notes').oninput=e=>{state.notes=e.target.value;saveState();};


document.getElementById('photoInput').onchange=handlePhoto;


document.getElementById('cleanMode').onclick=()=>{
document.body.classList.toggle('clean');
};
}


function spinChefWheel(){
const names = document.getElementById('familyNames').value.split(',').map(n=>n.trim()).filter(Boolean);
if(!names.length)return;
const pick = names[Math.floor(Math.random()*names.length)];
document.getElementById('chefResult').textContent = `👑 Chef del paso: ${pick}`;
}


function handlePhoto(e){
const file = e.target.files[0];
if(!file)return;
const reader = new FileReader();
reader.onload=()=>{
state.photo=reader.result;
document.getElementById('photoPreview').innerHTML=`<img src="${reader.result}"/>`;
saveState();
};
reader.readAsDataURL(file);
}


function restoreNotes(){
document.getElementById('notes').value = state.notes||'';
if(state.photo){document.getElementById('photoPreview').innerHTML=`<img src="${state.photo}"/>`;}
}


function saveState(){localStorage.setItem('lasagnaNY',JSON.stringify(state));}
function loadState(){return JSON.parse(localStorage.getItem('lasagnaNY'));}


initApp();
