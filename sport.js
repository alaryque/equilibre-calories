/* HIIT full body : minuteur à horloge réelle, sauvegarde locale séparée. */
'use strict';
const HIIT_MOVES={
 burpee:['Burpee avec pompe','Mains sous les épaules, corps gainé ; recule les pieds, fais une pompe puis reviens et saute bas.','Burpee marché avec pompe, sans saut'],
 squat:['Squat sauté contrôlé','Hanches en arrière, genoux dans l’axe des pieds ; réception souple, saute seulement si tu contrôles.','Squat rapide + montée sur pointes'],
 climber:['Mountain climbers','Épaules au-dessus des mains, bassin stable ; alterne les genoux vers la poitrine.','Mountain climbers contrôlés'],
 skater:['Patineurs latéraux','Déplace-toi sur le côté, réception amortie sur une jambe ; stabilise le genou avant de repartir.','Pas latéraux rapides et amples'],
 push:['Pompes + toucher d’épaule','Une pompe, puis touche chaque épaule sans tourner le bassin. Expire en repoussant.','Pompes + toucher d’épaule'],
 bridge:['Pont fessier alterné','Allongé, pousse dans les talons, monte les hanches puis alterne un pied décollé ; garde le bassin horizontal.','Pont fessier alterné'],
 knees:['Montées de genoux','Course sur place, buste haut et appuis légers ; cadence vive sans s’écraser au sol.','Marche athlétique très rapide, bras actifs'],
 bear:['Bear crawl avant / arrière','À quatre pattes, genoux décollés, petits pas opposés main/pied ; dos neutre, espace dégagé.','Bear crawl avant / arrière'],
 lunge:['Fentes arrière alternées','Grand pas en arrière, pied avant stable ; remonte fort, sans rebond ni douleur.','Fentes arrière alternées'],
 sprawl:['Sprawl + retour debout','Depuis debout, mains au sol, pieds en planche puis reviens ; pas de cambrure.','Sprawl en reculant un pied à la fois'],
 superman:['Superman avec tirage des coudes','Au sol sur le ventre, décolle légèrement le buste puis ramène les coudes vers les côtes ; nuque neutre, sans creuser le dos.','Superman avec tirage des coudes'],
 jack:['Jumping jacks','Ouvre et ferme bras et jambes en rythme, réception souple ; conserve une respiration régulière.','Step jacks rapides, un pied à la fois']
};
Object.assign(HIIT_MOVES,{
 plank:['Gainage sur les avant-bras','Coudes sous les épaules, abdos et fessiers serrés ; corps aligné, respire sans bloquer.','Gainage sur les avant-bras'],
 sideplank:['Gainage latéral — deux côtés','Coude sous l’épaule, bassin aligné ; change de côté à mi-intervalle, sans laisser tomber les hanches.','Gainage latéral — deux côtés'],
 plankup:['Gainage dynamique haut / bas','Passe des avant-bras aux mains puis redescends ; alterne le bras qui commence, bassin stable.','Gainage dynamique haut / bas'],
 crunch:['Abdos pieds joints au sol','Sur le dos, genoux fléchis, pieds joints posés au sol ; décolle les omoplates en expirant, redescends lentement. Ne tire pas la nuque.','Crunch contrôlé, bras tendus vers les genoux'],
 reversecrunch:['Crunch inversé','Sur le dos, hanches et genoux fléchis ; enroule légèrement le bassin sans élan puis repose-le lentement.','Crunch inversé contrôlé'],
 bicycle:['Abdos bicyclette','Épaules légèrement décollées, alterne une rotation douce du buste vers le genou opposé ; garde le bas du dos stable.','Dead bug alterné, dos au sol'],
 laterallunge:['Fentes latérales alternées','Un grand pas de côté, hanches en arrière ; fléchis une jambe en gardant le pied à plat, puis reviens et alterne.','Fentes latérales alternées'],
 stairs:['Montées sur une marche d’escalier','Sur la première marche stable, sèche et dégagée : monte puis redescends de face, alterne la jambe qui conduit. Pas de sprint en descente ni de sauts ; utilise la rampe si nécessaire.','Marche athlétique rapide au sol, sans escalier']
});
const HIIT_REPS={burpee:[6,10,'cycles complets'],squat:[15,22,'répétitions'],climber:[50,80,'genoux au total ; 1 genou = 1 rep'],skater:[24,36,'appuis au total'],push:[6,10,'cycles : 1 pompe + 2 touches'],bridge:[16,24,'levées de pied au total'],knees:[60,90,'montées au total ; 1 genou = 1 rep'],bear:[20,32,'petits pas main/pied opposés'],lunge:[16,24,'fentes au total, moitié par jambe'],sprawl:[10,16,'cycles complets'],superman:[10,16,'tirages contrôlés'],jack:[30,40,'cycles ouverture + fermeture'],plankup:[8,14,'cycles montée + descente'],crunch:[12,20,'répétitions contrôlées'],reversecrunch:[10,16,'répétitions contrôlées'],bicycle:[20,32,'rotations au total, moitié par côté'],laterallunge:[12,20,'fentes au total, moitié par côté'],stairs:[12,20,'cycles montée + descente, moitié par jambe conductrice']};
function hiitRepHint(key,seconds){if(key==='plank')return seconds+' s de maintien, sans bloquer la respiration';if(key==='sideplank')return seconds+' s au total : moitié du temps par côté';const r=HIIT_REPS[key];return Math.max(1,Math.round(r[0]*seconds/40))+'–'+Math.max(2,Math.round(r[1]*seconds/40))+' '+r[2]+' pendant '+seconds+' s';}

const HIIT_LOW_CUES={burpee:'Recule et ramène les pieds un par un, fais une pompe contrôlée puis relève-toi sans saut ; bassin stable.',squat:'Squat puis extension rapide sur les pointes, sans quitter le sol ; genoux dans l’axe des pieds.',climber:'Depuis la planche, avance un genou à la fois en gardant le bassin stable ; cadence adaptée.',skater:'Grands pas latéraux rapides, sans phase de saut ; freine le déplacement avec un genou stable.',knees:'Marche sur place très rapide avec genoux hauts et bras actifs ; garde toujours un pied au sol.',sprawl:'Mains au sol, recule les pieds un par un en planche, puis reviens debout sans saut.',jack:'Ouvre un pied sur le côté à la fois en levant les bras ; cadence vive, toujours un appui au sol.'};
Object.assign(HIIT_LOW_CUES,{crunch:'Genoux fléchis, pieds joints au sol. Tends les mains vers les genoux en décollant légèrement les omoplates, puis redescends sans élan.',bicycle:'Dead bug : sur le dos, abdos serrés, abaisse lentement bras et jambe opposés sans creuser le bas du dos ; alterne les côtés.',stairs:'Au sol, monte un genou après l’autre, bras actifs, sans saut. Un genou levé compte pour une répétition.'});
const HIIT_SESSIONS=[
 {id:'dense',name:'Full body — Densité',work:40,rest:20,rounds:3,between:60,moves:['burpee','squat','climber','skater','push','bridge'],note:'18 intervalles. Cardio, jambes, poussée, chaîne postérieure et gainage.'},
 {id:'endurance',name:'Full body — Endurance intense',work:45,rest:15,rounds:4,between:60,moves:['knees','push','lunge','climber','superman','sprawl'],note:'24 intervalles. Réserve une cadence que tu peux répéter sur les quatre tours.'},
 {id:'power',name:'Full body — Puissance répétée',work:30,rest:30,rounds:4,between:60,moves:['burpee','skater','bear','squat','push','bridge'],note:'24 intervalles. Efforts plus explosifs, récupération plus longue pour repartir proprement.'},
 {id:'variety',name:'Full body — Cardio & abdos',work:40,rest:20,rounds:3,between:60,moves:['knees','jack','lunge','push','crunch','plank','superman','burpee'],note:'24 intervalles variés, 8 exercices par tour. Les abdos et le gainage complètent les efforts cardio.'},
 {id:'stairs8',name:'Full body — Escalier & gainage',work:40,rest:20,rounds:3,between:60,moves:['stairs','push','laterallunge','climber','bridge','reversecrunch','jack','plankup'],note:'24 intervalles. Escalier facultatif : en variante sans saut, les montées sont remplacées par la marche athlétique au sol. Pas de descente rapide.'},
 {id:'core8',name:'Full body — Tronc & jambes',work:40,rest:20,rounds:3,between:60,moves:['bear','bicycle','lunge','plankup','knees','sideplank','superman','crunch'],note:'24 intervalles. Gainage dynamique, fentes, abdos et cardio ; alterne les côtés sur le gainage latéral.'}
];
function hiitPlan(session,low){
 const phase=(kind,name,seconds,cue,round=0)=>({kind,name,seconds,cue,round});
 const p=[phase('warmup','Mise en route progressive',120,'Marche rapide puis petits pas dynamiques, bras actifs. Monte progressivement en température.'),phase('warmup','Mobilité et amplitude',120,'Cercles de bras, charnières de hanches, squats et fentes arrière lents, sans douleur.'),phase('warmup','Préparation spécifique',120,'Alterner 20 s de squats, 20 s de pas rapides et 20 s de planche ou pompes faciles, deux fois. Pas d’effort maximal.')];
 for(let r=1;r<=session.rounds;r++){
  for(const key of session.moves){const m=HIIT_MOVES[key];p.push(phase('work',low?m[2]:m[0],session.work,(low?(HIIT_LOW_CUES[key]||m[1]):m[1])+' Repère : '+(low&&key==='stairs'?hiitRepHint('knees',session.work):hiitRepHint(key,session.work)),r));p.push(phase('rest','Récupération',session.rest,'Marche doucement, relâche les bras et retrouve une respiration contrôlée.',r));}
  if(r<session.rounds)p.push(phase('roundrest','Récupération entre les tours',session.between,'Une minute supplémentaire : marche lente et relâchement. Repars seulement avec une technique stable.',r));
 }
 p.push(phase('cooldown','Retour au calme',240,'Marche lente, puis mobilité douce ; laisse la respiration redescendre progressivement.'));return p;
}
function hiitPhaseAt(plan,seconds){let start=0;for(let i=0;i<plan.length;i++){const end=start+plan[i].seconds;if(seconds<end)return {index:i,phase:plan[i],remaining:Math.ceil(end-seconds)};start=end;}return {index:plan.length,phase:null,remaining:0};}
function hiitSeconds(plan){return plan.reduce((sum,p)=>sum+p.seconds,0);}
(()=>{
 const root=document.getElementById('view-sport');if(!root)return;
 const key='equilibre-rose-hiit-v1',get=id=>document.getElementById(id);
 let timer=null,lastPhase=-1,wake=null;
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&HIIT_SESSIONS.some(s=>s.id===saved.id)&&Number.isFinite(saved.elapsedMs)&&saved.elapsedMs>=0&&Number.isFinite(saved.anchor)&&typeof saved.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(saved.day)&&typeof saved.token==='string')timer=saved;}catch{}
 function persist(){try{if(timer)localStorage.setItem(key,JSON.stringify(timer));else localStorage.removeItem(key);}catch{toast('Le minuteur ne peut pas être sauvegardé sur cet appareil.');}}
 function chosen(){return HIIT_SESSIONS.find(s=>s.id===(timer?.id||get('hiitChoose').value))||HIIT_SESSIONS[0];}
 function plan(){return hiitPlan(chosen(),timer?timer.low:get('hiitLow').checked);}
 function elapsed(){return timer?Math.max(0,timer.elapsedMs+(timer.running?Date.now()-timer.anchor:0)):0;}
 function clock(seconds){return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;}
 function beep(){if(!get('hiitSound').checked)return;try{const Audio=window.AudioContext||window.webkitAudioContext;const ctx=audio||(audio=new Audio());if(ctx.state==='suspended')ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=780;g.gain.value=.08;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.13);}catch{}}
 let audio=null;
 async function keepAwake(){try{if('wakeLock' in navigator&&document.visibilityState==='visible')wake=await navigator.wakeLock.request('screen');}catch{}}
 function release(){if(wake){wake.release().catch(()=>{});wake=null;}}
 function draw(){const phases=plan(),total=hiitSeconds(phases),seconds=Math.min(total,elapsed()/1000),at=hiitPhaseAt(phases,seconds),done=seconds>=total;
  if(timer?.running&&done){timer.elapsedMs=total*1000;timer.running=false;persist();release();}
  if(at.index!==lastPhase){if(lastPhase>=0&&timer?.running)beep();lastPhase=at.index;}
  get('hiitPhase').textContent=done?'Séance terminée':at.phase.kind==='work'?'EFFORT · Tour '+at.phase.round+'/'+chosen().rounds:at.phase.kind==='rest'||at.phase.kind==='roundrest'?'RÉCUPÉRATION':at.phase.kind==='warmup'?'ÉCHAUFFEMENT':'RETOUR AU CALME';
  get('hiitExercise').textContent=done?'Bien joué. Enregistre ta séance.':at.phase.name;
  get('hiitClock').textContent=clock(at.remaining);get('hiitCue').textContent=done?'Le temps d’effort ne mesure pas les calories. Renseigne celles de ton appareil, ou laisse vide.':at.phase.cue;
  get('hiitProgress').max=total;get('hiitProgress').value=seconds;get('hiitElapsed').textContent=clock(seconds)+' / '+clock(total);
  get('hiitNext').textContent=at.phase&&phases[at.index+1]?'Ensuite : '+phases[at.index+1].name:'';
  get('hiitStart').textContent=timer?.running?'Pause':timer&&timer.elapsedMs>0?'Reprendre':'Démarrer';get('hiitStart').disabled=done;
  get('hiitChoose').disabled=!!timer;get('hiitLow').disabled=!!timer;
  get('hiitLog').disabled=!done||!!timer?.logged;get('hiitLog').textContent=timer?.logged?'✓ Séance enregistrée':'Enregistrer dans mon journal';
  get('hiitDate').textContent=timer?'Journal du '+dateLabel(timer.day,{day:'numeric',month:'long',year:'numeric'}):'La date du début de séance sera utilisée.';
 }
 function preview(){const s=chosen(),phases=plan();get('hiitSummary').textContent=`${hiitSeconds(phases)/60} min au total · ${s.work} s effort / ${s.rest} s récupération · ${s.rounds} tours · ${s.moves.length} exercices · 1 min supplémentaire entre les tours`;
  get('hiitDescription').textContent=s.note;get('hiitMoves').innerHTML=s.moves.map((k,i)=>{const m=HIIT_MOVES[k];return `<li><strong>${i+1}. ${escapeHtml(get('hiitLow').checked?m[2]:m[0])}</strong><p><b>Repère : ${escapeHtml(hiitRepHint(get('hiitLow').checked&&k==='stairs'?'knees':k,s.work))}</b></p><p>${escapeHtml(get('hiitLow').checked?(HIIT_LOW_CUES[k]||m[1]):m[1])}</p><small>Sans saut : ${escapeHtml(m[2])}</small></li>`;}).join('');draw();}
 get('hiitChoose').innerHTML=HIIT_SESSIONS.map(s=>`<option value="${s.id}">${s.name} · ${hiitSeconds(hiitPlan(s,false))/60} min</option>`).join('');
 if(timer){get('hiitChoose').value=timer.id;get('hiitLow').checked=timer.low;}
 get('hiitChoose').addEventListener('change',preview);get('hiitLow').addEventListener('change',preview);
 get('hiitStart').addEventListener('click',()=>{
  if(!timer)timer={id:get('hiitChoose').value,low:get('hiitLow').checked,elapsedMs:0,running:false,anchor:Date.now(),token:uid(),day:ymd(new Date()),logged:false};
  if(timer.running){timer.elapsedMs=elapsed();timer.running=false;release();}else{timer.running=true;timer.anchor=Date.now();beep();keepAwake();}
  persist();draw();
 });
 get('hiitReset').addEventListener('click',()=>{if(timer&&!confirm('Recommencer le minuteur ? Les activités déjà enregistrées resteront dans ton journal.'))return;timer=null;lastPhase=-1;release();persist();get('hiitKcal').value='';preview();});
 get('hiitLog').addEventListener('click',()=>{
  if(!timer||timer.logged||elapsed()<hiitSeconds(plan())*1000)return;
  const kcal=get('hiitKcal').value.trim()===''?0:Number(get('hiitKcal').value);
  if(!Number.isFinite(kcal)||kcal<0||kcal>5000||!Number.isInteger(kcal))return toast('Indique un nombre entier entre 0 et 5 000 kcal, ou laisse vide.');
  if(timer.day<daysBack(364)||timer.day>ymd(new Date()))return toast('La date de cette séance est hors de l’historique.');
  const id='hiit-'+timer.token;
  if(!Object.values(state.activities).some(items=>items.some(a=>a.id===id))){(state.activities[timer.day]??=[]).push({id,kind:chosen().name+(timer.low?' — sans saut':''),minutes:hiitSeconds(plan())/60,burnedKcal:kcal});if(!state.dailyTargets[timer.day])state.dailyTargets[timer.day]=calc().target;save();}
  timer.logged=true;persist();renderAll();draw();toast('Séance enregistrée dans ton journal.');
 });
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){draw();if(timer?.running)keepAwake();}});
 get('hiitLibrary').innerHTML=Object.entries(HIIT_MOVES).map(([k,m])=>`<li><strong>${escapeHtml(m[0])}</strong><p><b>Sur 40 s : ${escapeHtml(hiitRepHint(k,40))}</b></p><p>${escapeHtml(m[1])}</p><small>Variante : ${escapeHtml(m[2])}</small></li>`).join('');
 preview();setInterval(draw,250);
})();

