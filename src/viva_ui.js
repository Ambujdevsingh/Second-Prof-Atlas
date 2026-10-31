/* ============ Practicals & Viva — UI ============ */
let VST="all", VF="all", VQ="", VOPEN={}, VREVEAL=false, VM=null;
function vMem(){S.viva=S.viva||{st:{},mocks:0};S.viva.st=S.viva.st||{};return S.viva;}
function vSub(s){return VIVA.find(x=>x.s===s);}
function vAllQ(sub){const out=[];sub.st.forEach(st=>st.q.forEach((q,i)=>out.push({id:`${sub.s}.${st.id}.${i}`,st,q:q[0],a:q[1],hy:!!q[2],s:sub.s})));return out;}
function vStats(sub){const m=vMem().st,all=vAllQ(sub);const k=all.filter(x=>m[x.id]===2).length,r=all.filter(x=>m[x.id]===1).length;return {n:all.length,k,r,hy:all.filter(x=>x.hy).length,pct:all.length?Math.round(k/all.length*100):0};}
function vTotals(){let n=0,k=0;VIVA.forEach(s=>{const t=vStats(s);n+=t.n;k+=t.k;});return {n,k,pct:n?Math.round(k/n*100):0};}
const VMARK='<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="9" width="26" height="20" rx="6" fill="#fff" fill-opacity=".22"/><path d="M14 29v7l7-7"/><rect x="18" y="20" width="24" height="17" rx="6" fill="#fff" fill-opacity=".38"/><path d="M34 37v5l-5-5M24 28.5h12M24 32h7"/><path d="M13 17h12M13 21h8"/></svg>';
const VSICO={
 path:'<path d="M12 3l4 2.3v4.6L12 12 8 9.9V5.3z"/><path d="M8 9.9l-4 2.3v4.6L8 19l4-2.2v-4.6M16 9.9l4 2.3v4.6L16 19l-4-2.2"/>',
 micro:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.6"/><circle cx="14.5" cy="8.5" r="1.1"/><circle cx="15" cy="14.5" r="1.8"/><circle cx="9.5" cy="15.5" r="1"/>',
 pharm:'<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.6 8.6l4.8 6.8"/>',
 cm:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.3"/><path d="M2.5 20c.6-3.7 2.8-5.5 5.5-5.5s4.9 1.8 5.5 5.5M14 15.2c.9-.7 1.9-1 3-1 2.3 0 3.9 1.6 4.4 4.8"/>',
 fmt:'<path d="M12 3v18M7 21h10M4 7h16"/><path d="M6.5 7 3.5 13.5a3 3 0 0 0 6 0zM17.5 7l-3 6.5a3 3 0 0 0 6 0z"/>'};
function vIco(s,sz=20){return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${VSICO[s]||""}</svg>`;}
function vRing(p,sz=58){const r=24,c=2*Math.PI*r;return `<svg class="vring" width="${sz}" height="${sz}" viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="6"/><circle cx="29" cy="29" r="${r}" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}" transform="rotate(-90 29 29)"/><text x="29" y="33" text-anchor="middle" font-size="13" font-weight="800" fill="currentColor">${p}%</text></svg>`;}

function vVivaHub(){const T=vTotals(),m=vMem();
 return `<section class="vhero"><div class="vhero-l"><span class="vhero-mark">${VMARK}</span><span class="eyebrow">Practicals & Viva · all 5 subjects</span><h1>Walk into the viva prepared</h1><p>Station-wise viva questions for every Phase II practical — spotters, slides, media, prescriptions, certificates — each with a concise answer you can revise offline.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><a class="btn pri lg" href="#viva-mock">${ico("mic",18)} Start a mock viva</a><a class="btn lg" href="#viva-${VIVA[0].s}">Browse questions</a></div></div>
  <div class="vhero-r">${vRing(T.pct,110)}<div><b>${T.k}<small>/${T.n}</small></b><span>questions you've marked as known</span><span class="note">${m.mocks||0} mock vivas taken</span></div></div></section>
 <div class="vsubs">${VIVA.map(s=>{const t=vStats(s);return `<a class="vsub" data-s="${s.s}" href="#viva-${s.s}"><div class="vsub-top"><span class="vsub-ic">${vIco(s.s,24)}</span>${vRing(t.pct,52)}</div><b>${esc(s.name)}</b><span class="note">${s.st.length} stations · ${t.n} questions · ${t.hy} high-yield</span><div class="vsub-st">${s.st.map(x=>`<span>${esc(x.n)}</span>`).join("")}</div><span class="vsub-go">${t.k?`${t.k} known · ${t.r} to revise`:"Start revising"} →</span></a>`;}).join("")}</div>
 <div class="vhow"><div><b>1 · Read the station</b><span>Each station opens with how examiners expect you to answer.</span></div><div><b>2 · Answer aloud, then reveal</b><span>Say your answer first. Tap the question to check it.</span></div><div><b>3 · Mark it</b><span>"I knew it" or "Revise again" — filter to your weak spots later.</span></div><div><b>4 · Mock viva</b><span>Random examiner-style rounds with a score at the end.</span></div></div>
 <p class="note">Questions are compiled from the CBME Phase II practical syllabus and the themes most commonly asked in university vivas. They are not an official question paper — check your department's practical manual for local patterns. Answers are original summaries; verify current guidelines before clinical use.</p>`;}

function vVivaSub(s){const sub=vSub(s);if(!sub)return vVivaHub();const t=vStats(sub);
 if(VST!=="all"&&!sub.st.some(x=>x.id===VST))VST="all";
 POST=()=>{vRenderList(sub);const q=$("#vq");q&&q.addEventListener("input",()=>{VQ=q.value.trim().toLowerCase();vRenderList(sub);});};
 return `<div class="vtop" data-s="${s}"><a class="gback" href="#viva" aria-label="All subjects">←</a><span class="vsub-ic">${vIco(s,26)}</span><div class="vtop-t"><span class="eyebrow">Practicals & Viva</span><h1>${esc(sub.name)}</h1><p class="note">${esc(sub.fmt)}</p></div><div class="vtop-r">${vRing(t.pct,64)}<a class="btn pri" href="#viva-mock" data-act="v-mocksub" data-s="${s}">${ico("mic",16)} Mock viva</a></div></div>
 <div class="vsubnav">${VIVA.map(x=>`<a class="chip ${x.s===s?"on":""}" data-s="${x.s}" href="#viva-${x.s}">${esc(x.name.replace("Forensic Medicine & Toxicology","FMT"))}</a>`).join("")}</div>
 <div class="vstations" role="tablist"><button class="vst ${VST==="all"?"on":""}" data-act="v-st" data-v="all">All stations <small>${t.n}</small></button>${sub.st.map(x=>`<button class="vst ${VST===x.id?"on":""}" data-act="v-st" data-v="${x.id}">${esc(x.n)} <small>${x.q.length}</small></button>`).join("")}</div>
 <div class="vtools"><label class="vsearch">${ico("search",16)}<input id="vq" type="search" placeholder="Search ${esc(sub.name)} viva questions…" value="${esc(VQ)}" aria-label="Search viva questions"></label>
  <div class="seg" role="group" aria-label="Filter">${[["all","All"],["hy","★ High-yield"],["rev","To revise"],["new","Not marked"]].map(f=>`<button class="${VF===f[0]?"on":""}" data-act="v-f" data-v="${f[0]}">${f[1]}</button>`).join("")}</div>
  <button class="btn sm" data-act="v-reveal">${VREVEAL?"Hide all answers":"Show all answers"}</button></div>
 <div id="vlist"></div>`;}

function vRenderList(sub){const m=vMem().st,box=$("#vlist");if(!box)return;let html="",shown=0;
 sub.st.filter(x=>VST==="all"||x.id===VST).forEach(st=>{
  const items=st.q.map((q,i)=>({id:`${sub.s}.${st.id}.${i}`,q:q[0],a:q[1],hy:!!q[2],i})).filter(x=>(VF==="all"||(VF==="hy"&&x.hy)||(VF==="rev"&&m[x.id]===1)||(VF==="new"&&!m[x.id]))&&(!VQ||(x.q+" "+x.a).toLowerCase().includes(VQ)));
  if(!items.length)return;shown+=items.length;const k=st.q.filter((_,i)=>m[`${sub.s}.${st.id}.${i}`]===2).length;
  html+=`<section class="vstation" data-s="${sub.s}"><div class="vstation-h"><div><span class="vnum">${sub.st.indexOf(st)+1}</span><div><h2>${esc(st.n)}</h2><span class="note">${esc(st.d)} · ${k}/${st.q.length} known</span></div></div><div class="vtip">${ico("bulb",16)}<span><b>How to answer:</b> ${esc(st.tip)}</span></div></div>
   <ol class="vqs">${items.map(x=>{const open=VREVEAL||VOPEN[x.id],stt=m[x.id];return `<li class="vqi ${open?"open":""} ${stt===2?"known":stt===1?"rev":""}" data-id="${x.id}"><button class="vq-q" data-act="v-open" data-id="${x.id}" aria-expanded="${!!open}"><span class="vq-n">${x.i+1}</span><span class="vq-t">${esc(x.q)}</span>${x.hy?`<span class="vhy" title="High-yield">★</span>`:""}<span class="vq-s" aria-hidden="true"></span></button>
    <div class="vq-a" ${open?"":"hidden"}><p>${esc(x.a)}</p><div class="vq-rate"><button class="btn sm ${stt===2?"on":""}" data-act="v-rate" data-id="${x.id}" data-v="2">✓ I knew it</button><button class="btn sm ${stt===1?"on":""}" data-act="v-rate" data-id="${x.id}" data-v="1">↻ Revise again</button></div></div></li>`;}).join("")}</ol></section>`;});
 box.innerHTML=html||`<div class="card empty"><b>No questions match.</b><p class="note">Try another filter or clear the search.</p></div>`;}

/* ---------- mock viva ---------- */
let VMS="all";
function vVivaMock(){POST=null;return `<div class="vtop" data-s="mock"><a class="gback" href="#viva" aria-label="Back">←</a><div class="vtop-t"><span class="eyebrow">Practicals & Viva</span><h1>Mock viva</h1><p class="note">An examiner asks — you answer aloud, reveal, and judge yourself honestly.</p></div></div><div id="vm">${vMockSetup()}</div>`;}
function vMockSetup(){return `<div class="vm-setup card"><div class="vm-exam">${VMARK}</div><h2>Set up your viva</h2><span class="eyebrow">Subject</span>
 <div class="vm-chips">${[["all","All subjects"],...VIVA.map(s=>[s.s,s.name])].map(x=>`<button class="chip ${VMS===x[0]?"on":""}" data-act="vm-s" data-v="${x[0]}" ${x[0]!=="all"?`data-s="${x[0]}"`:""}>${esc(x[1])}</button>`).join("")}</div>
 <span class="eyebrow">Length</span><div class="vm-chips">${[5,10,20].map(n=>`<button class="chip vm-n ${n===10?"on":""}" data-act="vm-n" data-v="${n}">${n} questions</button>`).join("")}</div>
 <label class="vm-opt"><input type="checkbox" id="vmweak"> Prefer questions I marked "Revise again"</label>
 <button class="btn pri lg" data-act="vm-go">${ico("mic",18)} Begin viva</button></div>`;}
function vMockQ(){const x=VM.q[VM.i],sub=vSub(x.s);return `<div class="vm-hud">${gDots(VM.i,VM.q.length,VM.res.map(r=>r===2?true:r===0?false:undefined))}<span class="note">Score <b>${VM.score}</b> / ${VM.q.length*2}</span></div>
 <div class="vm-card card ${VM.shown?"":"in"}" data-s="${x.s}"><div class="vm-who"><span class="vm-av">${VMARK}</span><div><b>Examiner · ${esc(sub.name)}</b><span class="note">${esc(x.st.n)}</span></div>${x.hy?`<span class="vhy">★ High-yield</span>`:""}</div>
 <p class="vm-q">${esc(x.q)}</p>
 ${VM.shown?`<div class="vm-a"><span class="eyebrow">Model answer</span><p>${esc(x.a)}</p></div><span class="eyebrow">How did you do?</span><div class="vm-rate"><button class="btn" data-act="vm-r" data-v="2">✓ Knew it</button><button class="btn" data-act="vm-r" data-v="1">≈ Partly</button><button class="btn" data-act="vm-r" data-v="0">✕ Didn't know</button></div>`:`<p class="note">Answer aloud as you would to the examiner, then check.</p><button class="btn pri lg" data-act="vm-show">Reveal answer</button>`}</div>`;}
function vMockEnd(){const n=VM.q.length,p=Math.round(VM.score/(n*2)*100);const m=vMem();m.mocks=(m.mocks||0)+1;save();addXP(Math.max(5,Math.round(VM.score)),"Mock viva");
 const weak=VM.q.filter((_,i)=>VM.res[i]<2);const gr=p>=85?"S":p>=70?"A":p>=50?"B":"C";
 return `<div class="vm-end card"><div class="gend-hero" data-g="proto"><div class="ggrade g${gr}"><b>${gr}</b><span>grade</span></div><div class="gend-main"><span class="eyebrow">Mock viva complete</span><div class="gend-score"><b>${p}%</b><span>${VM.score}/${n*2} points</span></div><p class="gend-msg">${p>=85?"Examiner-ready. Keep it warm with a quick round daily.":p>=70?"Strong. Polish the few you hesitated on.":p>=50?"Getting there — revise the list below and retry.":"Revise the stations below, then try again tomorrow."}</p></div></div>
 ${weak.length?`<h3>Revise these (${weak.length})</h3><ol class="vm-weak">${weak.map(x=>`<li><b>${esc(x.q)}</b><p class="note">${esc(x.a)}</p></li>`).join("")}</ol>`:`<p>Flawless round — every question known. 🎉</p>`}
 <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn pri" data-act="vm-again">↻ Another round</button><a class="btn" href="#viva">Back to Practicals & Viva</a></div></div>`;}
Object.assign(ACT,{
 "v-st":el=>{VST=el.dataset.v;$$(".vstations .vst").forEach(b=>b.classList.toggle("on",b.dataset.v===VST));const sub=vSub(location.hash.slice(6));sub&&vRenderList(sub);},
 "v-f":el=>{VF=el.dataset.v;$$(".vtools .seg button").forEach(b=>b.classList.toggle("on",b.dataset.v===VF));const sub=vSub(location.hash.slice(6));sub&&vRenderList(sub);},
 "v-reveal":el=>{VREVEAL=!VREVEAL;el.textContent=VREVEAL?"Hide all answers":"Show all answers";if(!VREVEAL)VOPEN={};const sub=vSub(location.hash.slice(6));sub&&vRenderList(sub);},
 "v-open":el=>{const id=el.dataset.id,li=el.closest(".vqi"),a=$(".vq-a",li),o=a.hidden;a.hidden=!o;li.classList.toggle("open",o);el.setAttribute("aria-expanded",o);VOPEN[id]=o;},
 "v-rate":el=>{const m=vMem().st,id=el.dataset.id,v=+el.dataset.v,was=m[id];if(was===v)delete m[id];else{m[id]=v;if(v===2&&was!==2)addXP(1,"Viva question known");}save();const li=el.closest(".vqi");li.classList.toggle("known",m[id]===2);li.classList.toggle("rev",m[id]===1);$$(".vq-rate .btn",li).forEach(b=>b.classList.toggle("on",+b.dataset.v===m[id]));},
 "v-mocksub":el=>{VMS=el.dataset.s;},
 "vm-s":el=>{VMS=el.dataset.v;$$(".vm-chips .chip[data-act='vm-s']").forEach(b=>b.classList.toggle("on",b.dataset.v===VMS));},
 "vm-n":el=>{$$(".vm-n").forEach(b=>b.classList.toggle("on",b===el));},
 "vm-go":()=>{const n=+($(".vm-n.on")||{dataset:{v:10}}).dataset.v,weak=$("#vmweak")&&$("#vmweak").checked,m=vMem().st;
  let pool=(VMS==="all"?VIVA:[vSub(VMS)]).flatMap(vAllQ);let first=weak?shuffle(pool.filter(x=>m[x.id]===1)):[];
  const rest=shuffle(pool.filter(x=>!first.includes(x)));VM={q:first.concat(rest).slice(0,n),i:0,score:0,res:[],shown:false};$("#vm").innerHTML=vMockQ();},
 "vm-show":()=>{VM.shown=true;$("#vm").innerHTML=vMockQ();},
 "vm-r":el=>{const v=+el.dataset.v,x=VM.q[VM.i],m=vMem().st;VM.res[VM.i]=v;VM.score+=v;m[x.id]=v===2?2:1;save();VM.i++;VM.shown=false;$("#vm").innerHTML=VM.i<VM.q.length?vMockQ():vMockEnd();window.scrollTo({top:0,behavior:"smooth"});},
 "vm-again":()=>{$("#vm").innerHTML=vMockSetup();}});
function vivaTeaser(){const T=vTotals();return `<a class="vteaser" href="#viva"><span class="vteaser-ic">${VMARK}</span><div><span class="eyebrow">New · Practicals & Viva</span><h2>Viva questions with answers, station by station</h2><p class="muted">${T.n} questions across Pathology, Microbiology, Pharmacology, Community Medicine and FMT — revise offline, then take a mock viva.</p><div class="vteaser-s">${VIVA.map(s=>`<span data-s="${s.s}">${vIco(s.s,13)}${esc(s.name.replace("Forensic Medicine & Toxicology","FMT"))}</span>`).join("")}</div></div><div class="vteaser-r">${vRing(T.pct,72)}<span class="btn pri">Open →</span></div></a>`;}
Object.assign(ROUTES,{viva:vVivaHub,"viva-mock":vVivaMock});VIVA.forEach(s=>{ROUTES["viva-"+s.s]=()=>vVivaSub(s.s);});
