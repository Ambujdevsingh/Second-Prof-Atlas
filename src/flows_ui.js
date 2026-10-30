/* ============ Flowcharts library ============ */
const FLOWMAP={};FLOWS.forEach(f=>FLOWMAP[f.id]=f);
ALLCH.forEach(c=>{FLOWMAP["ch-"+c.id]={id:"ch-"+c.id,s:c.s,ch:c.id,t:c.flow.t,sum:`Chapter revision flowchart for ${c.t}.`,n:c.flow.n,terms:[],exam:"",chapterFlow:true};});
let FL_S="all", FL_KIND="topic", FL_Q="", FL_SEL=0, FL_NODES=[];
/* flatten nodes in reading order; each item {label, exp} */
function flatFlow(nodes){const out=[];const add=x=>{if(typeof x==="string")out.push({label:x,exp:""});else if(Array.isArray(x))out.push({label:x[0],exp:x[1]||""});};
  const walk=n=>{if(typeof n==="string"||Array.isArray(n))add(n);else if(n.k)add(n.k);else if(n.b)n.b.forEach(col=>col.forEach(walk));};nodes.forEach(walk);return out;}
function flowXHTML(nodes){let i=0;
  const lab=x=>typeof x==="string"?x:Array.isArray(x)?x[0]:x;
  const btn=(x,cls)=>{const k=i++;return `<button class="${cls} fnode" data-act="fsel" data-ni="${k}"><span class="fnum">${k+1}</span><span>${esc(lab(x))}</span></button>`;};
  const node=n=>{if(typeof n==="string"||Array.isArray(n))return btn(n,"fbox");if(n.k)return btn(n.k,"fbox key");
    if(n.b)return `<div class="fbranch">${n.b.map(col=>`<div class="fcol">${col.map((x,j)=>(typeof x==="string"||Array.isArray(x))?btn(x,j===0?"fh":"fl"):x.k?btn(x.k,"fl key"):node(x)).join("")}</div>`).join("")}</div>`;return "";};
  return `<div class="flow xflow">${nodes.map(node).join('<div class="arrow" aria-hidden="true"></div>')}</div>`;}

function vFlowcharts(){
  POST=()=>drawFlowList();
  const topicN=FLOWS.length,chN=ALLCH.length;
  return `<header class="stack"><span class="eyebrow">Visual revision</span><h1>Flowcharts</h1><p class="muted">${topicN} topic flowcharts where every step is explained, plus ${chN} chapter revision flowcharts. Tap any step to read what it means; use Walk-through to go step by step.</p></header>
  <section class="card stack"><div class="row"><div class="search" style="max-width:420px">${ico("search",18)}<input id="flq" type="search" placeholder="Search flowcharts: DIC, HIV, RAAS, hanging…" value="${esc(FL_Q)}" aria-label="Search flowcharts"></div>
  <div class="row" role="group" aria-label="Type"><button class="btn sm ${FL_KIND==="topic"?"pri":""}" data-act="fl-kind" data-k="topic">Explained topic flowcharts (${topicN})</button><button class="btn sm ${FL_KIND==="chapter"?"pri":""}" data-act="fl-kind" data-k="chapter">Chapter flowcharts (${chN})</button></div></div>
  <div class="row" role="group" aria-label="Subject"><button class="btn sm ${FL_S==="all"?"pri":""}" data-act="fl-s" data-s="all">All subjects</button>${SUBJECTS.map(s=>`<button class="btn sm ${FL_S===s.id?"pri":""}" data-act="fl-s" data-s="${s.id}" data-s2="${s.id}">${esc(s.name)}</button>`).join("")}</div></section>
  <div id="fllist" class="stack"></div>`;
}
function drawFlowList(){const box=$("#fllist");if(!box)return;const q=FL_Q.toLowerCase();
  const pool=Object.values(FLOWMAP).filter(f=>(FL_KIND==="chapter")===!!f.chapterFlow).filter(f=>FL_S==="all"||f.s===FL_S)
    .filter(f=>!q||(f.t+" "+f.sum+" "+CH[f.ch].t+" "+flatFlow(f.n).map(x=>x.label).join(" ")+" "+(f.terms||[]).map(t=>t[0]).join(" ")).toLowerCase().includes(q));
  if(!pool.length){box.innerHTML=`<p class="note">No flowcharts match "${esc(FL_Q)}". Try another word, or ask Atlas.</p>`;return;}
  box.innerHTML=SUBJECTS.filter(s=>pool.some(f=>f.s===s.id)).map(s=>`<section class="stack" data-s="${s.id}"><div class="row between"><h2 style="color:var(--sc)">${esc(s.name)}</h2><span class="note">${pool.filter(f=>f.s===s.id).length} flowcharts</span></div><div class="grid g3">${pool.filter(f=>f.s===s.id).map(f=>{const c=CH[f.ch];const steps=flatFlow(f.n).length;return `<a class="flcard" href="#fc-${f.id}"><span class="eyebrow" style="color:var(--sc)">${esc(s.short)} ${c.n} · ${esc(c.t)}</span><b>${esc(f.t)}</b><span class="note">${esc(f.sum)}</span><span class="row" style="gap:6px"><span class="chip">${steps} steps</span>${f.chapterFlow?"":'<span class="chip">Every step explained</span>'}${S.flowDone&&S.flowDone[f.id]?'<span class="chip" style="color:var(--good)">✓ Revised</span>':""}</span></a>`;}).join("")}</div></section>`).join("");
}

function vFlow(id){const f=FLOWMAP[id];const c=CH[f.ch],s=SUB[f.s];FL_NODES=flatFlow(f.n);FL_SEL=0;
  const siblings=Object.values(FLOWMAP).filter(x=>x.ch===f.ch&&x.id!==id);
  POST=()=>flSelect(0,false);
  return `<header class="ch-head" data-s="${f.s}"><div class="crumbs"><a href="#flowcharts">Flowcharts</a> / <a href="#s-${f.s}">${esc(s.name)}</a> / <a href="#c-${c.id}">${esc(c.t)}</a></div><h1>${esc(f.t)}</h1><p>${esc(f.sum)}</p>
  <div class="row"><button class="btn sm pri" data-act="fl-walk">▶ Walk-through</button><button class="btn sm" data-act="fl-recall">Recall mode</button><button class="btn sm" data-act="fl-done" data-id="${id}">${S.flowDone&&S.flowDone[id]?"✓ Revised":"Mark as revised (+5 XP)"}</button><a class="btn sm" href="#c-${c.id}">Open chapter</a></div></header>
  <div class="flview" data-s="${f.s}">
    <section class="card stack" style="min-width:0"><div class="row between"><span class="eyebrow">Tap any step</span><span class="note">${FL_NODES.length} steps</span></div><div id="flowbox" class="tablewrap">${flowXHTML(f.n)}</div></section>
    <aside class="card stack flpanel" aria-live="polite"><div class="row between"><span class="eyebrow" id="flstepno"></span><div class="row" style="gap:6px"><button class="btn sm" data-act="fl-prev" aria-label="Previous step">←</button><button class="btn sm" data-act="fl-next" aria-label="Next step">→</button></div></div>
      <h3 id="fllabel"></h3><p id="flexp"></p>
      <div class="row"><button class="btn sm" data-act="fl-ai">Explain this step deeper with AI</button>${stopBtn("flai")}</div><div class="ai-out" id="flai"></div>
      <p class="note kbd-hint">Keys: ← → move between steps</p></aside>
  </div>
  ${(f.terms&&f.terms.length)?`<section class="card stack" data-s="${f.s}"><h2>Key terms</h2><dl class="terms">${f.terms.map(t=>`<div><dt>${esc(t[0])}</dt><dd>${esc(t[1])}</dd></div>`).join("")}</dl></section>`:""}
  ${f.exam?`<section class="card stack"><h2>Exam tip</h2><p>${esc(f.exam)}</p><div class="row"><button class="btn sm" data-act="fl-answer">Write a model answer using this flowchart</button>${stopBtn("flans")}</div><div class="ai-out" id="flans"></div></section>`:""}
  ${siblings.length?`<section class="stack" data-s="${f.s}"><h2>More flowcharts in this chapter</h2><div class="row">${siblings.map(x=>`<a class="chip" href="#fc-${x.id}" style="text-decoration:none;background:var(--ss);color:var(--sc)">${esc(x.t)}</a>`).join("")}</div></section>`:""}`;
}
function flSelect(i,scroll=true){const id=location.hash.slice(4);const f=FLOWMAP[id];if(!f||!FL_NODES.length)return;FL_SEL=(i+FL_NODES.length)%FL_NODES.length;const n=FL_NODES[FL_SEL];
  $$(".fnode").forEach(b=>{const on=+b.dataset.ni===FL_SEL;b.classList.toggle("sel",on);if(on){b.classList.add("shown");b.setAttribute("aria-current","step");}else b.removeAttribute("aria-current");});
  $("#flstepno").textContent=`Step ${FL_SEL+1} of ${FL_NODES.length}`;$("#fllabel").textContent=n.label;
  $("#flexp").innerHTML=n.exp?esc(n.exp):`<span class="note">This is a chapter revision flowchart. Tap <b>Explain this step deeper with AI</b> for a full explanation, or open the chapter's Learn tab for the notes.</span>`;
  $("#flai").innerHTML="";
  if(scroll){const b=$(`.fnode[data-ni="${FL_SEL}"]`);b&&b.scrollIntoView({block:"nearest",inline:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}}
let FL_WALK=null;
Object.assign(ACT,{
 "fl-s":el=>{FL_S=el.dataset.s;route();},
 "fl-kind":el=>{FL_KIND=el.dataset.k;route();},
 fsel:el=>flSelect(+el.dataset.ni),
 "fl-next":()=>flSelect(FL_SEL+1),
 "fl-prev":()=>flSelect(FL_SEL-1),
 "fl-recall":el=>{const f=$("#flowbox .flow");const on=f.classList.toggle("recall");$$(".fnode").forEach(x=>x.classList.remove("shown"));el.textContent=on?"Show all":"Recall mode";if(on)toast("Say each step aloud, then tap it to reveal");},
 "fl-walk":el=>{if(FL_WALK){clearInterval(FL_WALK);FL_WALK=null;el.textContent="▶ Walk-through";return;}el.textContent="⏸ Pause";flSelect(0);FL_WALK=setInterval(()=>{if(!$("#flowbox")||FL_SEL>=FL_NODES.length-1){clearInterval(FL_WALK);FL_WALK=null;const b=$('[data-act="fl-walk"]');if(b)b.textContent="▶ Walk-through";return;}flSelect(FL_SEL+1);},6000);},
 "fl-done":el=>{const id=el.dataset.id;S.flowDone=S.flowDone||{};if(S.flowDone[id])return;S.flowDone[id]=today();save();addXP(5,"flowchart revised");el.textContent="✓ Revised";},
 "fl-ai":()=>{const f=FLOWMAP[location.hash.slice(4)],n=FL_NODES[FL_SEL];const seq=FL_NODES.map((x,i)=>`${i+1}. ${x.label}`).join("\n");
   aiStream($("#flai"),`${RULES()}${ctx(CH[f.ch])}\n\nThe student is studying the flowchart "${f.t}". Steps:\n${seq}\n\nExplain step ${FL_SEL+1} ("${n.label}") in depth: what it means, the mechanism, why it follows the previous step and leads to the next, one clinical or exam example, and one memory hook. Under 220 words.`,{key:"flai"});},
 "fl-answer":()=>{const f=FLOWMAP[location.hash.slice(4)];const seq=FL_NODES.map((x,i)=>`${i+1}. ${x.label}${x.exp?" — "+x.exp:""}`).join("\n");
   aiStream($("#flans"),`${RULES()}${ctx(CH[f.ch])}\n\nWrite a model university exam answer on "${f.t}" built around this flowchart. Steps:\n${seq}\nInclude: definition/introduction, the flowchart reproduced in text with arrows, explanation of each step, key terms, and a conclusion. Exam tip from the teacher: ${f.exam}`,{key:"flans"});}
});
document.addEventListener("input",e=>{if(e.target.id==="flq"){FL_Q=e.target.value;drawFlowList();}});
document.addEventListener("keydown",e=>{if(!location.hash.startsWith("#fc-")||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;if(e.key==="ArrowRight"){e.preventDefault();flSelect(FL_SEL+1);}if(e.key==="ArrowLeft"){e.preventDefault();flSelect(FL_SEL-1);}});
