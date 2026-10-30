/* ============ Practice engine: levelled flashcards with spaced repetition, adaptive quiz ladder, mistakes bank ============ */
const LV=["","Basic","Intermediate","Advanced","Exam-pattern"];
const LV_CLS=["","lv1","lv2","lv3","lv4"];
const SRS_DAYS=[0,1,3,7,14,30];
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return dstr(d);};
function ensureP(){S.srs=S.srs||{};S.mist=S.mist||{};S.qa=S.qa||{};}
function cardPool(id){const c=CH[id];const out=[];
  (QB[id]?QB[id].c:[]).forEach((x,i)=>out.push({key:`${id}:c${i}`,lv:x[0],q:x[1],a:x[2],src:"bank"}));
  c.hy.forEach((x,i)=>{const h=hy(x);out.push({key:`${id}:h${i}`,lv:2,q:h.q,a:h.a,src:"core"});});
  (S.custom[id]||[]).forEach((x,i)=>{const h=hy(x);out.push({key:`${id}:x${i}`,lv:2,q:h.q,a:h.a,src:"ai"});});
  return out;}
function quizPool(id){const out=[];
  (QB[id]?QB[id].q:[]).forEach((x,i)=>out.push({key:`${id}:q${i}`,lv:x[0],q:x[1],o:x[2],a:x[3],e:x[4],ch:id}));
  CH[id].mcq.forEach((m,i)=>out.push({key:`${id}:m${i}`,lv:2,q:m[0],o:m[1],a:m[2],e:m[3],ch:id}));
  return out;}
const lvChip=l=>`<span class="lvchip ${LV_CLS[l]}">${LV[l]}</span>`;

/* ---------- Flashcards tab ---------- */
let FC={id:null,mode:"due",lv:0,queue:[],i:0,pool:[]};
function srsStats(pool){ensureP();const t=today();let nw=0,due=0,learn=0,mast=0;pool.forEach(c=>{const s=S.srs[c.key];if(!s)nw++;else{if(s.due<=t)due++;if(s.b>=4)mast++;else learn++;}});return {nw,due,learn,mast,total:pool.length};}
function cardsTabHTML(id){const pool=cardPool(id);const st=srsStats(pool);const banked=!!QB[id];
  return `<section class="card stack"><div class="row between"><div><h2>Flashcards</h2><p class="note">${banked?`${QB[id].c.length} levelled cards + ${pool.length-QB[id].c.length} core/AI cards.`:`${pool.length} core cards. The 100-card levelled bank for this chapter is being written.`} Spaced repetition brings back the cards you find hard.</p></div><button class="btn sm" data-act="more-cards">+ Generate with AI</button></div>
  <div class="srsbar"><div><b>${st.nw}</b><span>New</span></div><div><b>${st.due}</b><span>Due today</span></div><div><b>${st.learn}</b><span>Learning</span></div><div><b>${st.mast}</b><span>Mastered</span></div></div>
  <div class="bar" aria-label="Mastered"><i style="width:${Math.round(st.mast/Math.max(1,st.total)*100)}%;background:var(--good)"></i></div>
  <div class="row" role="group" aria-label="Deck"><span class="note">Deck</span>${[["due","Due + new"],["all","Browse all"],["weak","Weak cards"]].map(m=>`<button class="btn sm ${FC.mode===m[0]?"pri":""}" data-act="fc-mode" data-m="${m[0]}">${m[1]}</button>`).join("")}</div>
  <div class="row" role="group" aria-label="Level"><span class="note">Level</span><button class="btn sm ${!FC.lv?"pri":""}" data-act="fc-lv" data-l="0">All</button>${[1,2,3,4].map(l=>`<button class="btn sm ${FC.lv===l?"pri":""}" data-act="fc-lv" data-l="${l}">${LV[l]} (${pool.filter(c=>c.lv===l).length})</button>`).join("")}</div>
  <div id="deck"></div><div class="ai-out" id="cardai"></div></section>`;}
function buildQueue(id){ensureP();const t=today();let pool=cardPool(id);if(FC.lv)pool=pool.filter(c=>c.lv===FC.lv);
  if(FC.mode==="due"){const due=pool.filter(c=>S.srs[c.key]&&S.srs[c.key].due<=t);const nw=pool.filter(c=>!S.srs[c.key]).sort((a,b)=>a.lv-b.lv).slice(0,20);pool=[...due,...nw];}
  else if(FC.mode==="weak")pool=pool.filter(c=>S.srs[c.key]&&S.srs[c.key].b<=1);
  else pool=pool.slice().sort((a,b)=>a.lv-b.lv);
  FC.pool=pool;FC.queue=FC.mode==="all"?pool.map((_,i)=>i):shuffle(pool.map((_,i)=>i));FC.i=0;}
function drawDeck(){const box=$("#deck");if(!box)return;
  if(!FC.queue.length||FC.i>=FC.queue.length){box.innerHTML=`<div class="card stack" style="align-items:center;text-align:center"><h3>${FC.queue.length?"Session complete 🎉":"Nothing to review here"}</h3><p class="note">${FC.mode==="due"?"All due cards are done for today. Come back tomorrow, or browse all cards.":FC.mode==="weak"?"No weak cards — great work.":"Pick another level."}</p><div class="row"><button class="btn" data-act="fc-mode" data-m="all">Browse all</button><button class="btn" data-act="fc-mode" data-m="due">Due + new</button></div></div>`;return;}
  const c=FC.pool[FC.queue[FC.i]];const s=(S.srs||{})[c.key];
  box.innerHTML=`<div class="deck"><div class="row between" style="width:100%;max-width:620px"><span class="note">Card ${FC.i+1} of ${FC.queue.length}</span><span class="row" style="gap:6px">${lvChip(c.lv)}${c.src!=="bank"?`<span class="chip">${c.src==="ai"?"AI card":"Core card"}</span>`:""}${s?`<span class="chip">Box ${s.b}</span>`:'<span class="chip">New</span>'}</span></div>
  <button class="fcard" id="fc" aria-label="Flashcard, press to flip"><div class="in"><div class="face front"><span class="eyebrow">Question</span>${esc(c.q)}<span class="note">Tap or press Space to reveal</span></div><div class="face back"><span class="eyebrow">Answer</span>${esc(c.a)}</div></div></button>
  <div class="row rate" style="justify-content:center"><button class="btn" id="fcprev" data-act="fc-step" data-d="-1">←</button><button class="btn r1" id="r1" data-act="fc-rate" data-r="1">Again <small>1</small></button><button class="btn r2" id="r2" data-act="fc-rate" data-r="2">Hard <small>2</small></button><button class="btn r3 pri" id="fcgot" data-act="fc-rate" data-r="3">Good <small>3</small></button><button class="btn r4" id="r4" data-act="fc-rate" data-r="4">Easy <small>4</small></button><button class="btn" id="fcnext" data-act="fc-step" data-d="1">→</button></div>
  <p class="note kbd-hint">Keys: Space flip · 1 Again · 2 Hard · 3 Good · 4 Easy · ← → skip</p></div>`;
  $("#fc").onclick=()=>$("#fc").classList.toggle("flip");}
function rateCard(r){ensureP();const c=FC.pool[FC.queue[FC.i]];const s=S.srs[c.key]||{b:0,n:0};let b=s.b;
  if(r===1){b=0;const cur=FC.queue.splice(FC.i,1)[0];FC.queue.splice(Math.min(FC.queue.length,FC.i+3),0,cur);FC.i--;}
  else if(r===2)b=Math.max(1,b);else if(r===3)b=Math.min(5,b+1);else b=Math.min(5,b+2);
  S.srs[c.key]={b,due:addDays(r===1?0:r===2?1:SRS_DAYS[b]),n:(s.n||0)+1};save();if(r>=3){S.xp+=1;bumpDay(1);touchStreak();save();renderSide();}
  FC.i++;drawDeck();const st=srsStats(cardPool(FC.id));const bar=$(".srsbar");if(bar)bar.innerHTML=`<div><b>${st.nw}</b><span>New</span></div><div><b>${st.due}</b><span>Due today</span></div><div><b>${st.learn}</b><span>Learning</span></div><div><b>${st.mast}</b><span>Mastered</span></div>`;}
function mountCards(id){FC.id=id;$("#tabbody").innerHTML=cardsTabHTML(id);buildQueue(id);drawDeck();}

/* ---------- Quiz tab ---------- */
function qStats(pool){ensureP();let att=0,cor=0;const byLv=[0,0,0,0,0].map(()=>({a:0,c:0}));pool.forEach(q=>{const r=S.qa[q.key];if(r){att++;if(r.c>0&&r.last)cor++;byLv[q.lv].a++;if(r.last)byLv[q.lv].c++;}});return {att,cor,byLv,total:pool.length,mist:pool.filter(q=>S.mist[q.key]).length};}
function quizTabHTML(id){const pool=quizPool(id);const st=qStats(pool);const banked=!!QB[id];
  return `<section class="stack"><div class="card stack"><div class="row between"><div><h2>Quiz</h2><p class="note">${banked?`${QB[id].q.length} levelled MCQs`:`${pool.length} MCQs (the 100-question levelled bank for this chapter is being written)`} · attempted ${st.att}/${st.total} · ${st.mist} in mistakes bank</p></div></div>
  <div class="lvgrid">${[1,2,3,4].map(l=>{const n=pool.filter(q=>q.lv===l).length;const b=st.byLv[l];return `<div class="lvcell ${LV_CLS[l]}"><b>${LV[l]}</b><span>${n} questions</span><span class="note">${b.a?`${Math.round(b.c/b.a*100)}% right`:"Not tried"}</span></div>`;}).join("")}</div>
  <div class="grid g2">
   <div class="mode"><b>🪜 Adaptive ladder</b><span class="note">Starts Basic. 3 right in a row moves you up a level; a miss moves you down and saves it to Mistakes. 20 questions.</span><button class="btn pri" data-act="qz-ladder">Start ladder</button></div>
   <div class="mode"><b>🎯 Level practice</b><span class="note">Drill one level.</span><div class="row"><select id="qzlv" aria-label="Level">${[1,2,3,4].map(l=>`<option value="${l}">${LV[l]}</option>`).join("")}</select><select id="qzn" aria-label="Count"><option value="10">10</option><option value="20">20</option><option value="999">All</option></select><button class="btn" data-act="qz-level">Start</button></div></div>
   <div class="mode"><b>🔁 Mistakes bank (${st.mist})</b><span class="note">Re-test everything you got wrong. Correct answers leave the bank.</span><button class="btn" data-act="qz-mist" ${st.mist?"":"disabled"}>Review mistakes</button></div>
   <div class="mode"><b>📝 Full chapter test</b><span class="note">All ${pool.length} questions, mixed levels.</span><label class="check"><input type="checkbox" id="qztime"> Timed (45 s per question)</label><button class="btn" data-act="qz-full">Start test</button></div>
  </div><div class="row"><button class="btn sm" data-act="ai-quiz">Generate 5 fresh MCQs with AI</button></div></div><div id="quizbox"></div></section>`;}
function recordAns(q,ok){ensureP();const r=S.qa[q.key]||{c:0,w:0};if(ok)r.c++;else r.w++;r.last=ok?1:0;S.qa[q.key]=r;if(!ok)S.mist[q.key]=1;save();}
function mountQuiz(id){$("#tabbody").innerHTML=quizTabHTML(id);}
function startList(qs,opts){const box=$("#quizbox");runQuiz(box,qs,opts);box.scrollIntoView({behavior:"smooth",block:"start"});}
function runLadder(box,pool,n=20){clearInterval(QUIZ_TIMER);let level=1,streak=0,i=0,score=0,top=1;const asked=new Set(),log=[];
  const pick=()=>{for(const d of [0,1,-1,2,-2,3,-3]){const L=level+d;if(L<1||L>4)continue;const cand=pool.filter(q=>q.lv===L&&!asked.has(q.key));if(cand.length){const fresh=cand.filter(q=>!(S.qa[q.key]&&S.qa[q.key].last));return shuffle(fresh.length?fresh:cand)[0];}}return null;};
  function show(){const q=pick();if(!q||i>=n){finish();return;}asked.add(q.key);
    box.innerHTML=`<div class="card q"><div class="row between"><span class="eyebrow">Adaptive ladder · Q${i+1} of ${n}</span><span class="ladder" aria-label="Level ${level}">${[1,2,3,4].map(l=>`<i class="${l<=level?LV_CLS[l]+" on":""}"></i>`).join("")}<b>${LV[level]}</b></span></div>
    <div class="row" style="gap:6px">${lvChip(q.lv)}<span class="note">Streak ${streak}/3</span></div><h3>${esc(q.q)}</h3><p class="note kbd-hint">Tip: press 1–4 to answer, Enter for next.</p>
    <div class="stack">${q.o.map((o,k)=>`<button class="opt" data-k="${k}"><b>${"ABCD"[k]}</b><span>${esc(o)}</span></button>`).join("")}</div><div class="fb" aria-live="polite"></div></div>`;
    $$(".opt",box).forEach(b=>b.onclick=()=>answer(q,+b.dataset.k));}
  function answer(q,k){if($(".opt[disabled]",box))return;const ok=k===q.a;recordAns(q,ok);log.push({q,k,ok});i++;let msg="";
    if(ok){score++;streak++;if(streak>=3&&level<4){level++;streak=0;msg=` ⬆ Level up: ${LV[level]}!`;top=Math.max(top,level);}}else{streak=0;if(level>1){level--;msg=` ⬇ Back to ${LV[level]}.`;}}
    $$(".opt",box).forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add("right");else if(j===k)b.classList.add("wrong");});
    $(".fb",box).innerHTML=`<div class="explain"><b>${ok?"Correct.":"Not quite."}${msg}</b> ${esc(q.e||"")}</div><div class="row" style="margin-top:12px"><button class="btn pri" id="qnext">${i<n?"Next question":"See results"}</button></div>`;$("#qnext",box).onclick=show;$("#qnext",box).focus();}
  function finish(){const tot=log.length;if(!tot){box.innerHTML='<p class="note">No questions available.</p>';return;}const pct=Math.round(score/tot*100);
    const id=log[0].q.ch;const o=S.quiz[id]||{best:0,last:0,n:0};S.quiz[id]={best:Math.max(o.best,pct),last:pct,n:o.n+1};S.hist.unshift({d:today(),title:"Adaptive ladder",score,total:tot});S.hist=S.hist.slice(0,30);save();if(score)addXP(score*10+(top-1)*10,`ladder · reached ${LV[top]}`);
    box.innerHTML=`<div class="card stack"><div class="row between"><div><span class="eyebrow">Adaptive ladder · result</span><div class="score">${score}/${tot}</div><p class="muted">Highest level reached: <b>${LV[top]}</b>. Finished at ${LV[level]}.</p></div><div class="ring" style="--p:${pct}"><span>${pct}%</span></div></div>
    <div class="lvgrid">${[1,2,3,4].map(l=>{const a=log.filter(x=>x.q.lv===l);return `<div class="lvcell ${LV_CLS[l]}"><b>${LV[l]}</b><span>${a.length?`${a.filter(x=>x.ok).length}/${a.length} right`:"—"}</span></div>`;}).join("")}</div>
    <details ${pct<100?"open":""}><summary><b>Review answers</b></summary><div class="stack" style="margin-top:10px">${log.map(x=>`<div class="explain"><b>${x.ok?"✓":"✗"} ${esc(x.q.q)}</b><br>Answer: ${esc(x.q.o[x.q.a])}${x.ok?"":` · You chose: ${esc(x.q.o[x.k])}`}<br><span class="muted">${esc(x.q.e||"")}</span></div>`).join("")}</div></details>
    <div class="row"><button class="btn pri" data-act="qz-ladder">Climb again</button>${log.some(x=>!x.ok)?'<button class="btn" data-act="qz-mist">Review mistakes</button>':""}</div></div>`;if(pct===100)confetti();}
  show();box.scrollIntoView({behavior:"smooth",block:"start"});}

/* ---------- Glossary drill-down ---------- */
const GL_KEYS=(()=>{const all=Object.keys(GLOSS).map(k=>[k,k]).concat(Object.entries(GLOSS_ALIAS));return all.sort((a,b)=>b[0].length-a[0].length);})();
const GL_RE=new RegExp("\\b("+GL_KEYS.map(([k])=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")\\b","gi");
function glossKey(m){const l=m.toLowerCase();return GLOSS[l]?l:GLOSS_ALIAS[l];}
function linkTerms(text){const used=new Set();return esc(text).replace(GL_RE,(m)=>{const k=glossKey(m);if(!k||used.has(k))return m;used.add(k);return `<button class="term" data-act="term" data-t="${esc(k)}">${m}</button>`;});}
function chapterTerms(c){const txt=[...c.core,...c.topics.map(t=>t[0]),...c.hy].join(" ");const set=new Set();(txt.match(GL_RE)||[]).forEach(m=>{const k=glossKey(m);if(k)set.add(k);});return [...set];}
function termBox(k){const g=GLOSS[k];return `<div class="termbox" data-k="${esc(k)}"><div class="row between"><b>${esc(k.replace(/\b\w/g,c=>c.toUpperCase()))}</b><button class="btn sm ghost" data-act="term-close" aria-label="Close">✕</button></div><p>${esc(g[0])}</p><button class="btn sm" data-act="term-more">More ▸</button><p class="more" hidden>${esc(g[1])}</p></div>`;}

Object.assign(ACT,{
 "fc-mode":el=>{FC.mode=el.dataset.m;mountCards(FC.id||location.hash.slice(3));},
 "fc-lv":el=>{FC.lv=+el.dataset.l;mountCards(FC.id||location.hash.slice(3));},
 "fc-rate":el=>{const f=$("#fc");if(f&&!f.classList.contains("flip")){f.classList.add("flip");return;}rateCard(+el.dataset.r);},
 "fc-step":el=>{FC.i=Math.max(0,Math.min(FC.queue.length,FC.i+(+el.dataset.d)));drawDeck();},
 "qz-ladder":()=>{const id=location.hash.slice(3);runLadder($("#quizbox"),quizPool(id));},
 "qz-level":()=>{const id=location.hash.slice(3);const l=+$("#qzlv").value,n=+$("#qzn").value;const qs=shuffle(quizPool(id).filter(q=>q.lv===l)).slice(0,n);if(!qs.length){toast("No questions at this level yet");return;}startList(qs,{title:`${LV[l]} practice`,onAnswer:recordAns});},
 "qz-mist":()=>{const id=location.hash.slice(3);ensureP();const qs=shuffle(quizPool(id).filter(q=>S.mist[q.key]));if(!qs.length){toast("Mistakes bank is empty");return;}startList(qs,{title:"Mistakes bank",onAnswer:(q,ok)=>{recordAns(q,ok);if(ok){delete S.mist[q.key];save();}}});},
 "qz-full":()=>{const id=location.hash.slice(3);const t=$("#qztime").checked?45:0;startList(shuffle(quizPool(id)),{title:"Full chapter test",timed:t,onAnswer:recordAns});},
 term:el=>{const li=el.closest("li,.termhost");if(!li)return;const ex=li.querySelector(".termbox");if(ex&&ex.dataset.k===el.dataset.t){ex.remove();return;}if(ex)ex.remove();li.insertAdjacentHTML("beforeend",termBox(el.dataset.t));},
 "term-more":el=>{const p=el.parentElement.querySelector(".more");p.hidden=!p.hidden;el.textContent=p.hidden?"More ▸":"Less ▴";},
 "term-close":el=>el.closest(".termbox").remove()
});
document.addEventListener("keydown",e=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||!$("#r1"))return;if(["1","2","3","4"].includes(e.key)){e.preventDefault();$(`[data-act="fc-rate"][data-r="${e.key}"]`).click();}},true);
