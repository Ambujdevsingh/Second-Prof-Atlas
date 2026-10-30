/* ============ Learner dashboard (home) ============ */
function dueCardsAll(){ensureP();const t=today();let n=0;ALLCH.forEach(c=>cardPool(c.id).forEach(x=>{const s=S.srs[x.key];if(s&&s.due<=t)n++;}));return n;}
function chProgress(id){const c=CH[id];const r=(S.read[id]||[]).length/c.core.length;const q=S.quiz[id]?S.quiz[id].best/100:0;return Math.round((chDone(id)?1:(r*0.5+q*0.5))*100);}
function nextStep(id){const c=CH[id];ensureP();const t=today();const read=(S.read[id]||[]).length;
  if(read<c.core.length)return {tab:"learn",label:`Tick ${c.core.length-read} remaining concept${c.core.length-read>1?"s":""}`,icon:"book"};
  const due=cardPool(id).filter(x=>S.srs[x.key]&&S.srs[x.key].due<=t).length;if(due)return {tab:"cards",label:`Review ${due} due flashcard${due>1?"s":""}`,icon:"cards"};
  if(!S.quiz[id])return {tab:"quiz",label:"Climb the adaptive quiz ladder",icon:"target"};
  if(!chDone(id))return {tab:"sum",label:"Revise the Details & Summary, then mark complete",icon:"doc"};
  return null;}
function nextChapter(){for(const sid of EXAM_SUBJ.concat(["cm","fmt"])){const c=SUB[sid].chapters.find(x=>!chDone(x.id));if(c)return c;}return null;}
function daysLeft(){if(!S.plan)return null;const d=Math.round((new Date(S.plan.exam+"T00:00:00")-new Date(today()+"T00:00:00"))/864e5);return d;}
function ringSVG(p,size=120,stroke=12,label="",sub=""){const r=(size-stroke)/2,C=2*Math.PI*r,off=C*(1-Math.min(1,p));
  return `<svg class="ringsvg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label)} ${esc(sub)}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/><circle class="ringarc" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--sc,var(--accent))" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="${sub?46:52}%" text-anchor="middle" dominant-baseline="middle" class="ringtxt">${esc(label)}</text>${sub?`<text x="50%" y="66%" text-anchor="middle" class="ringsub">${esc(sub)}</text>`:""}</svg>`;}
function weekStrip(){S.days=S.days||{};const out=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dstr(d);const v=S.days[k]||0;const lvl=v===0?0:v<20?1:v<50?2:v<100?3:4;out.push(`<i class="dd l${lvl} ${i===0?"today":""}" title="${d.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}: ${v} XP"></i>`);}return out.join("");}
function vHome2(){const L=level();const h=new Date().getHours();const greet=h<5?"Burning the midnight oil":h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const last=S.lastCh&&CH[S.lastCh];const nx=last?nextStep(last.id):null;const upnext=nextChapter();
  const goal=S.goal||50;const todayXP=(S.days||{})[today()]||0;const dl=daysLeft();const due=dueCardsAll();ensureP();const mist=Object.keys(S.mist).length;
  const done=Object.keys(S.done).length;const saved=S.saved.length;
  const top=EXAM_SUBJ.flatMap(sid=>SUB[sid].chapters.flatMap(c=>c.topics.map((t,k)=>({t,c,k})).filter(x=>x.t[1]>=5)));const pick=shuffle(top).slice(0,10);
  const steps=[["Open your first chapter",!!S.lastCh,"#s-path"],["Tick a core concept",Object.values(S.read).some(a=>a.length),"#s-path"],["Rate a flashcard",Object.keys(S.srs).length>0,"#s-path"],["Finish a quiz",Object.keys(S.quiz).length>0,"#s-path"],["Build your study plan",!!S.plan,"#planner"]];
  const stepsDone=steps.filter(x=>x[1]).length;
  POST=()=>{const bank=bankQs(ALLCH.map(c=>c.id));const q=bank[hashStr(today())%bank.length];runQuiz($("#daily"),[q],{title:"Daily dose"});requestAnimationFrame(()=>$$(".ringarc").forEach(a=>a.classList.add("go")));};
  return `<section class="hw-top">
   <div class="hw-greet"><span class="eyebrow">${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</span><h1>${greet}, Doctor 👋</h1>
    <p class="muted">${done?`You've completed ${done} of ${ALLCH.length} chapters. Keep the streak alive.`:"Your MBBS Phase II prep, organised chapter by chapter. Start with one concept today."}</p></div>
   <div class="hw-pills"><div class="pill">${dl!=null?`<b>${dl>0?dl:0}</b><span>days to exam</span>`:`<a href="#planner"><b>📅</b><span>Set exam date</span></a>`}</div><div class="pill"><b>🔥 ${S.streak}</b><span>day streak</span></div><div class="pill"><b>${S.xp}</b><span>XP · ${esc(L.name)}</span></div></div></section>

  <section class="hw-grid">
   <div class="hw-continue card" data-s="${last?last.s:"path"}">
    ${last?`<span class="eyebrow">Continue learning</span><div class="hw-cont-main"><div class="stack" style="gap:6px;min-width:0"><span class="note">${esc(SUB[last.s].name)} · Chapter ${last.n}</span><h2>${esc(last.t)}</h2>
      <div class="bar"><i style="width:${chProgress(last.id)}%;background:var(--sc)"></i></div><span class="note">${chProgress(last.id)}% · ${(S.read[last.id]||[]).length}/${last.core.length} concepts${S.quiz[last.id]?` · quiz best ${S.quiz[last.id].best}%`:""}</span>
      ${nx?`<button class="nextstep" data-act="go-tab" data-c="${last.id}" data-t="${nx.tab}"><span class="ic">${ico(nx.icon,20)}</span><span><b>Next step</b><br>${esc(nx.label)}</span><span aria-hidden="true">→</span></button>`:`<p class="note">✓ Chapter complete.</p>`}</div>
      <div class="hw-cont-ring">${ringSVG(chProgress(last.id)/100,110,11,chProgress(last.id)+"%","done")}</div></div>
      <div class="row"><a class="btn pri" href="#c-${last.id}">Resume chapter</a>${upnext&&upnext.id!==last.id?`<a class="btn" href="#c-${upnext.id}">Up next: ${esc(SUB[upnext.s].short)} ${upnext.n}</a>`:""}</div>`
    :`<span class="eyebrow">Start here</span><h2>Begin with Cell Injury</h2><p class="muted">Pathology chapter 1 has offline model answers, 100 flashcards and 100 MCQs ready.</p><div class="row"><a class="btn pri" href="#c-path1">Start Pathology 1</a><a class="btn" href="#subjects">Browse subjects</a></div>`}
   </div>
   <div class="hw-today card"><div class="row between"><span class="eyebrow">Today</span><span class="row goalpick" role="group" aria-label="Daily XP goal">${[30,50,100].map(g=>`<button class="${goal===g?"on":""}" data-act="goal" data-g="${g}">${g}</button>`).join("")}</span></div>
    <div class="hw-today-in">${ringSVG(todayXP/goal,120,12,`${todayXP}/${goal}`,"XP goal")}<div class="stack" style="gap:6px;min-width:0"><b>${todayXP>=goal?"Goal reached 🎉":`${goal-todayXP} XP to today's goal`}</b><span class="note">Correct answers +10 · cards +1 · concepts & chapters more</span><div class="weekstrip" aria-label="Last 14 days activity">${weekStrip()}</div><span class="note">Last 14 days</span></div></div></div>
  </section>

  <section class="hw-actions">${[
    ["#flowcharts","flow","Flowcharts","107 charts"],
    [last?`#c-${last.id}`:"#c-path1","cards","Flashcards",due?`${due} due today`:"Start a deck",last?"cards":null],
    [last?`#c-${last.id}`:"#c-path1","target","Adaptive quiz",mist?`${mist} in mistakes`:"Climb levels",last?"quiz":null],
    ["#radar","radar","Exam radar","Past-paper ★"],
    ["#notes","doc","Notes & Books","Read & bookmark"],
    ["#saved","bookmark","Revision list",`${saved} saved`],
    ["#planner","cal","Study planner",S.plan?"View today":"Create plan"],
    ["#studio","spark","AI Studio","10 tools"]].map(a=>`<a class="qa" href="${a[0]}" ${a[4]?`data-act="go-tab" data-c="${(last||CH.path1).id}" data-t="${a[4]}"`:""}><span class="ic">${ico(a[1],22)}</span><b>${a[2]}</b><span class="note">${a[3]}</span></a>`).join("")}</section>

  ${stepsDone<steps.length?`<section class="card hw-onb"><div class="row between"><div><span class="eyebrow">Getting started · ${stepsDone}/${steps.length}</span><h2>Your first-week checklist</h2></div><div class="bar" style="width:160px"><i style="width:${stepsDone/steps.length*100}%"></i></div></div><div class="onbsteps">${steps.map((x,i)=>`<a class="onbstep ${x[1]?"done":""}" href="${x[2]}"><span class="tick">${x[1]?"✓":i+1}</span><span>${x[0]}</span></a>`).join("")}</div></section>`:""}

  <section class="hw-two">
   <div class="stack"><div class="row between"><h2>Subjects</h2><a class="btn sm ghost" href="#subjects">All →</a></div>
    <div class="hw-subjects">${SUBJECTS.map(s=>{const p=subjPct(s.id);const nc=s.chapters.find(c=>!chDone(c.id))||s.chapters[0];const nans=s.chapters.reduce((a,c)=>a+ansCount(c.id),0);return `<div class="hw-subj" data-s="${s.id}"><div class="hw-subj-ring">${ringSVG(p/100,64,7,p+"%")}</div><div class="stack" style="gap:2px;min-width:0"><b>${esc(s.name)}</b><span class="note">${s.chapters.filter(c=>chDone(c.id)).length}/${s.chapters.length} chapters${nans?` · ${nans} offline answers`:""}${s.std?" · Phase III exam":""}</span><a class="hw-subj-next" href="#c-${nc.id}">Continue: Ch ${nc.n} ${esc(nc.t)} →</a></div></div>`;}).join("")}</div></div>
   <div class="stack"><div class="row between"><h2>Daily dose</h2><span class="note">New question every day</span></div><div id="daily"></div>
    ${S.plan?`<div class="card stack"><div class="row between"><h3>Today's plan</h3><a class="btn sm" href="#planner">Open</a></div>${planToday()}</div>`:`<a class="card hw-planpromo" href="#planner"><span class="ic">${ico("cal",22)}</span><span><b>Plan to your exam date</b><br><span class="note">Get a day-by-day schedule weighted by exam priority.</span></span><span aria-hidden="true">→</span></a>`}</div>
  </section>

  <section class="stack"><div class="row between"><div><h2>Five-star exam topics</h2><p class="note">Most repeated in your seniors' past-paper lists. Swipe or use the arrows.</p></div><div class="row"><button class="btn sm" data-act="car" data-d="-1" aria-label="Scroll left">←</button><button class="btn sm" data-act="car" data-d="1" aria-label="Scroll right">→</button><a class="btn sm" href="#radar">Full radar</a></div></div>
   <div class="carousel" id="car">${pick.map(({t,c,k})=>`<div class="carcard" data-s="${c.s}"><span class="eyebrow" style="color:var(--sc)">${esc(SUB[c.s].short)} ${c.n} · ${esc(c.t)}</span><span>${starsHTML(t[1])} ${tagHTML(t[2])}</span><b>${esc(t[0])}</b><div class="row" style="margin-top:auto"><a class="btn sm ${hasAns(c.id,k)?"pri":""}" href="#c-${c.id}">${hasAns(c.id,k)?"Read answer ✓":"Study"}</a><button class="btn sm star ${isSaved(c.id,k)?"on":""}" data-act="save" data-c="${c.id}" data-k="${k}" aria-pressed="${isSaved(c.id,k)}">${isSaved(c.id,k)?"★":"☆"}</button></div></div>`).join("")}</div></section>

  <section class="hw-ai card"><div class="stack" style="gap:6px"><span class="eyebrow">AI Studio</span><h2>Stuck on a topic? Ask Atlas.</h2><p class="muted">Tutor, simplifier, question generator, mock tests, voice tutor and more — grounded in your chapter notes.</p><div class="row">${aiBadge()}<a class="btn pri" href="#studio">Open AI Studio</a><button class="btn" data-act="drawer">Quick question</button></div></div>
   <div class="hw-ai-tools">${TOOLS.slice(0,6).map(t=>`<a class="hw-ai-tool" href="#${t[0]}"><span class="ic">${ico(t[3],18)}</span>${t[1]}</a>`).join("")}</div></section>`;}
ROUTES.home=vHome2;
Object.assign(ACT,{
 goal:el=>{S.goal=+el.dataset.g;save();route();},
 "go-tab":(el,e)=>{e&&e.preventDefault();PENDING_TAB=el.dataset.t;const h="#c-"+el.dataset.c;if(location.hash===h){CHTAB=PENDING_TAB;PENDING_TAB=null;route();}else location.hash=h;},
 car:el=>{const c=$("#car");c.scrollBy({left:(+el.dataset.d)*c.clientWidth*0.8,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
});
