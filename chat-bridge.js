/* Équilibre : code reçu via ChatGPT -> suggestion, jamais sauvegardée sans accord.
 Format EQ1|AAAA-MM-JJ|0-3|kcal|nom-encodeURIComponent */
(()=>{
 "use strict";
 const meals=["Petit-déjeuner","Déjeuner","Dîner","Collation"];
 const section=document.getElementById("view-aliments");if(!section)return;
 const card=document.createElement("section");card.className="card";card.id="chatgpt-import";
 card.style.cssText="margin-bottom:20px;padding:20px;border:1px solid #edd8dc";
 card.innerHTML=[
 '<p class="eyebrow">♡ SUGGESTION DEPUIS NOTRE CONVERSATION</p>',
 '<h2 style="margin:8px 0">Ton repas proposé par ChatGPT</h2>',
 '<p class="subtle">Colle le code donné dans la discussion. Tu peux vérifier les calories avant de confirmer. Les données restent sur ton appareil.</p>',
 '<form id="chatMealForm" style="display:grid;gap:10px;margin-top:15px">',
 '<label for="chatMealCode">Code du repas</label>',
 '<textarea id="chatMealCode" rows="2" placeholder="Colle ici le code EQ1|..." style="width:100%;max-width:100%;padding:12px;border:1px solid #e4d3d2;border-radius:12px;font:inherit"></textarea>',
 '<button type="submit" class="btn btn-secondary">Voir la suggestion</button></form>',
 '<div id="chatMealPreview" class="hidden" style="margin-top:14px;padding:14px;background:#fff7f7;border-radius:12px">',
 '<p style="font-size:13px;margin:0 0 7px">Repas suggéré — à vérifier avant ajout</p>',
 '<strong id="chatMealName" style="display:block"></strong>',
 '<p id="chatMealInfo" style="margin:6px 0 12px"></p>',
 '<div style="display:flex;gap:10px;flex-wrap:wrap">',
 '<button type="button" class="btn btn-primary" id="chatMealConfirm">＋ Ajouter ce repas</button>',
 '<button type="button" class="btn btn-outline" id="chatMealCancel">Annuler</button></div></div>'
 ].join("");
 const bar=section.querySelector(".food-toolbar");if(bar)section.insertBefore(card,bar);else section.appendChild(card);
 const field=card.querySelector("#chatMealCode"),preview=card.querySelector("#chatMealPreview");
 let pending=null;
 function parseCode(raw){
  let s=String(raw||"").trim();
  if(s.startsWith("https://")||s.startsWith("http://")){try{s=new URL(s).hash;}catch{return null;}}
  if(s.startsWith("#repas=")){try{s=decodeURIComponent(s.slice(7));}catch{return null;}}
  if(s.length>1500||!s.startsWith("EQ1|"))return null;
  const parts=s.split("|");if(parts.length!==5)return null;
  const [,day,mealIndex,kcalText,encodedName]=parts;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!["0","1","2","3"].includes(mealIndex))return null;
  const d=parseDay(day);
  if(Number.isNaN(d.getTime())||ymd(d)!==day||day<daysBack(364)||day>ymd(new Date()))return null;
  const kcal=Number(kcalText);
  if(!/^\d{1,5}$/.test(kcalText)||!Number.isInteger(kcal)||kcal>10000)return null;
  let name;try{name=decodeURIComponent(encodedName).trim();}catch{return null;}
  if(!name||name.length>140||/[\x00-\x08]/.test(name))return null;
  return {day,meal:meals[Number(mealIndex)],kcal,name};
 }
 function show(code){
  const p=parseCode(code);
  if(!p){pending=null;preview.classList.add("hidden");toast("Code non reconnu ou date hors des 365 derniers jours.");return;}
  pending=p;
  card.querySelector("#chatMealName").textContent=p.name;
  card.querySelector("#chatMealInfo").textContent=p.meal+" · "+dateLabel(p.day,{day:"numeric",month:"long",year:"numeric"})+" · "+fmt(p.kcal)+" kcal estimées";
  preview.classList.remove("hidden");setView("aliments");card.scrollIntoView({behavior:"smooth",block:"start"});
 }
 card.querySelector("#chatMealForm").addEventListener("submit",e=>{e.preventDefault();show(field.value);});
 card.querySelector("#chatMealCancel").addEventListener("click",()=>{pending=null;preview.classList.add("hidden");field.value="";});
 card.querySelector("#chatMealConfirm").addEventListener("click",()=>{
  if(!pending)return;const p=pending;pending=null;
  preview.classList.add("hidden");field.value="";selectedDay=p.day;
  addEntry({label:p.name,kcal:p.kcal,meal:p.meal,emoji:"🍽️",grams:null});
  setView("accueil");toast("Repas ajouté à ton journal ♡");
 });
 if(window.location.hash.startsWith("#repas=")){
  const hash=window.location.hash;history.replaceState(null,"",location.pathname+location.search+"#aliments");
  try{field.value=decodeURIComponent(hash.slice(7));}catch{field.value="";}
  show(hash);
 }
})();