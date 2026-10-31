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
function hwHead(eyebrow,title,right=""){return `<div class="hw-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${right?`<div class="row">${right}</div>`:""}</div>`;}
function vHome2(){const L=level();const h=new Date().getHours();const greet=h<5?"Burning the midnight oil":h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const last=S.lastCh&&CH[S.lastCh];const nx=last?nextStep(last.id):null;const upnext=nextChapter();
  const goal=S.goal||50;const todayXP=(S.days||{})[today()]||0;const dl=daysLeft();const due=dueCardsAll();ensureP();const mist=Object.keys(S.mist).length;
  const done=Object.keys(S.done).length;const saved=S.saved.length;
  const totAns=SUBJECTS.reduce((a,s)=>a+s.chapters.reduce((b,c)=>b+ansCount(c.id),0),0);
  const top=EXAM_SUBJ.flatMap(sid=>SUB[sid].chapters.flatMap(c=>c.topics.map((t,k)=>({t,c,k})).filter(x=>x.t[1]>=5)));const pick=shuffle(top).slice(0,10);
  POST=()=>{const bank=bankQs(ALLCH.map(c=>c.id));const q=bank[hashStr(today())%bank.length];runQuiz($("#daily"),[q],{title:"Daily dose"});requestAnimationFrame(()=>$$(".ringarc").forEach(a=>a.classList.add("go")));};
  const resume=last?`#c-${last.id}`:"#c-path1";
  const stats=[
    [dl!=null?(dl>0?dl:0):"—",dl!=null?"days to exam":"<u>Set exam date →</u>","cal","#planner",""],
    [S.streak,"day streak","flame","#progress",""],
    [S.xp,`XP · ${esc(L.name)}`,"spark","#progress",""],
    [`${done}<small>/${ALLCH.length}</small>`,"chapters done","book","#subjects",""],
    [totAns,"offline answers","doc","#radar",""]];
  return `<section class="hx-hero">
   <div class="hx-blob b1" aria-hidden="true"></div><div class="hx-blob b2" aria-hidden="true"></div><div class="hx-blob b3" aria-hidden="true"></div>${[[6,0,18],[18,3.2,12],[34,6.1,22],[52,1.6,14],[68,4.4,20],[82,2.4,13],[93,7,17]].map(h=>`<span class="hx-heart" aria-hidden="true" style="left:${h[0]}%;animation-delay:${h[1]}s;font-size:${h[2]}px">♥</span>`).join("")}
   <div class="hx-main">
    <div class="row" style="gap:8px;flex-wrap:wrap"><span class="hx-date">${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</span><span class="hx-love">💗 Made with love, for you</span></div>
    <h1>${greet},<br><span class="hx-name">Dr. Shikha ☘️🩺</span></h1>
    <p class="hx-sub">${done?`You've completed <b>${done}</b> of ${ALLCH.length} chapters — keep the momentum going.`:"Your Second Prof, mapped chapter by chapter. One concept today is all it takes to start."}</p>
    <div class="hx-cta"><a class="btn pri lg" href="${resume}">${last?"Resume "+esc(SUB[last.s].short)+" "+last.n:"Start Pathology 1"} <span aria-hidden="true">→</span></a><button class="btn lg" data-act="drawer">${ico("spark",18)} Ask Atlas</button><a class="btn lg ghost" href="#radar">${ico("radar",18)} Exam radar</a></div>
   </div>
   <div class="hw-today hx-today"><div class="row between"><span class="eyebrow">Today's goal</span><span class="row goalpick" role="group" aria-label="Daily XP goal">${[30,50,100].map(g=>`<button class="${goal===g?"on":""}" data-act="goal" data-g="${g}">${g}</button>`).join("")}</span></div>
    <div class="hw-today-in">${ringSVG(todayXP/goal,112,11,`${todayXP}/${goal}`,"XP")}<div class="stack" style="gap:6px;min-width:0"><b>${todayXP>=goal?"Goal reached 🎉":`${goal-todayXP} XP to go`}</b><span class="note">Correct answer +10 · card +1</span><div class="weekstrip" aria-label="Last 14 days activity">${weekStrip()}</div><span class="note">Last 14 days</span></div></div></div>
   <div class="hx-stats">${stats.map(x=>`<a class="hx-stat" href="${x[3]}"><span class="ic">${ico(x[2],18)}</span><span><b>${x[0]}</b><span>${x[1]}${x[4]?` · <u>${x[4]}</u>`:""}</span></span></a>`).join("")}</div>
  </section>

  <section class="hw-grid">
   <div class="hw-continue card" data-s="${last?last.s:"path"}">
    ${last?`<span class="eyebrow" style="color:var(--sc)">Continue learning</span><div class="hw-cont-main"><div class="stack" style="gap:8px;min-width:0"><span class="note">${esc(SUB[last.s].name)} · Chapter ${last.n}</span><h2>${esc(last.t)}</h2>
      <div class="bar"><i style="width:${chProgress(last.id)}%;background:var(--sc)"></i></div><span class="note">${chProgress(last.id)}% · ${(S.read[last.id]||[]).length}/${last.core.length} concepts${S.quiz[last.id]?` · quiz best ${S.quiz[last.id].best}%`:""}</span>
      ${nx?`<button class="nextstep" data-act="go-tab" data-c="${last.id}" data-t="${nx.tab}"><span class="ic">${ico(nx.icon,20)}</span><span><b>Next step</b><br>${esc(nx.label)}</span><span aria-hidden="true">→</span></button>`:`<p class="note">✓ Chapter complete.</p>`}</div>
      <div class="hw-cont-ring">${ringSVG(chProgress(last.id)/100,110,11,chProgress(last.id)+"%","done")}</div></div>
      <div class="row"><a class="btn pri" href="#c-${last.id}">Resume chapter</a>${upnext&&upnext.id!==last.id?`<a class="btn" href="#c-${upnext.id}">Up next: ${esc(SUB[upnext.s].short)} ${upnext.n}</a>`:""}</div>`
    :`<span class="eyebrow" style="color:var(--sc)">Start here</span><div class="hw-cont-main"><div class="stack" style="gap:8px;min-width:0"><span class="note">Pathology · Chapter 1</span><h2>Cell Injury, Adaptation &amp; Death</h2><p class="muted">Offline model answers in four lengths, 100 flashcards and 100 levelled MCQs — ready to go.</p></div><div class="hw-cont-ring">${ringSVG(0,110,11,"0%","done")}</div></div><div class="row"><a class="btn pri" href="#c-path1">Start Pathology 1</a><a class="btn" href="#subjects">Browse subjects</a></div>`}
   </div>
   <div class="stack hw-dose">${hwHead("New question every day","Daily dose")}<div id="daily"></div></div>
  </section>

  <section class="stack">${hwHead("Jump in","Quick actions")}
  <div class="hw-actions">${[
    ["#flowcharts","flow","Flowcharts","107 charts","micro"],
    [resume,"cards","Flashcards",due?`${due} due today`:"Start a deck","path",last?"cards":null],
    [resume,"target","Adaptive quiz",mist?`${mist} in mistakes`:"Climb levels","pharm",last?"quiz":null],
    ["#radar","radar","Exam radar","Past-paper ★","fmt"],
    ["#notes","doc","Notes & Books","Read & bookmark","cm"],
    ["#saved","bookmark","Revision list",`${saved} saved`,"path"],
    ["#planner","cal","Study planner",S.plan?"View today":"Create plan","micro"],
    ["#studio","spark","AI Studio","10 tools","pharm"]].map(a=>`<a class="qa" data-s="${a[4]}" href="${a[0]}" ${a[5]?`data-act="go-tab" data-c="${(last||CH.path1).id}" data-t="${a[5]}"`:""}><span class="ic">${ico(a[1],22)}</span><span class="stack" style="gap:0;min-width:0"><b>${a[2]}</b><span class="note">${a[3]}</span></span></a>`).join("")}</div></section>

  <section class="stack">${hwHead("Your syllabus","Subjects",`<a class="btn sm ghost" href="#subjects">All subjects →</a>`)}
   <div class="hw-subjects">${SUBJECTS.map(s=>{const p=subjPct(s.id);const nc=s.chapters.find(c=>!chDone(c.id))||s.chapters[0];const nans=s.chapters.reduce((a,c)=>a+ansCount(c.id),0);return `<div class="hw-subj" data-s="${s.id}"><div class="hw-subj-top"><div class="stack" style="gap:2px;min-width:0"><b>${esc(s.name)}</b><span class="note">${s.std?"Phase III exam":"Phase II exam"}</span></div><div class="hw-subj-ring">${ringSVG(p/100,58,6,p+"%")}</div></div><div class="hw-subj-meta"><span><b>${s.chapters.filter(c=>chDone(c.id)).length}/${s.chapters.length}</b> chapters</span><span><b>${nans}</b> answers</span></div><a class="hw-subj-next" href="#c-${nc.id}"><span>Ch ${nc.n} · ${esc(nc.t)}</span><span aria-hidden="true">→</span></a></div>`;}).join("")}</div></section>

  ${S.plan?`<section class="card stack"><div class="row between"><h3>Today's plan</h3><a class="btn sm" href="#planner">Open planner</a></div>${planToday()}</section>`:`<a class="card hw-planpromo" href="#planner"><span class="ic">${ico("cal",22)}</span><span><b>Plan to your exam date</b><br><span class="note">Get a day-by-day schedule weighted by exam priority.</span></span><span class="btn sm pri">Create plan →</span></a>`}

  <section class="stack">${hwHead("Most repeated in past papers","Five-star exam topics",`<button class="btn sm icon" data-act="car" data-d="-1" aria-label="Scroll left">←</button><button class="btn sm icon" data-act="car" data-d="1" aria-label="Scroll right">→</button><a class="btn sm" href="#radar">Full radar</a>`)}
   <div class="carousel" id="car">${pick.map(({t,c,k})=>`<div class="carcard" data-s="${c.s}"><span class="carmeta">${esc(SUB[c.s].short)} ${c.n} · ${esc(c.t)}</span><span>${starsHTML(t[1])} ${tagHTML(t[2])}</span><b>${esc(t[0])}</b><div class="row" style="margin-top:auto"><a class="btn sm ${hasAns(c.id,k)?"pri":""}" href="#c-${c.id}">${hasAns(c.id,k)?"Read answer ✓":"Study"}</a><button class="btn sm star ${isSaved(c.id,k)?"on":""}" data-act="save" data-c="${c.id}" data-k="${k}" aria-pressed="${isSaved(c.id,k)}">${isSaved(c.id,k)?"★":"☆"}</button></div></div>`).join("")}</div></section>

  <section class="hw-ai"><div class="stack" style="gap:8px"><span class="eyebrow">AI Studio</span><h2>Stuck on a topic? Ask Atlas.</h2><p class="muted">Tutor, simplifier, question generator, mock tests, voice tutor and more — grounded in your chapter notes.</p><div class="row">${aiBadge()}<a class="btn pri" href="#studio">Open AI Studio</a><button class="btn" data-act="drawer">Quick question</button></div></div>
   <div class="hw-ai-tools">${TOOLS.slice(0,6).map(t=>`<a class="hw-ai-tool" href="#${t[0]}"><span class="ic">${ico(t[3],18)}</span>${t[1]}</a>`).join("")}</div></section>`;}
ROUTES.home=vHome2;
Object.assign(ACT,{
 goal:el=>{S.goal=+el.dataset.g;save();route();},
 "go-tab":(el,e)=>{e&&e.preventDefault();PENDING_TAB=el.dataset.t;const h="#c-"+el.dataset.c;if(location.hash===h){CHTAB=PENDING_TAB;PENDING_TAB=null;route();}else location.hash=h;},
 car:el=>{const c=$("#car");c.scrollBy({left:(+el.dataset.d)*c.clientWidth*0.8,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
});
