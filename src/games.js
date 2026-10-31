/* ============ Clinical Games Arcade ============ */
let GT=null, GS=null;
function gStop(){clearInterval(GT);GT=null;}
window.addEventListener("hashchange",gStop);
function gMem(){S.games=S.games||{best:{},plays:0,deck:[]};S.games.best=S.games.best||{};S.games.deck=S.games.deck||[];return S.games;}
function gFinish(id,score,label){const m=gMem();m.plays=(m.plays||0)+1;const nb=!m.best[id]||score>m.best[id];if(nb)m.best[id]=score;save();const xp=Math.max(5,Math.min(60,Math.round(score/15)));addXP(xp,label);return nb;}
function gPick(a,n){return shuffle(a.slice()).slice(0,n);}
function gHead(id,title,sub){const g=GAMES.find(x=>x[0]===id);return `<div class="gtop" data-g="${id}"><a class="btn sm ghost" href="#games">← Arcade</a><div class="gtitle"><span class="gemo">${g?g[2]:"🎮"}</span><div><h1>${title}</h1><p class="note">${sub}</p></div></div><span class="gbest">Best: <b>${gMem().best[id]||0}</b></span></div>`;}
function gEnd(id,title,score,lines,again){const nb=gFinish(id,score,title);return `<div class="gend card"><div class="gend-score"><span class="eyebrow">${nb?"New personal best 🎉":"Final score"}</span><b>${score}</b></div>${lines}<div class="row"><button class="btn pri" data-act="${again}">Play again</button><a class="btn" href="#games">Back to arcade</a></div></div>`;}

const GAMES=[
 ["er","Code Blue: ER Shift","🚑","Emergency simulator","Five patients, one shift. Investigate, diagnose and treat before the stability meter hits zero.","er"],
 ["spot","Clue Ladder","🔎","Spot diagnosis","Clues appear one by one. Name the diagnosis, drug or finding early for more points.","spot"],
 ["deck","Bug vs Drug","🦠","Collectible card battle","Defeat microbes with the drug of choice and build your pathogen card collection.","deck"],
 ["triage","Triage Rush","🏷️","Mass-casualty triage","Casualties keep arriving. Tag each one with START colours before the queue overflows.","triage"],
 ["flow","Hospital 24","🏥","Systems & bed-flow sim","Run a hospital for 24 hours: beds, staff, discharges and surges. Think like the whole system.","flow"],
 ["proto","Protocol Builder","🧩","Sequencing puzzle","Put life-saving and medicolegal protocols in the right order: sepsis, BLS, PPE, dying declaration…","proto"],
 ["bmw","Waste Warrior","♻️","Infection control sprint","Sort hospital waste into the right biomedical waste bin before time runs out.","bmw"]];

function vGames(){const m=gMem();const tot=GAMES.reduce((a,g)=>a+(m.best[g[0]]||0),0);
 return `<section class="ghero"><div><span class="eyebrow">Learn by playing</span><h1>Clinical Games Arcade 🎮</h1><p>Serious games built around real ward, emergency and medicolegal scenarios. Every game teaches as you play and earns XP.</p></div>
  <div class="gstats"><div><b>${m.plays||0}</b><span>games played</span></div><div><b>${(m.deck||[]).length}/${G_DECK.length}</b><span>cards collected</span></div><div><b>${tot}</b><span>total best score</span></div></div></section>
  <div class="ggrid">${GAMES.map(g=>`<a class="gcard" data-g="${g[0]}" href="#g-${g[0]}"><span class="gcard-emo">${g[2]}</span><span class="gtag">${g[3]}</span><b>${g[1]}</b><span class="note">${g[4]}</span><span class="gcard-foot"><span>Best ${m.best[g[0]]||0}</span><span class="btn sm pri">Play →</span></span></a>`).join("")}</div>
  <p class="note">All scenarios are original teaching cases written for this app. Always follow your hospital's current protocols in real practice.</p>`;}

/* ---------- 1. Code Blue: ER Shift ---------- */
function vER(){POST=()=>erStart();return gHead("er","Code Blue: ER Shift","Every second costs stability. Investigations cost more. Wrong calls cost the most.")+`<div id="gm"></div>`;}
function erStart(){GS={cases:gPick(G_ER,5),i:0,score:0,log:[]};erCase();}
function erCase(){gStop();const c=GS.cases[GS.i];GS.c=c;GS.stab=100;GS.phase="dx";GS.rev=[];GS.wrong=0;GS.dx=shuffle(c.dx.slice());GS.mx=shuffle(c.mx.slice());erRender();
 GT=setInterval(()=>{GS.stab-=1;if(GS.stab<=0){GS.stab=0;erOver(false);}else erMeter();},1000);}
function erMeter(){const m=$("#ermeter");if(!m)return;m.style.width=GS.stab+"%";m.className=GS.stab>60?"ok":GS.stab>30?"warn":"bad";$("#erstab").textContent=GS.stab;}
function erRender(){const c=GS.c;$("#gm").innerHTML=`<div class="er">
 <div class="er-mon card"><div class="row between"><span class="eyebrow">Patient ${GS.i+1} of ${GS.cases.length} · Score ${GS.score}</span><span class="er-beat" aria-hidden="true">♥</span></div>
  <h2>${esc(c.who)}</h2><p>${esc(c.c)}</p>
  <div class="er-vitals">${c.v.map(v=>`<div><span>${v[0]}</span><b>${esc(String(v[1]))}</b></div>`).join("")}</div>
  <p class="note"><b>Examination:</b> ${esc(c.e)}</p>
  <div class="er-stab"><span>Stability <b id="erstab">${GS.stab}</b></span><div class="bar"><i id="ermeter" style="width:${GS.stab}%"></i></div></div></div>
 <div class="er-side"><div class="card stack"><h3>Order investigations <span class="note">(−6 stability each)</span></h3><div class="er-inv">${c.inv.map((x,k)=>GS.rev.includes(k)?`<div class="er-res ${x[2]?"use":"waste"}"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`:`<button class="btn" data-act="er-inv" data-k="${k}">${esc(x[0])}</button>`).join("")}</div></div>
 <div class="card stack"><h3>${GS.phase==="dx"?"Your diagnosis?":"First management step?"}</h3><div class="stack" style="gap:8px">${(GS.phase==="dx"?GS.dx:GS.mx).map(o=>`<button class="opt" data-act="er-pick" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>${GS.phase==="mx"?`<p class="note good">✓ Diagnosis: ${esc(c.dx[0])}</p>`:""}</div></div></div>`;erMeter();}
Object.assign(ACT,{
 "er-inv":el=>{const k=+el.dataset.k;if(GS.rev.includes(k))return;GS.rev.push(k);GS.stab=Math.max(1,GS.stab-6);erRender();},
 "er-pick":el=>{const v=el.dataset.v,c=GS.c;const ok=GS.phase==="dx"?v===c.dx[0]:v===c.mx[0];
  if(!ok){GS.wrong++;GS.stab=Math.max(0,GS.stab-(GS.phase==="dx"?15:12));el.classList.add("no");el.disabled=true;toast("Not quite — the patient deteriorates");if(GS.stab<=0)erOver(false);else erMeter();return;}
  if(GS.phase==="dx"){GS.phase="mx";erRender();}else erOver(true);},
 "er-next":()=>{GS.i++;if(GS.i<GS.cases.length)erCase();else{gStop();const saved=GS.log.filter(x=>x.ok).length;$("#gm").innerHTML=gEnd("er","ER Shift",GS.score,`<p>You stabilised <b>${saved}</b> of ${GS.cases.length} patients.</p><div class="glog">${GS.log.map(x=>`<div class="${x.ok?"good":"bad"}">${x.ok?"✓":"✕"} ${esc(x.d)} — ${x.pts} pts</div>`).join("")}</div>`,"er-again");}},
 "er-again":()=>erStart()});
function erOver(ok){gStop();const c=GS.c;const pts=ok?GS.stab+(GS.wrong?0:20):0;GS.score+=pts;GS.log.push({d:c.dx[0],ok,pts});
 $("#gm").innerHTML=`<div class="card er-out ${ok?"win":"lose"}"><span class="gbig">${ok?"✅ Patient stabilised":"💔 Patient crashed"}</span><p><b>${esc(c.dx[0])}</b> — ${esc(c.mx[0])}</p><p class="er-teach">💡 ${esc(c.t)}</p><p class="note">+${pts} points ${ok&&!GS.wrong?"(includes +20 flawless bonus)":""}</p><button class="btn pri" data-act="er-next">${GS.i+1<GS.cases.length?"Next patient →":"End shift"}</button></div>`;}

/* ---------- 2. Clue Ladder ---------- */
function vSpot(){POST=()=>spStart();return gHead("spot","Clue Ladder","5 points if you get it on clue 1, down to 1 point on clue 5.")+`<div id="gm"></div>`;}
function spStart(){GS={q:gPick(G_SPOT,8),i:0,score:0,right:0};spRound();}
function spRound(){const q=GS.q[GS.i];GS.ci=1;GS.opts=shuffle([q.a,...q.d]);GS.done=false;spRender();}
function spRender(){const q=GS.q[GS.i];$("#gm").innerHTML=`<div class="card sp" data-s="${q.s}"><div class="row between"><span class="eyebrow">Case ${GS.i+1} of ${GS.q.length} · Score ${GS.score}</span><span class="sp-pts">Worth <b>${GS.done?0:6-GS.ci}</b> pts</span></div>
 <ol class="sp-clues">${q.c.map((x,k)=>`<li class="${k<GS.ci||GS.done?"on":""}">${k<GS.ci||GS.done?esc(x):"🔒 Hidden clue"}</li>`).join("")}</ol>
 ${GS.done?"":`<div class="row"><button class="btn" data-act="sp-clue" ${GS.ci>=5?"disabled":""}>Reveal next clue</button></div>`}
 <div class="sp-opts">${GS.opts.map(o=>`<button class="opt ${GS.done&&o===q.a?"yes":""}" data-act="sp-pick" data-v="${esc(o)}" ${GS.done?"disabled":""}>${esc(o)}</button>`).join("")}</div>
 ${GS.done?`<div class="row"><button class="btn pri" data-act="sp-next">${GS.i+1<GS.q.length?"Next case →":"See results"}</button></div>`:""}</div>`;}
Object.assign(ACT,{
 "sp-clue":()=>{if(GS.ci<5){GS.ci++;spRender();}},
 "sp-pick":el=>{const q=GS.q[GS.i];if(GS.done)return;const ok=el.dataset.v===q.a;if(ok){GS.score+=6-GS.ci;GS.right++;toast(`Correct! +${6-GS.ci}`);}else toast(`It was ${q.a}`);GS.done=true;spRender();if(!ok){const b=[...$$(".sp-opts .opt")].find(x=>x.dataset.v===el.dataset.v);b&&b.classList.add("no");}},
 "sp-next":()=>{GS.i++;if(GS.i<GS.q.length)spRound();else $("#gm").innerHTML=gEnd("spot","Clue Ladder",GS.score*5,`<p>You solved <b>${GS.right}</b> of ${GS.q.length} cases (${GS.score} ladder points × 5).</p>`,"sp-again");},
 "sp-again":()=>spStart()});

/* ---------- 3. Bug vs Drug ---------- */
function vDeck(){POST=()=>dkStart();return gHead("deck","Bug vs Drug","Pick the drug of choice to capture each microbe. Three lives. Hints cost the shiny bonus.")+`<div class="row" style="margin-bottom:10px"><button class="btn sm" data-act="dk-coll">📚 My collection</button><button class="btn sm" data-act="dk-again">🔄 New battle</button></div><div id="gm"></div>`;}
function dkStart(){const own=gMem().deck;const fresh=G_DECK.filter(b=>!own.includes(b.id));GS={q:shuffle(fresh).concat(shuffle(G_DECK.filter(b=>own.includes(b.id)))).slice(0,10),i:0,lives:3,score:0,streak:0,caught:0};dkRound();}
function dkRound(){const b=GS.q[GS.i];const others=shuffle([...new Set(G_DECK.filter(x=>x.x!==b.x).map(x=>x.x))]).slice(0,3);GS.hand=shuffle([b.x,...others]);GS.hint=false;GS.done=false;dkRender();}
function dkCard(b,own){return `<div class="bug r${b.r} ${own?"":"locked"}"><span class="bug-k">${esc(b.k)}</span><b>${own?esc(b.n):"???"}</b><span class="bug-d">${own?esc(b.d):"Not captured yet"}</span>${own?`<span class="bug-x">💊 ${esc(b.x)}</span>`:""}<span class="bug-r">${"★".repeat(b.r)}</span></div>`;}
function dkRender(){const b=GS.q[GS.i];$("#gm").innerHTML=`<div class="dk"><div class="row between"><span class="eyebrow">Battle ${GS.i+1}/${GS.q.length} · Score ${GS.score} · Streak ×${GS.streak}</span><span class="dk-lives">${"❤️".repeat(GS.lives)}${"🤍".repeat(3-GS.lives)}</span></div>
 <div class="dk-arena"><div class="bug big r${b.r}"><span class="bug-k">${esc(b.k)}</span><b>${esc(b.n)}</b><span class="bug-d">Causes: ${esc(b.d)}</span><span class="bug-r">${"★".repeat(b.r)} ${["","Common","Tricky","Boss"][b.r]}</span></div>
 <div class="stack"><span class="eyebrow">Your hand — play the drug of choice</span><div class="dk-hand">${GS.hand.map(h=>`<button class="pill-card" data-act="dk-play" data-v="${esc(h)}" ${GS.done?"disabled":""}>💊 ${esc(h)}</button>`).join("")}</div>
 ${GS.hint||GS.done?`<p class="dk-tip">🧑‍⚕️ Dr. Atlas: ${esc(b.tip)}</p>`:`<button class="btn sm ghost" data-act="dk-hint">🧑‍⚕️ Ask Dr. Atlas for a hint</button>`}
 ${GS.done?`<button class="btn pri" data-act="dk-next">${GS.lives>0&&GS.i+1<GS.q.length?"Next microbe →":"Finish battle"}</button>`:""}</div></div></div>`;}
Object.assign(ACT,{
 "dk-hint":()=>{GS.hint=true;dkRender();},
 "dk-play":el=>{const b=GS.q[GS.i];if(GS.done)return;GS.done=true;const ok=el.dataset.v===b.x;
  if(ok){GS.streak++;const pts=(10*b.r+(GS.hint?0:5))*Math.min(3,GS.streak);GS.score+=pts;GS.caught++;const m=gMem();if(!m.deck.includes(b.id)){m.deck.push(b.id);save();toast(`Captured ${b.n}! New card +${pts}`);}else toast(`Defeated! +${pts}`);}
  else{GS.lives--;GS.streak=0;toast(`Resisted! Drug of choice: ${b.x}`);}
  dkRender();$$(".pill-card").forEach(x=>{if(x.dataset.v===b.x)x.classList.add("yes");else if(x.dataset.v===el.dataset.v)x.classList.add("no");});},
 "dk-next":()=>{GS.i++;if(GS.lives>0&&GS.i<GS.q.length)dkRound();else $("#gm").innerHTML=gEnd("deck","Bug vs Drug",GS.score,`<p>You defeated <b>${GS.caught}</b> microbes. Collection: ${gMem().deck.length}/${G_DECK.length} cards.</p>`,"dk-again");},
 "dk-again":()=>{gStop();dkStart();},
 "dk-coll":()=>{const own=gMem().deck;$("#gm").innerHTML=`<div class="stack"><div class="row between"><h2>Collection ${own.length}/${G_DECK.length}</h2><button class="btn sm pri" data-act="dk-again">Battle →</button></div><div class="dk-coll">${G_DECK.map(b=>dkCard(b,own.includes(b.id))).join("")}</div></div>`;}});

/* ---------- 4. Triage Rush ---------- */
const TAGS=[["red","Immediate","🔴"],["yellow","Delayed","🟡"],["green","Minor","🟢"],["black","Expectant","⚫"]];
function vTriage(){POST=()=>trIntro();return gHead("triage","Triage Rush","START triage: Walk? → Breathing? → RR > 30? → Radial pulse / CRT > 2 s? → Obeys commands?")+`<div id="gm"></div>`;}
function trIntro(){$("#gm").innerHTML=`<div class="card stack tr-intro"><h2>Mass casualty incident 🚨</h2><p>A bus has overturned. Casualties arrive every few seconds. Tag the patient at the front of the queue. More than 6 waiting means patients deteriorate.</p>
 <div class="tr-algo"><span>🚶 Walks → <b class="tg green">Minor</b></span><span>❌ No breathing after airway opened → <b class="tg black">Expectant</b></span><span>RR > 30, no radial pulse / CRT > 2 s, or cannot obey commands → <b class="tg red">Immediate</b></span><span>Otherwise → <b class="tg yellow">Delayed</b></span></div>
 <button class="btn pri" data-act="tr-go">Start 75-second shift</button></div>`;}
function trStart(){gStop();GS={pool:shuffle(G_TRIAGE.slice()),q:[],t:75,score:0,right:0,seen:0,miss:[]};trSpawn();trSpawn();trRender();
 GT=setInterval(()=>{GS.t--;let ch=false;if(GS.t%4===0){const was=GS.q.length;trSpawn();ch=!was;}if(GS.q.length>6){GS.score-=5;GS.q.shift();ch=true;toast("A waiting patient deteriorated −5");}if(GS.t<=0)return trEnd();ch?trRender():trHud();},1000);}
function trHud(){const h=$(".tr-hud");if(!h)return trRender();h.innerHTML=`<span>⏱ <b>${GS.t}s</b></span><span>Score <b>${GS.score}</b></span><span>Queue <b class="${GS.q.length>4?"bad":""}">${GS.q.length}</b>/6</span>`;const q=$(".tr-q");q&&(q.innerHTML=GS.q.map((x,k)=>`<span class="tr-dot ${k===0?"on":""}">🧍</span>`).join(""));}
function trSpawn(){if(!GS.pool.length)GS.pool=shuffle(G_TRIAGE.slice());GS.q.push(GS.pool.pop());}
function trRender(){const p=GS.q[0];$("#gm").innerHTML=`<div class="tr"><div class="tr-hud"><span>⏱ <b>${GS.t}s</b></span><span>Score <b>${GS.score}</b></span><span>Queue <b class="${GS.q.length>4?"bad":""}">${GS.q.length}</b>/6</span></div>
 <div class="tr-q">${GS.q.map((x,k)=>`<span class="tr-dot ${k===0?"on":""}">🧍</span>`).join("")}</div>
 ${p?`<div class="card tr-p"><span class="eyebrow">Casualty #${GS.seen+1}</span><p>${esc(p[0])}</p></div><div class="tr-tags">${TAGS.map(t=>`<button class="tagbtn ${t[0]}" data-act="tr-tag" data-v="${t[0]}">${t[2]} ${t[1]}</button>`).join("")}</div>`:`<div class="card"><p>Queue clear — next casualty arriving…</p></div>`}</div>`;}
function trEnd(){gStop();const acc=GS.seen?Math.round(GS.right/GS.seen*100):0;$("#gm").innerHTML=gEnd("triage","Triage Rush",Math.max(0,GS.score),`<p>Tagged <b>${GS.seen}</b> casualties · accuracy <b>${acc}%</b>.</p>${GS.miss.length?`<div class="glog">${GS.miss.slice(0,6).map(m=>`<div class="bad">✕ ${esc(m[0])}<br><span class="note">${esc(m[2])}</span></div>`).join("")}</div>`:""}`,"tr-go");}
Object.assign(ACT,{
 "tr-go":()=>trStart(),
 "tr-tag":el=>{const p=GS.q.shift();if(!p)return;GS.seen++;if(el.dataset.v===p[1]){GS.right++;GS.score+=10;toast("✓ "+p[2]);}else{GS.score-=5;GS.miss.push(p);toast("✕ "+p[2]);}if(!GS.q.length)trSpawn();trRender();}});

/* ---------- 5. Hospital 24 ---------- */
const FL_BLOCK=["00–03","03–06","06–09","09–12","12–15","15–18","18–21","21–24"];
const FL_BASE=[3,2,4,7,8,8,6,5];
const FL_EVENTS=[["🚌 Road traffic accident: 4 extra casualties, one needs ICU",{arr:4,icu:1}],["🤧 Flu cluster from a hostel: 3 extra patients",{arr:3}],["🤒 Two nurses call in sick",{staff:-2}],["📋 Consultant ward round finished early: 4 patients ready for discharge",{ready:4}],["🧪 Lab analyser down — ED throughput reduced",{thru:-2}],["😌 Quiet spell — fewer arrivals",{arr:-2}],["⚠️ A ward patient deteriorates and needs ICU",{icu:1}],["",{}],["",{}]];
const FL_ACTS=[["dis","🏠 Discharge round","Send home everyone ready for discharge (staff −1)"],["hud","🤝 Bed huddle","ED & ward coordinate: all admitted patients move to free beds"],["sur","🛏️ Open surge beds","+4 ward beds for the rest of the day (budget −2)"],["nur","👩‍⚕️ Call an extra nurse","Staff +3 (budget −2)"],["rst","☕ Staff rest break","Staff +2 but ED throughput −2 this block"],["div","🚑 Divert ambulances","Arrivals halved this block (safety −6: patients go elsewhere)"],["stp","⬇️ ICU step-down","Move up to 2 stable ICU patients to the ward"]];
function vHosp(){POST=()=>flStart();return gHead("flow","Hospital 24","Each turn is 3 hours. Choose up to 2 actions, then run the clock. Keep the hospital safe, flowing and within budget.")+`<div id="gm"></div>`;}
function flStart(){GS={b:0,ed:4,edCap:12,board:1,ward:26,wardCap:30,icu:5,icuCap:6,ready:3,budget:8,staff:8,safety:100,served:0,sel:[],ev:null,log:[]};flNextEvent();flRender();}
function flNextEvent(){GS.ev=FL_EVENTS[Math.floor(Math.random()*FL_EVENTS.length)];}
function gauge(l,v,max,warn){const p=Math.max(0,Math.min(100,v/max*100));return `<div class="fl-g ${warn?"warn":""}"><span>${l}</span><b>${v}${max?`<small>/${max}</small>`:""}</b><div class="bar"><i style="width:${p}%"></i></div></div>`;}
function flRender(){const s=GS;$("#gm").innerHTML=`<div class="fl"><div class="card fl-dash"><div class="row between"><span class="eyebrow">Block ${s.b+1}/8 · ${FL_BLOCK[s.b]} h</span><span class="note">Patients placed or sent home: <b>${s.served}</b></span></div>
 <div class="fl-gs">${gauge("ED waiting",s.ed,s.edCap,s.ed>s.edCap)}${gauge("Boarding in ED",s.board,10,s.board>3)}${gauge("Ward beds",s.ward,s.wardCap,s.ward>=s.wardCap)}${gauge("ICU beds",s.icu,s.icuCap,s.icu>=s.icuCap)}${gauge("Ready to go home",s.ready,15,false)}${gauge("Staff energy",s.staff,12,s.staff<=4)}${gauge("Budget",s.budget,10,s.budget<=2)}${gauge("Safety",s.safety,100,s.safety<70)}</div></div>
 <div class="card stack"><h3>${s.ev[0]?s.ev[0]:"🕊️ No special event this block"}</h3><p class="note">Choose up to 2 actions (${s.sel.length}/2):</p><div class="fl-acts">${FL_ACTS.map(a=>`<button class="fl-act ${s.sel.includes(a[0])?"on":""}" data-act="fl-sel" data-v="${a[0]}"><b>${a[1]}</b><span>${a[2]}</span></button>`).join("")}</div>
 <button class="btn pri" data-act="fl-run">▶ Run ${FL_BLOCK[s.b]} h</button></div>
 ${s.log.length?`<div class="card glog">${s.log.slice(-4).reverse().map(l=>`<div>${l}</div>`).join("")}</div>`:""}</div>`;}
function flRun(){const s=GS,e=s.ev[1],a=s.sel;let arr=FL_BASE[s.b]+(e.arr||0),thruAdj=e.thru||0,icuNeed=e.icu||0;s.staff+=e.staff||0;s.ready+=e.ready||0;let msg=[];
 if(a.includes("dis")){s.ward-=s.ready;s.served+=s.ready;msg.push(`${s.ready} discharged`);s.ready=0;s.staff-=1;}
 if(a.includes("sur")){s.wardCap+=4;s.budget-=2;}
 if(a.includes("nur")){s.staff=Math.min(12,s.staff+3);s.budget-=2;}
 if(a.includes("rst")){s.staff=Math.min(12,s.staff+2);thruAdj-=2;}
 if(a.includes("div")){arr=Math.ceil(arr/2);s.safety-=6;}
 if(a.includes("stp")){const m=Math.min(2,s.icu,s.wardCap-s.ward);s.icu-=m;s.ward+=m;}
 arr=Math.max(0,arr);s.ed+=arr;
 const T=Math.max(0,Math.min(s.ed,2+s.staff+thruAdj));const icuN=Math.round(T*0.1)+icuNeed,adm=Math.round(T*0.35),home=Math.max(0,T-icuN-adm);s.served+=home;s.ed-=T;
 const icuFit=Math.min(icuN,s.icuCap-s.icu);s.icu+=icuFit;if(icuN>icuFit){s.safety-=8*(icuN-icuFit);s.board+=icuN-icuFit;msg.push("ICU full!");}s.board+=adm;
 const free=Math.max(0,s.wardCap-s.ward);const mv=a.includes("hud")?Math.min(s.board,free):Math.min(s.board,Math.floor(free/2));s.ward+=mv;s.board-=mv;s.served+=mv;
 s.ready+=Math.round(s.ward*0.12);if(!a.includes("dis")){const nat=Math.round(s.ready*0.3);s.ward-=nat;s.ready-=nat;s.served+=nat;}
 if(s.icu>0&&s.ward<s.wardCap){s.icu--;s.ward++;}
 if(s.ed>s.edCap)s.safety-=(s.ed-s.edCap)*2;s.safety-=s.board;s.staff=Math.max(1,s.staff-1);if(s.staff<=3)s.safety-=4;
 s.safety=Math.max(0,Math.min(100,s.safety));s.budget=Math.max(-5,s.budget);
 s.log.push(`<b>${FL_BLOCK[s.b]} h:</b> ${arr} arrivals, ${T} seen in ED, ${mv} moved to ward${msg.length?" · "+msg.join(" · "):""}${s.board>3?" · ⚠️ boarders crowding ED":""}`);
 s.b++;s.sel=[];if(s.b>=8||s.safety<=0)return flEnd();flNextEvent();flRender();}
function flEnd(){const s=GS;const score=Math.max(0,s.served*5+s.safety*2+s.budget*10);const tips=[];if(s.board>3)tips.push("Boarding admitted patients in ED was your bottleneck — bed huddles and early discharges free beds upstream.");if(s.staff<=4)tips.push("Exhausted staff slow everything down — rest breaks and extra staff protect safety.");if(s.budget<0)tips.push("You overspent — surge capacity is expensive; fix flow before adding beds.");if(!tips.length)tips.push("Great systems thinking — you balanced flow, staff and budget across the whole hospital.");
 $("#gm").innerHTML=gEnd("flow","Hospital 24",score,`<p>Patients served <b>${s.served}</b> · safety <b>${s.safety}</b> · budget <b>${s.budget}</b>${s.safety<=0?" · the hospital was declared unsafe":""}.</p>${tips.map(t=>`<p class="er-teach">💡 ${t}</p>`).join("")}`,"fl-again");}
Object.assign(ACT,{
 "fl-sel":el=>{const v=el.dataset.v;const i=GS.sel.indexOf(v);if(i>=0)GS.sel.splice(i,1);else if(GS.sel.length<2)GS.sel.push(v);else toast("Only 2 actions per block");flRender();},
 "fl-run":()=>flRun(),"fl-again":()=>flStart()});

/* ---------- 6. Protocol Builder ---------- */
function vProto(){POST=()=>prStart();return gHead("proto","Protocol Builder","Tap the steps in the correct order. Three protocols per round.")+`<div id="gm"></div>`;}
function prStart(){GS={list:gPick(G_PROTO,3),i:0,score:0,stars:0};prRound();}
function prRound(){const p=GS.list[GS.i];GS.p=p;GS.done=[];GS.miss=0;GS.opts=shuffle(p.s.slice());prRender();}
function prRender(){const p=GS.p,fin=GS.done.length===p.s.length;$("#gm").innerHTML=`<div class="card pr"><div class="row between"><span class="eyebrow">Protocol ${GS.i+1} of ${GS.list.length} · Score ${GS.score}</span><span class="note">Mistakes: ${GS.miss}</span></div><h2>${esc(p.n)}</h2>
 <ol class="pr-seq">${p.s.map((x,k)=>`<li class="${k<GS.done.length?"on":""}">${k<GS.done.length?esc(x):"…"}</li>`).join("")}</ol>
 ${fin?`<div class="pr-win"><b>${"⭐".repeat(GS.miss===0?3:GS.miss<=2?2:1)}</b><p class="er-teach">💡 ${esc(p.w)}</p><button class="btn pri" data-act="pr-next">${GS.i+1<GS.list.length?"Next protocol →":"See results"}</button></div>`:`<div class="pr-opts">${GS.opts.filter(o=>!GS.done.includes(o)).map(o=>`<button class="opt" data-act="pr-step" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>`}</div>`;}
Object.assign(ACT,{
 "pr-step":el=>{const want=GS.p.s[GS.done.length];if(el.dataset.v===want){GS.done.push(want);if(GS.done.length===GS.p.s.length){const st=GS.miss===0?3:GS.miss<=2?2:1;GS.stars+=st;GS.score+=st*40;}prRender();}else{GS.miss++;el.classList.add("shake","no");setTimeout(()=>el.classList.remove("shake","no"),500);const m=$(".pr .note");m&&(m.textContent="Mistakes: "+GS.miss);}},
 "pr-next":()=>{GS.i++;if(GS.i<GS.list.length)prRound();else $("#gm").innerHTML=gEnd("proto","Protocol Builder",GS.score,`<p>You earned <b>${GS.stars}</b> of ${GS.list.length*3} stars.</p>`,"pr-again");},
 "pr-again":()=>prStart()});

/* ---------- 7. Waste Warrior ---------- */
function vBMW(){POST=()=>bwIntro();return gHead("bmw","Waste Warrior","Bio-Medical Waste Management Rules, 2016 (amended). Keys 1–5 work too.")+`<div id="gm"></div>`;}
function bwIntro(){$("#gm").innerHTML=`<div class="card stack"><h2>Segregate at source ♻️</h2><div class="bw-bins static">${G_BINS.map((b,i)=>`<div class="bin ${b[0]}"><span>${b[2]}</span><b>${b[1]}</b><small>${b[3]}</small></div>`).join("")}</div><button class="btn pri" data-act="bw-go">Start 45-second round</button></div>`;}
function bwStart(){gStop();GS={pool:shuffle(G_BMW.slice()),t:45,score:0,combo:0,right:0,seen:0,miss:[]};GS.cur=GS.pool.pop();bwRender();GT=setInterval(()=>{GS.t--;if(GS.t<=0)return bwEnd();const h=$("#bwt");h&&(h.textContent=GS.t+"s");},1000);}
function bwRender(){$("#gm").innerHTML=`<div class="bw"><div class="tr-hud"><span>⏱ <b id="bwt">${GS.t}s</b></span><span>Score <b>${GS.score}</b></span><span>Combo <b>×${1+Math.floor(GS.combo/3)}</b></span></div>
 <div class="card bw-item"><span class="eyebrow">Which bin?</span><b>${esc(GS.cur[0])}</b></div>
 <div class="bw-bins">${G_BINS.map((b,i)=>`<button class="bin ${b[0]}" data-act="bw-put" data-v="${b[0]}"><span>${b[2]}</span><b>${i+1}. ${b[1]}</b><small>${b[3]}</small></button>`).join("")}</div></div>`;}
function bwEnd(){gStop();$("#gm").innerHTML=gEnd("bmw","Waste Warrior",Math.max(0,GS.score),`<p>Sorted <b>${GS.seen}</b> items · <b>${GS.right}</b> correct.</p>${GS.miss.length?`<div class="glog">${GS.miss.slice(0,6).map(m=>`<div class="bad">✕ ${esc(m[0])} — ${esc(m[2])}</div>`).join("")}</div>`:""}`,"bw-go");}
Object.assign(ACT,{
 "bw-go":()=>bwStart(),
 "bw-put":el=>{if(!GS||!GS.cur||GS.t<=0)return;const it=GS.cur;GS.seen++;if(el.dataset.v===it[1]){GS.combo++;GS.right++;GS.score+=10*(1+Math.floor(GS.combo/3));toast("✓ "+it[2]);}else{GS.combo=0;GS.score-=5;GS.miss.push(it);toast("✕ "+it[2]);}if(!GS.pool.length)GS.pool=shuffle(G_BMW.slice());GS.cur=GS.pool.pop();bwRender();}});
document.addEventListener("keydown",e=>{if(location.hash==="#g-bmw"&&GT&&/^[1-5]$/.test(e.key)){const b=$$(".bw-bins .bin")[+e.key-1];b&&b.click();}});

Object.assign(ROUTES,{games:vGames,"g-er":vER,"g-spot":vSpot,"g-deck":vDeck,"g-triage":vTriage,"g-flow":vHosp,"g-proto":vProto,"g-bmw":vBMW});
