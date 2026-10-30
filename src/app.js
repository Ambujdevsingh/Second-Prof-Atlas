/* ============ core helpers ============ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const SUB=Object.fromEntries(SUBJECTS.map(s=>[s.id,s]));
const CH={}; SUBJECTS.forEach(s=>s.chapters.forEach((c,i)=>{c.s=s.id; c.n=i+1; CH[c.id]=c;}));
const ALLCH=SUBJECTS.flatMap(s=>s.chapters);
const EXAM_SUBJ=["path","micro","pharm"];
const pad=n=>String(n).padStart(2,"0");
const dstr=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>dstr(new Date());
const starSum=c=>c.topics.reduce((a,t)=>a+t[1],0);
const heatOf=c=>Math.max(1,Math.min(5,Math.ceil(starSum(c)/5)));
const starsHTML=n=>`<span class="stars" aria-label="${n} of 5 stars">${"★".repeat(n)}<i>${"★".repeat(5-n)}</i></span>`;
const TYPE={L:"LAQ",S:"SN",D:"DIFF"};
const tagHTML=t=>t&&TYPE[t]?`<span class="tag ${t}">${TYPE[t]}</span>`:"";
const nmc=t=>t[3]==="N"?'<span class="tag N" title="Added from the NMC CBME syllabus">NMC</span>':"";
const hy=s=>{const [q,a]=s.split("::");return {q,a};};

/* ============ state (per-viewer, this browser only) ============ */
const KEY="secondprofatlas_v1";
const defState=()=>({xp:0,streak:0,last:null,done:{},quiz:{},known:{},custom:{},plan:null,lang:"en",hist:[],lastCh:null,daily:null,read:{},saved:[],fs:100,seen:false,flowDone:{},bm:[],mybooks:[]});
let S=(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v)return Object.assign(defState(),v);}catch(e){}return defState();})();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const LEVELS=[[0,"Fresher"],[100,"Ward Explorer"],[300,"Slide Reader"],[700,"Viva Ready"],[1200,"Prof Warrior"],[2000,"Topper Track"],[3500,"Gold Medal Mode"]];
function level(){let i=0;LEVELS.forEach((l,k)=>{if(S.xp>=l[0])i=k;});const cur=LEVELS[i],nx=LEVELS[i+1];return {name:cur[1],idx:i,next:nx?nx[0]:null,pct:nx?Math.round((S.xp-cur[0])/(nx[0]-cur[0])*100):100};}
function touchStreak(){const t=today();if(S.last===t)return;const y=new Date();y.setDate(y.getDate()-1);S.streak=(S.last===dstr(y))?S.streak+1:1;S.last=t;}
function addXP(n,why){S.xp+=n;touchStreak();save();toast(`+${n} XP · ${why}`);renderSide();}
let toastT;function toast(m){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");document.body.appendChild(t);}t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2200);}

/* ============ icons ============ */
const IC={
home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/>',
map:'<path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
chat:'<path d="M4 5h16v11H9l-5 4z"/>',
bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
cards:'<rect x="3" y="7" width="14" height="12" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v10"/>',
timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
focus:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
flow:'<rect x="8" y="2" width="8" height="5" rx="1"/><rect x="2" y="17" width="8" height="5" rx="1"/><rect x="14" y="17" width="8" height="5" rx="1"/><path d="M12 7v5M6 17v-3h12v3"/>'
};
const ico=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||""}</svg>`;

/* ============ AI (Claude via the artifact's sample capability) ============ */
let SAMPLE=null, WEBAI=false, AISTATE="checking";
const IN_CLAUDE=!!(window.claude&&typeof window.claude.use==="function");
const AI_URL=window.ATLAS_AI_URL||"/api/ai";
(async()=>{
  if(IN_CLAUDE){try{SAMPLE=await window.claude.use("sample");}catch(e){SAMPLE=null;}}
  else if(/^https?:$/.test(location.protocol)){try{const r=await fetch(AI_URL,{cache:"no-store"});if(r.ok){const j=await r.json();WEBAI=!!j.ok;}}catch(e){WEBAI=false;}}
  AISTATE=(SAMPLE||WEBAI)?"ready":"off";$$(".aibadge").forEach(b=>b.outerHTML=aiBadge());
})();
/* one call path for both hosts: Claude app (sample) or a website (/api/ai) */
async function blobB64(b){const buf=new Uint8Array(await b.arrayBuffer());let s="";for(let i=0;i<buf.length;i+=32768)s+=String.fromCharCode.apply(null,buf.subarray(i,i+32768));return btoa(s);}
async function callAI(input,{signal,onText,tier,chat,images}={}){
  if(SAMPLE){const o={signal};if(onText)o.onText=onText;if(tier)o.modelTier=tier;if(chat||images)o.cache=false;if(images)o.images=images;return SAMPLE(input,o);}
  const messages=typeof input==="string"?[{role:"user",content:input}]:input;
  const imgs=images?await Promise.all(images.map(async b=>({media_type:b.type||"image/jpeg",data:await blobB64(b)}))):undefined;
  let r;try{r=await fetch(AI_URL,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages,images:imgs}),signal});}
  catch(e){throw {code:signal&&signal.aborted?"cancelled":"upstream_error"};}
  if(!r.ok)throw {code:r.status===429?"rate_limited":r.status===413?"prompt_too_large":"upstream_error"};
  const rd=r.body.getReader(),dec=new TextDecoder();let text="";
  try{for(;;){const {done,value}=await rd.read();if(done)break;const d=dec.decode(value,{stream:true});if(d){text+=d;onText&&onText({text,delta:d});}}}
  catch(e){throw {code:signal&&signal.aborted?"cancelled":"upstream_error",text};}
  if(!text.trim())throw {code:"empty_completion"};
  return {text,truncated:false};
}
function parseJSONish(t){try{return JSON.parse(t);}catch(e){}const f=t.match(/```(?:json)?\s*([\s\S]*?)```/);if(f){try{return JSON.parse(f[1]);}catch(e){}}const a=t.search(/[\[{]/),b=Math.max(t.lastIndexOf("]"),t.lastIndexOf("}"));if(a>=0&&b>a){try{return JSON.parse(t.slice(a,b+1));}catch(e){}}throw {code:"invalid_json",text:t};}
const aiBadge=()=>AISTATE==="ready"?'<span class="aibadge">● AI tutor connected</span>':AISTATE==="checking"?'<span class="aibadge off">Connecting AI…</span>':`<span class="aibadge off">${IN_CLAUDE?"AI needs permission":"AI not set up"}</span>`;
const RULES=()=>`You are "Atlas", a warm, precise MBBS tutor for Indian Phase II (2nd Professional) students preparing for university exams at Era's Lucknow Medical College (Era University, CBME curriculum). Subjects: Pathology, Microbiology, Pharmacology, plus Community Medicine and Forensic Medicine & Toxicology.
Ground every answer in the CHAPTER NOTES given (they are the app's book content). Where you go beyond them, rely only on standard textbooks (Robbins, Harsh Mohan, Ananthanarayan & Paniker, Apurba Sastry, KD Tripathi, Park, Narayan Reddy) and current Indian national guidelines (NTEP, NCVBDC, UIP, BNS/BNSS/BSA). If you are unsure of a fact, say so instead of guessing.
Style: short headings, bullet points, **bold** key terms, a mnemonic or flow (A → B → C) when it helps, and an "Exam tip" line on how to write it in the paper (LAQ / short note / viva). ${S.lang==="hinglish"?"Write in friendly Hinglish (Hindi-English mix in Roman script); keep all medical terms in English.":"Write in clear, simple English."} Use markdown; no HTML.`;
function ctx(c){if(!c)return"";const s=SUB[c.s];return `\n\nCHAPTER NOTES — ${s.name} › ${c.t} (${c.paper})\nExam-priority topics: ${c.topics.map(t=>`${t[0]}${t[1]?` [${t[1]}★]`:""}${t[2]?` (${TYPE[t[2]]})`:""}`).join("; ")}\nKey concepts:\n${c.core.map(x=>"- "+x).join("\n")}\nHigh-yield facts:\n${c.hy.map(x=>{const h=hy(x);return "- "+h.q+" — "+h.a;}).join("\n")}`;}
const thinking=(m="Thinking")=>`<span class="thinking"><i></i><i></i><i></i> ${m}…</span>`;
const offMsg=()=>AISTATE==="checking"?`<p>Connecting to the AI tutor… try again in a few seconds.</p>`:IN_CLAUDE?`<p><b>AI features run on your own Claude account.</b> Choose <b>Allow</b> when this page asks to use Claude. Chapters, flowcharts, flashcards, quizzes, the question bank and the study planner all work without AI.</p>`:`<p><b>The AI tutor is not switched on for this website yet.</b> Everything else works: chapters, flowcharts, flashcards, quizzes, mock tests from the question bank and the study planner.</p>`;
const CTL={};
function errMsg(e){switch(e&&e.code){case"cancelled":return"";case"not_granted":case"sampling_disabled":case"not_declared":case"capability_disabled":case"capability_removed":return"AI is not allowed for this page right now. Allow Claude for this page to use the AI tools.";case"images_unavailable":return"Reading page images is not available in this view. Ask the AI Tutor about the topic instead.";case"image_rejected":return"That page image could not be read. Try zooming out or another page.";case"rate_limited":return"Too many AI requests at once. Wait a minute, then try again.";case"session_expired":return"Your Claude session expired. Sign in again, then retry.";case"refused":return"Claude could not answer that. Rephrase the question and try again.";case"prompt_too_large":return"That request is too long. Pick fewer chapters or a shorter question.";case"invalid_json":return"The answer came back in an unexpected format. Press the button again.";case"empty_completion":return"No answer came back. Try a simpler request.";default:return"Connection problem while answering. Press the button again.";}}
async function aiStream(out,input,{key="main",tier,chat=false,images}={}){
  if(!SAMPLE&&!WEBAI){out.innerHTML=offMsg();return null;}
  CTL[key]?.abort();const ctl=new AbortController();CTL[key]=ctl;
  out.innerHTML=thinking();showStop(key,true);
  try{const r=await callAI(input,{signal:ctl.signal,tier,chat,images,onText:({text})=>{out.innerHTML=md(text);}});out.innerHTML=md(r.text)+(r.truncated?'<p class="note">The answer was cut short. Ask for a smaller part.</p>':"");return r.text;}
  catch(e){if(e&&e.code==="refused")out.innerHTML="";else out.innerHTML=e&&e.text?md(e.text):"";const m=errMsg(e);if(m)out.insertAdjacentHTML("beforeend",`<p class="notice">${esc(m)}</p>`);return null;}
  finally{showStop(key,false);}
}
async function aiJSON(out,input,{key="json",tier}={}){
  if(!SAMPLE&&!WEBAI){out.innerHTML=offMsg();return null;}
  CTL[key]?.abort();const ctl=new AbortController();CTL[key]=ctl;
  out.innerHTML=thinking("Preparing");showStop(key,true);
  try{let v;if(SAMPLE){const opts={signal:ctl.signal,cache:false};if(tier)opts.modelTier=tier;v=await SAMPLE.json(input,opts);}else{const r=await callAI(input+"\n\nReply with the JSON value only, no prose.",{signal:ctl.signal});v=parseJSONish(r.text);}out.innerHTML="";return v;}
  catch(e){const m=errMsg(e);out.innerHTML=m?`<p class="notice">${esc(m)}</p>`:"";return null;}
  finally{showStop(key,false);}
}
function showStop(key,on){$$(`[data-stop="${key}"]`).forEach(b=>b.hidden=!on);}
const stopBtn=key=>`<button class="btn sm" data-act="stop" data-stop="${key}" hidden>Stop</button>`;
function md(src){
  const lines=esc(src).split(/\r?\n/);let html="",list=null,para=[],tbl=[];
  const inl=s=>s.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g,"$1<em>$2</em>");
  const fP=()=>{if(para.length){html+="<p>"+inl(para.join(" "))+"</p>";para=[];}};
  const fL=()=>{if(list){html+=`<${list.t}>${list.items.map(i=>"<li>"+inl(i)+"</li>").join("")}</${list.t}>`;list=null;}};
  const fT=()=>{if(tbl.length){const rows=tbl.filter(r=>!/^\|?[\s:|-]+\|?$/.test(r)).map(r=>r.replace(/^\|/,"").replace(/\|$/,"").split("|").map(c=>inl(c.trim())));html+='<div class="tbl"><table>'+rows.map((r,i)=>"<tr>"+r.map(c=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")+"</tr>").join("")+"</table></div>";tbl=[];}};
  for(const raw of lines){const l=raw.trim();let m;
    if(l.startsWith("|")){fP();fL();tbl.push(l);continue;}else fT();
    if(!l){fP();fL();continue;}
    if((m=l.match(/^(#{1,4})\s+(.*)/))){fP();fL();const n=Math.min(4,m[1].length+1);html+=`<h${n}>${inl(m[2])}</h${n}>`;continue;}
    if((m=l.match(/^[-*•]\s+(.*)/))){fP();if(!list||list.t!=="ul"){fL();list={t:"ul",items:[]};}list.items.push(m[1]);continue;}
    if((m=l.match(/^\d+[.)]\s+(.*)/))){fP();if(!list||list.t!=="ol"){fL();list={t:"ol",items:[]};}list.items.push(m[1]);continue;}
    if(/^(-{3,}|\*{3,})$/.test(l)){fP();fL();html+="<hr>";continue;}
    fL();para.push(l);}
  fP();fL();fT();return html;
}

/* ============ shared UI bits ============ */
function chSelect(id,{all=false,subj=null,sel=""}={}){
  const groups=SUBJECTS.filter(s=>!subj||s.id===subj).map(s=>`<optgroup label="${esc(s.name)}">${s.chapters.map(c=>`<option value="${c.id}" ${c.id===sel?"selected":""}>${esc(s.short)} ${c.n}. ${esc(c.t)}</option>`).join("")}</optgroup>`).join("");
  return `<select id="${id}">${all?'<option value="">Any chapter (general)</option>':""}${groups}</select>`;
}
const langToggle=()=>`<div class="row"><span class="note">Answer language</span><select id="langSel" data-act-change="lang" aria-label="Answer language"><option value="en" ${S.lang==="en"?"selected":""}>English</option><option value="hinglish" ${S.lang==="hinglish"?"selected":""}>Hinglish</option></select></div>`;
function chDone(id){return !!S.done[id];}
function subjPct(sid){const ch=SUB[sid].chapters;return Math.round(ch.filter(c=>chDone(c.id)).length/ch.length*100);}
function bankQs(ids){return ids.flatMap(id=>CH[id].mcq.map(m=>({q:m[0],o:m[1],a:m[2],e:m[3],ch:id})));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function hashStr(s){let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h);}

/* ============ flowchart ============ */
function flowHTML(nodes){return `<div class="flow">${nodes.map(nodeHTML).join('<div class="arrow" aria-hidden="true"></div>')}</div>`;}
function nodeHTML(n){
  if(typeof n==="string")return `<div class="fbox">${esc(n)}</div>`;
  if(n.k)return `<div class="fbox key">${esc(n.k)}</div>`;
  if(n.b)return `<div class="fbranch">${n.b.map(col=>`<div class="fcol">${col.map((x,i)=>typeof x==="string"?`<div class="${i===0?"fh":"fl"}">${esc(x)}</div>`:(x.b?nodeHTML(x):`<div class="fl"><b>${esc(x.k)}</b></div>`)).join("")}</div>`).join("")}</div>`;
  return "";
}

/* ============ quiz engine ============ */
let QUIZ_TIMER=null, LASTQ=null;
const PRAISE=["Spot on!","Correct — nice!","Yes! Textbook answer.","Nailed it.","Right, keep going!"];
function runQuiz(box,qs,{timed=0,title="Quiz",onDone,onAnswer}={}){
  clearInterval(QUIZ_TIMER);let i=0,score=0;const ans=[];let left=timed*qs.length;
  const fmt=s=>`${Math.floor(s/60)}:${pad(s%60)}`;
  if(timed){QUIZ_TIMER=setInterval(()=>{left--;const el=$(".timer",box);if(el)el.textContent="⏱ "+fmt(Math.max(0,left));if(left<=0){clearInterval(QUIZ_TIMER);finish();}},1000);}
  function show(){const q=qs[i];
    box.innerHTML=`<div class="card q"><div class="row between"><span class="eyebrow">${esc(title)} · Q${i+1} of ${qs.length}${q.ch&&CH[q.ch]?" · "+esc(SUB[CH[q.ch].s].short+" "+CH[q.ch].n):""}</span>${timed?`<span class="timer">⏱ ${fmt(left)}</span>`:""}</div>
    <div class="bar" aria-hidden="true"><i style="width:${Math.round(i/qs.length*100)}%"></i></div>
    <h3>${esc(q.q)}</h3><p class="note kbd-hint">Tip: press 1–4 to answer, Enter for next.</p><div class="stack">${q.o.map((o,k)=>`<button class="opt" data-k="${k}"><b>${"ABCD"[k]}</b><span>${esc(o)}</span></button>`).join("")}</div><div class="fb" aria-live="polite"></div></div>`;
    $$(".opt",box).forEach(b=>b.onclick=()=>pick(+b.dataset.k));}
  function pick(k){if(ans[i]!=null)return;ans[i]=k;const q=qs[i],ok=k===q.a;if(ok)score++;if(onAnswer)onAnswer(q,ok);
    $$(".opt",box).forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add("right");else if(j===k)b.classList.add("wrong");});
    $(".fb",box).innerHTML=`<div class="explain"><b>${ok?PRAISE[i%PRAISE.length]:"Not quite."}</b> ${esc(q.e||"")}</div><div class="row" style="margin-top:12px"><button class="btn pri" id="qnext">${i<qs.length-1?"Next question":"See results"}</button></div>`;
    $("#qnext",box).onclick=()=>{i++;i<qs.length?show():finish();};$("#qnext",box).focus();}
  function finish(){clearInterval(QUIZ_TIMER);
    const pct=Math.round(score/qs.length*100);const per={};
    qs.forEach((q,k)=>{if(!q.ch)return;per[q.ch]=per[q.ch]||[0,0];per[q.ch][1]++;if(ans[k]===q.a)per[q.ch][0]++;});
    Object.entries(per).forEach(([id,[r,t]])=>{const p=Math.round(r/t*100);const o=S.quiz[id]||{best:0,last:0,n:0};S.quiz[id]={best:Math.max(o.best,p),last:p,n:o.n+1};});
    LASTQ={qs,ans};S.hist.unshift({d:today(),title,score,total:qs.length});S.hist=S.hist.slice(0,30);save();
    if(score)addXP(score*10,`${score} correct`);else save();
    box.innerHTML=`<div class="card stack"><div class="row between"><div><span class="eyebrow">${esc(title)} · result</span><div class="score">${score}/${qs.length}</div><p class="muted">${pct>=80?"Excellent — exam ready on this set.":pct>=50?"Good base. Revise the misses below.":"Revisit the concepts and flowchart, then try again."}</p></div><div class="ring" style="--p:${pct}"><span>${pct}%</span></div></div>
    <details ${pct<100?"open":""}><summary><b>Review answers</b></summary><div class="stack" style="margin-top:10px">${qs.map((q,k)=>`<div class="explain"><b>${ans[k]===q.a?"✓":"✗"} ${esc(q.q)}</b><br>Answer: ${esc(q.o[q.a])}${ans[k]!=null&&ans[k]!==q.a?` · You chose: ${esc(q.o[ans[k]])}`:ans[k]==null?" · Not answered":""}<br><span class="muted">${esc(q.e||"")}</span>${ans[k]!==q.a?`<div class="row" style="margin-top:6px"><button class="btn sm" data-act="q-explain" data-i="${k}">Explain this with AI</button></div><div class="ai-out" id="qx${k}"></div>`:""}</div>`).join("")}</div></details>
    <div class="row"><button class="btn pri" id="qagain">Try again</button>${onDone?'<button class="btn" id="qback">Back</button>':""}</div></div>`;
    $("#qagain",box).onclick=()=>runQuiz(box,shuffle(qs),{timed,title,onDone,onAnswer});if(onDone)$("#qback",box).onclick=onDone;
    if(pct===100)confetti();}
  show();
}
function normQs(v,fallbackCh){if(!Array.isArray(v))return[];return v.filter(x=>x&&typeof x.q==="string"&&Array.isArray(x.o)&&x.o.length===4&&Number.isInteger(+x.a)&&+x.a>=0&&+x.a<4).map(x=>({q:x.q,o:x.o.map(String),a:+x.a,e:String(x.e||""),ch:CH[x.ch]?x.ch:fallbackCh}));}
const mcqPrompt=(n,ids,extra="")=>`${RULES()}\n\nWrite ${n} NEW single-best-answer MCQs in Indian university/NEET-PG style for the chapters below. Mix recall, applied and clinical-vignette questions; plausible distractors; no "all of the above".${extra}\nReply with only a JSON array; each item: {"q": string, "o": [4 option strings], "a": index 0-3 of the correct option, "e": one-sentence explanation, "ch": chapter id}. Example: [{"q":"...","o":["a","b","c","d"],"a":2,"e":"...","ch":"${ids[0]}"}]\nChapter ids: ${ids.join(", ")}${ids.map(id=>ctx(CH[id])).join("").slice(0,60000)}`;

/* ============ flashcard deck ============ */
function deckHTML(){return `<div class="deck"><button class="fcard" id="fc" aria-label="Flashcard, press to flip"><div class="in"><div class="face front"></div><div class="face back"></div></div></button><p class="note" id="fcmeta"></p><p class="note kbd-hint">Keys: Space flip · ← → move · K got it</p><div class="row" style="justify-content:center"><button class="btn" id="fcprev">← Prev</button><button class="btn" id="fcagain">Again</button><button class="btn pri" id="fcgot">Got it ✓</button><button class="btn" id="fcnext">Next →</button><button class="btn ghost" id="fcshuf">Shuffle</button></div></div>`;}
function runDeck(root,cards,{chId=null}={}){
  let order=cards.map((_,i)=>i),i=0;const known=new Set(chId?(S.known[chId]||[]):[]);
  const card=$("#fc",root);
  function show(){const c=cards[order[i]];card.classList.remove("flip");$(".front",card).innerHTML=`<span class="eyebrow">Question</span>${esc(c.q)}<span class="note">Tap to reveal</span>`;$(".back",card).innerHTML=`<span class="eyebrow">Answer</span>${esc(c.a)}`;$("#fcmeta",root).textContent=`Card ${i+1} of ${cards.length}${chId?` · ${known.size} marked known`:""}${known.has(order[i])?" · known ✓":""}`;}
  card.onclick=()=>card.classList.toggle("flip");
  $("#fcnext",root).onclick=()=>{i=(i+1)%cards.length;show();};
  $("#fcprev",root).onclick=()=>{i=(i-1+cards.length)%cards.length;show();};
  $("#fcagain",root).onclick=()=>{const cur=order.splice(i,1)[0];order.splice(Math.min(order.length,i+3),0,cur);show();};
  $("#fcgot",root).onclick=()=>{if(chId&&!known.has(order[i])){known.add(order[i]);S.known[chId]=[...known];addXP(2,"card mastered");}i=(i+1)%cards.length;show();};
  $("#fcshuf",root).onclick=()=>{order=shuffle(order);i=0;show();};
  show();
}
function chCards(c){return [...c.hy,...(S.custom[c.id]||[])].map(hy);}

/* ============ confetti ============ */
function confetti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const cv=document.createElement("canvas");cv.id="confetti";document.body.appendChild(cv);const x=cv.getContext("2d");cv.width=innerWidth;cv.height=innerHeight;const cs=getComputedStyle(document.documentElement);const cols=["--path","--micro","--pharm","--cm","--fmt","--star"].map(v=>cs.getPropertyValue(v).trim());const P=Array.from({length:140},()=>({x:cv.width/2,y:cv.height/3,vx:(Math.random()-.5)*12,vy:Math.random()*-12-2,c:cols[Math.floor(Math.random()*cols.length)],r:Math.random()*6+3,a:Math.random()*6}));let f=0;(function step(){x.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);x.restore();});if(++f<120)requestAnimationFrame(step);else cv.remove();})();}

/* ============ layout ============ */
const NAV=[["home","Home","home"],["subjects","Subjects","book"],["radar","Exam Radar","radar"],["roadmap","Roadmap","map"],["flowcharts","Flowcharts","flow"],["notes","Notes & Books","doc"],["studio","AI Studio","spark"],["planner","Study Planner","cal"],["saved","Revision List","bookmark"],["progress","My Progress","chart"]];
function renderSide(){
  const L=level();
  $("#side").innerHTML=`<a class="brand" href="#home"><span class="brand-mark">II</span><span><b>Second Prof Atlas</b><small>MBBS Phase II · Lucknow</small></span></a>
  <nav class="nav" aria-label="Main">${NAV.map(n=>`<a href="#${n[0]}" data-nav="${n[0]}">${ico(n[2],18)}${n[1]}</a>`).join("")}
  <span class="grp mono">Subjects</span>${SUBJECTS.map(s=>`<a href="#s-${s.id}" data-nav="s-${s.id}" data-s="${s.id}"><span class="dot" style="background:var(--sc)"></span>${esc(s.name)}</a>`).join("")}</nav>
  <div class="xpcard"><div class="row between"><b>${esc(L.name)}</b><span class="mono">${S.xp} XP</span></div><div class="bar"><i style="width:${L.pct}%"></i></div><span class="note">${L.next?`${L.next-S.xp} XP to next level`:"Top level reached"} · 🔥 ${S.streak}-day streak</span></div>`;
  $("#tabbar").innerHTML=[["home","Home","home"],["subjects","Learn","book"],["flowcharts","Flows","flow"],["studio","AI","spark"]].map(n=>`<a href="#${n[0]}" data-nav="${n[0]}">${ico(n[2],22)}${n[1]}</a>`).join("")+`<button type="button" class="tabmore" data-act="sheet" aria-haspopup="dialog">${ico("list",22)}More</button>`;
  let sh=$("#sheet");if(!sh){document.body.insertAdjacentHTML("beforeend",'<div id="sheet" hidden><div class="sheet-in" role="dialog" aria-label="All sections"></div></div>');sh=$("#sheet");}
  $(".sheet-in",sh).innerHTML=`<div class="row between"><b>All sections</b><button class="btn sm ghost" data-act="sheet" aria-label="Close">✕</button></div><div class="sheet-grid">${NAV.map(n=>`<a href="#${n[0]}" data-act="sheet-go">${ico(n[2],20)}<span>${n[1]}</span></a>`).join("")}${SUBJECTS.map(x=>`<a href="#s-${x.id}" data-act="sheet-go" data-s="${x.id}"><span class="dot" style="background:var(--sc)"></span><span>${esc(x.name)}</span></a>`).join("")}</div>`;
  markNav();
}
function markNav(){const h=(location.hash||"#home").slice(1)||"home";const inTab=a=>!!a.closest("#tabbar");
  const chS=h.startsWith("c-")&&CH[h.slice(2)]?"s-"+CH[h.slice(2)].s:null;
  const isTool=TOOLS.some(t=>t[0]===h);
  $$("[data-nav]").forEach(a=>{const n=a.dataset.nav;let on=n===h;
    if(!on&&n===chS&&!inTab(a))on=true;
    if(!on&&inTab(a)&&n==="subjects"&&(h.startsWith("c-")||h.startsWith("s-")))on=true;
    if(!on&&n==="studio"&&isTool&&(h!=="planner"||inTab(a)))on=true;
    if(!on&&n==="flowcharts"&&h.startsWith("fc-"))on=true;
    if(!on&&n==="notes"&&h.startsWith("read-"))on=true;
    a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});}
const topbar=()=>`<div class="topbar"><div class="search">${ico("search",18)}<input id="q" type="search" placeholder="Search topics: DIC, Widal, β-blockers, hanging…" autocomplete="off" aria-label="Search topics"><div class="results" id="qres" hidden></div></div><span class="streak">🔥 ${S.streak} · ${S.xp} XP</span><button class="btn sm" id="focusbtn" data-act="focus" title="25-minute focus session (+15 XP)">${ico("focus",16)}<span id="focustxt">${FOCUS.end?fmtLeft():"Focus 25:00"}</span></button><span class="fsctl" role="group" aria-label="Text size"><button class="btn sm" data-act="fs" data-d="-10" aria-label="Smaller text">A−</button><button class="btn sm" data-act="fs" data-d="10" aria-label="Larger text">A+</button></span>${aiBadge()}</div>`;

/* ============ views ============ */
let POST=null, CHTAB="learn", RADAR_S="path", RADAR_T="all", MOCK_S="path";
const TOOLS=[
 ["tutor","AI Tutor","Ask anything; answers grounded in the chapter notes.","chat"],
 ["simplify","Simplify Concept","Turn a tough topic into plain language with an analogy.","bulb"],
 ["qgen","Question Generator","MCQs, short notes, long answers, viva and case questions.","list"],
 ["summary","Smart Summary","One-page, 10-point or night-before summaries.","doc"],
 ["cards","Flashcard Generator","Make revision cards from any chapter or topic.","cards"],
 ["mock","Mock Test","Timed tests from the chapters you pick.","timer"],
 ["coach","Personalised Learning","See weak areas and what to study next.","target"],
 ["voice","Voice Tutor","Speak your question; hear the answer read aloud.","mic"],
 ["planner","Study Planner","Daily and weekly plans up to your exam date.","cal"],
 ["doubt","Doubt Resolution","Step-by-step explanation of any doubt or MCQ.","help"]];

function vHome(){
  const L=level();const h=new Date().getHours();const greet=h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const done=Object.keys(S.done).length;const last=S.lastCh&&CH[S.lastCh];
  const top=EXAM_SUBJ.flatMap(sid=>SUB[sid].chapters.flatMap(c=>c.topics.filter(t=>t[1]>=5).map(t=>({t,c})))).slice(0,400);
  const pick=shuffle(top).slice(0,8);
  const todayPlan=planToday();
  POST=()=>{const bank=bankQs(ALLCH.map(c=>c.id));const q=bank[hashStr(today())%bank.length];runQuiz($("#daily"),[q],{title:"Daily dose"});};
  return `<section class="hero"><div class="hero-main"><svg class="cells" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2">${Array.from({length:14},(_,k)=>{const x=(k*67)%400,y=(k*41)%200,r=14+(k*7)%22;return `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x+3}" cy="${y-2}" r="${r/3}" fill="currentColor" opacity=".5"/>`;}).join("")}</g></svg>
    <span class="mono">${greet}, Doctor</span><h1>Second Prof, mapped chapter by chapter.</h1>
    <p>Pathology, Microbiology and Pharmacology for your Phase II university exam, plus Community Medicine and FMT foundations. Priorities come from your seniors' past-paper lists.</p>
    <div class="row">${last?`<a class="btn" href="#c-${last.id}">Continue: ${esc(SUB[last.s].short)} ${last.n}. ${esc(last.t)}</a>`:`<a class="btn" href="#s-path">Start with Pathology</a>`}<a class="btn ghost" href="#planner">Plan my study</a></div>
    <div class="row"><span class="chip" style="background:var(--surface);border:1px solid var(--line)">${done}/${ALLCH.length} chapters done</span><span class="chip" style="background:var(--surface);border:1px solid var(--line)">${esc(L.name)} · ${S.xp} XP</span><span class="chip" style="background:var(--surface);border:1px solid var(--line)">🔥 ${S.streak}-day streak</span></div></div>
    <div class="stack"><div class="row between"><h2>Daily dose</h2><span class="note">One question a day</span></div><div id="daily"></div></div></section>
  ${S.seen?"":`<section class="card onboard stack"><div class="row between"><h2>Start here in 3 steps</h2><button class="btn sm ghost" data-act="seen">Got it, hide</button></div><div class="grid g3"><a class="step" href="#subjects"><b>1 · Pick a chapter</b><span class="note">Read the Learn tab and tick each concept as you understand it.</span></a><a class="step" href="#s-path"><b>2 · Revise with flowcharts</b><span class="note">Use Recall mode, then flip the flashcards. Press ☆ on any topic to save it.</span></a><a class="step" href="#planner"><b>3 · Test and plan</b><span class="note">Take the quiz, build your study plan, and ask Atlas (bottom-right button) anytime.</span></a></div></section>`}
  <section class="card stack"><div class="row between"><h2>Today's plan</h2><a class="btn sm" href="#planner">${S.plan?"Open planner":"Build a plan"}</a></div>${todayPlan}</section>
  <section class="stack"><div class="row between"><h2>Your subjects</h2><a class="btn sm ghost" href="#subjects">All subjects →</a></div><div class="grid g5">${SUBJECTS.map(subjTile).join("")}</div></section>
  <section class="card stack"><div class="row between"><h2>Exam radar: five-star topics</h2><a class="btn sm" href="#radar">Full radar →</a></div><p class="note">Topics your seniors marked as most repeated in past papers. A fresh set each visit.</p><div>${pick.map(({t,c})=>`<a class="topic" href="#c-${c.id}" style="text-decoration:none" data-s="${c.s}"><span>${starsHTML(t[1])} ${tagHTML(t[2])} <b>${esc(t[0])}</b><br><span class="note">${esc(SUB[c.s].name)} · ${esc(c.t)}</span></span><span class="btn sm">Study</span></a>`).join("")}</div></section>
  <section class="stack"><div class="row between"><h2>AI Studio</h2>${aiBadge()}</div><div class="grid g5">${TOOLS.map(toolTile).join("")}</div></section>`;
}
const subjTile=s=>{const p=subjPct(s.id);return `<a class="subj" href="#s-${s.id}" data-s="${s.id}"><span class="mono" style="color:var(--sc);position:relative">${s.std?"Taught now · exam in Phase III":"Phase II exam"}</span><h3>${esc(s.name)}</h3><span class="note">${s.chapters.length} chapters · ${s.chapters.reduce((a,c)=>a+c.topics.length,0)} topics</span><div class="bar"><i style="width:${p}%"></i></div><span class="note">${p}% complete</span></a>`;};
const toolTile=t=>`<a class="tool" href="#${t[0]}"><span class="ic">${ico(t[3])}</span><b>${t[1]}</b><span class="note">${t[2]}</span></a>`;

function vSubjects(){
  return `<header class="stack"><span class="eyebrow">Library</span><h1>Subjects</h1><p class="muted">Each subject is split into exam-paper chapters with concepts, a revision flowchart, flashcards and a quiz.</p></header>
  <p class="notice">Coverage check: chapters follow your seniors' past-paper lists, and gaps against the NMC competency-based (CBME) Phase II syllabus have been filled. Look for the <span class="tag N">NMC</span> tag on added topics.</p>
  <h2>Phase II university exam</h2><div class="grid g3">${EXAM_SUBJ.map(id=>subjCard(SUB[id])).join("")}</div>
  <h2>Taught in Phase II, examined in Phase III Part 1</h2><div class="grid g3">${["cm","fmt"].map(id=>subjCard(SUB[id])).join("")}</div>`;
}
const subjCard=s=>`<a class="subj" href="#s-${s.id}" data-s="${s.id}"><h3>${esc(s.name)}</h3><p class="note" style="position:relative">${esc(s.exam)}</p><p class="note"><b>Books:</b> ${esc(s.books)}</p><div class="bar"><i style="width:${subjPct(s.id)}%"></i></div><span class="note">${s.chapters.filter(c=>chDone(c.id)).length}/${s.chapters.length} chapters done</span></a>`;

function vSubject(sid){const s=SUB[sid];const p=subjPct(sid);
  return `<header class="ch-head" data-s="${sid}"><div class="crumbs"><a href="#subjects">Subjects</a> / ${esc(s.name)}</div><div class="row between"><div class="stack" style="flex:1;min-width:240px"><h1>${esc(s.name)}</h1><p>${esc(s.exam)}</p><p class="note"><b>Reference:</b> ${esc(s.books)}</p></div><div class="ring" style="--p:${p}"><span>${p}%</span></div></div>
  <div class="row"><a class="btn pri" href="#c-${(s.chapters.find(c=>!chDone(c.id))||s.chapters[0]).id}">${p?"Next chapter":"Start chapter 1"}</a><button class="btn" data-act="radar-subj" data-s="${sid}">Exam radar</button><button class="btn" data-act="mock-subj" data-s="${sid}">Mock test</button></div></header>
  ${s.std?`<p class="notice">No past-paper list was uploaded for ${esc(s.name)}, so star ratings here are standard high-yield estimates from the curriculum, not your seniors' list.</p>`:""}
  <section class="stack" data-s="${sid}"><h2>Roadmap</h2><p class="note">Work top to bottom. The bars show how heavily each chapter is asked in exams.</p><div class="trail">${s.chapters.map(c=>{const q=S.quiz[c.id];return `<a class="stop ${chDone(c.id)?"done":""}" href="#c-${c.id}"><span class="node">${chDone(c.id)?"✓":c.n}</span><span class="body"><span class="row between"><b>${esc(c.t)}</b><span class="heat" title="Exam weight">${[1,2,3,4,5].map(k=>`<i class="${k<=heatOf(c)?"on":""}"></i>`).join("")}</span></span><span class="note">${esc(c.paper)} · ${c.topics.length} topics · ${c.topics.filter(t=>t[2]==="L").length} long-answer${q?` · quiz best ${q.best}%`:""}</span><span class="note">${esc(c.topics.slice().sort((a,b)=>b[1]-a[1]).slice(0,3).map(t=>t[0]).join(" · "))}</span></span></a>`;}).join("")}</div></section>`;
}

function vChapter(id){const c=CH[id],s=SUB[c.s];S.lastCh=id;save();
  const i=s.chapters.indexOf(c),prev=s.chapters[i-1],next=s.chapters[i+1];
  POST=()=>renderTab(id);
  return `<header class="ch-head" data-s="${c.s}"><div class="crumbs"><a href="#s-${c.s}">${esc(s.name)}</a> / Chapter ${c.n} · ${esc(c.paper)}</div><h1>${esc(c.t)}</h1>
  <div class="row chprog"><div class="bar" style="flex:1;min-width:160px" aria-label="Concepts understood"><i id="chbar" style="width:${readPct(id)}%;background:var(--sc)"></i></div><span class="note" id="chread">${(S.read[id]||[]).length}/${c.core.length} concepts understood</span></div>
  <div class="row"><span class="chip">${c.topics.length} exam topics</span><span class="chip">${cardPool(id).length} flashcards</span><span class="chip">${quizPool(id).length} MCQs</span>${QB[id]?'<span class="chip" style="color:var(--good)">✓ 100+100 levelled bank</span>':""}${S.quiz[id]?`<span class="chip">Quiz best ${S.quiz[id].best}%</span>`:""}<button class="btn sm ${chDone(id)?"":"pri"}" data-act="done" data-id="${id}">${chDone(id)?"✓ Completed":"Mark chapter complete (+25 XP)"}</button></div></header>
  <div data-s="${c.s}" class="stack"><div class="tabs" role="tablist">${[["learn","Learn"],["flow","Flowchart"],["cards","Flashcards"],["quiz","Quiz"],["ai","AI Lab"]].map(t=>`<button role="tab" data-act="tab" data-t="${t[0]}" class="${CHTAB===t[0]?"on":""}" aria-selected="${CHTAB===t[0]}">${t[1]}</button>`).join("")}</div><div id="tabbody"></div>
  <div class="row between">${prev?`<a class="btn" href="#c-${prev.id}">← ${esc(prev.t)}</a>`:"<span></span>"}${next?`<a class="btn" href="#c-${next.id}">${esc(next.t)} →</a>`:`<a class="btn" href="#s-${c.s}">Back to roadmap</a>`}</div></div>`;
}
function renderTab(id){const c=CH[id],b=$("#tabbody");if(!b)return;clearInterval(QUIZ_TIMER);
  if(CHTAB==="learn"){
    b.innerHTML=`<div class="grid g2" style="align-items:start"><section class="stack"><h2>Core concepts</h2>${syllabusLinks(id)?`<div class="row">${syllabusLinks(id)}</div>`:""}<p class="note">Tick each concept once you can explain it without looking. <span class="term demo">Underlined terms</span> open a definition.</p><ol class="concepts">${c.core.map((x,k)=>{const on=(S.read[id]||[]).includes(k);return `<li class="${on?"got":""}"><span>${linkTerms(x)}</span><button class="tick" data-act="read" data-k="${k}" aria-pressed="${on}" aria-label="Mark concept ${k+1} understood">${on?"✓":""}</button></li>`;}).join("")}</ol>${chapterTerms(c).length?`<div class="card stack termhost"><div class="row between"><h3>Key terms</h3><span class="note">Tap a term for its meaning; tap More for the full explanation</span></div><div class="row">${chapterTerms(c).map(k=>`<button class="chip term" data-act="term" data-t="${esc(k)}">${esc(k)}</button>`).join("")}</div></div>`:""}</section>
    <section class="card stack"><div class="row between"><h2>Exam topics</h2><span class="note">${SUB[c.s].std?"Standard priority":"From past-paper list"}</span></div><p class="note"><b>Answers</b> opens Simplify, Short, Medium and Long model answers${ansCount(id)?` — offline for ${ansCount(id)}/${c.topics.length} topics here`:""}.</p><p class="note"><span class="tag L">LAQ</span> long answer · <span class="tag S">SN</span> short note · <span class="tag D">DIFF</span> difference · <span class="tag N">NMC</span> added from NMC syllabus</p>
    <div>${c.topics.map((t,k)=>`<div class="topic"><span>${starsHTML(t[1])} ${tagHTML(t[2])} ${nmc(t)}<br><b>${esc(t[0])}</b></span><span class="acts"><button class="btn sm star ${isSaved(id,k)?"on":""}" data-act="save" data-c="${id}" data-k="${k}" aria-pressed="${isSaved(id,k)}" title="Save to revision list">${isSaved(id,k)?"★":"☆"}</button><button class="btn sm ${hasAns(id,k)?"pri":""}" data-act="ans-open" data-c="${id}" data-k="${k}" data-u="tai${k}" aria-expanded="false">${hasAns(id,k)?"Answers ✓":"Answers"}</button></span><div class="inline-ai" id="tai${k}"></div></div>`).join("")}</div></section></div>`;
  } else if(CHTAB==="flow"){
    b.innerHTML=`<section class="card stack"><div class="row between"><div><span class="eyebrow">Revision flowchart</span><h2>${esc(c.flow.t)}</h2></div><div class="row"><button class="btn sm" data-act="recall">Recall mode</button><button class="btn sm" data-act="flow-ai">Explain with AI</button></div></div><p class="note" id="recallnote">Recall mode blurs each step. Say the step aloud, then tap to check.</p><div id="flowbox">${flowHTML(c.flow.n)}</div><div class="ai-out" id="flowai"></div>${FLOWS.filter(f=>f.ch===id).length?`<div class="stack"><b>Explained flowcharts for this chapter</b><p class="note">Every step has a written explanation; tap through them one by one.</p><div class="row">${FLOWS.filter(f=>f.ch===id).map(f=>`<a class="chip" href="#fc-${f.id}" style="text-decoration:none;background:var(--ss);color:var(--sc)">${esc(f.t)} →</a>`).join("")}</div></div>`:`<a class="btn sm" href="#fc-ch-${id}">Open in step-by-step viewer</a>`}</section>`;
  } else if(CHTAB==="cards"){
    mountCards(id);
  } else if(CHTAB==="quiz"){
    mountQuiz(id);
  } else {
    b.innerHTML=`<section class="card stack"><div class="row between"><h2>AI Lab for this chapter</h2>${langToggle()}</div>
    <div class="grid g3"><div class="field"><label for="labsum">Smart summary</label><select id="labsum"><option value="one-page">One-page chapter summary</option><option value="10 points">10-point rapid revision</option><option value="night-before">Night-before-exam sheet</option><option value="viva">Viva questions with crisp answers</option></select><button class="btn" data-act="lab-sum">Summarise</button></div>
    <div class="field"><label for="labq">Generate questions</label><select id="labq"><option value="short notes">5 short-note questions with answer outlines</option><option value="long answer">2 long-answer questions with model structure</option><option value="case-based">2 clinical case-based questions</option><option value="difference tables">Difference tables asked in exams</option></select><button class="btn" data-act="lab-q">Generate</button></div>
    <div class="field"><label for="labask">Ask about this chapter</label><input id="labask" placeholder="e.g. Why is LAP score low in CML?"><button class="btn" data-act="lab-ask">Ask</button></div></div>
    <div class="row">${stopBtn("lab")}</div><div class="ai-out" id="labout"></div></section>`;
  }
  $$(".tabs [data-t]").forEach(x=>{const on=x.dataset.t===CHTAB;x.classList.toggle("on",on);x.setAttribute("aria-selected",on);});
}

function vRadar(){const s=SUB[RADAR_S];
  let rows=s.chapters.flatMap(c=>c.topics.map((t,k)=>({t,c,k})));
  if(RADAR_T!=="all")rows=rows.filter(r=>r.t[2]===RADAR_T);
  rows.sort((a,b)=>b.t[1]-a.t[1]||a.c.n-b.c.n);
  return `<header class="stack"><span class="eyebrow">Past-paper intelligence</span><h1>Exam Radar</h1><p class="muted">Every exam topic ranked by how often it has been asked, with the answer format. Star ratings for Pathology, Microbiology and Pharmacology come from the senior priority lists you uploaded.</p></header>
  <section class="card stack"><h2>How the 2nd Professional exam is set</h2><div class="grid g3"><div class="stack"><b>Subjects</b><span class="note">Pathology, Microbiology, Pharmacology: two theory papers each plus practical and viva (NMC CBME). Community Medicine and FMT are examined in Phase III Part 1.</span></div><div class="stack"><b>Question formats</b><span class="note">Each paper mixes MCQs, long answer questions (LAQ), short notes (SN), differences and applied/reasoning questions.</span></div><div class="stack"><b>Strategy</b><span class="note">Cover every ★★★★★ LAQ first, then all SN topics with a flowchart or table. Practise writing answers to time.</span></div></div><p class="note">Check the current Era University blueprint and marks distribution with your department; it can change between batches.</p></section>
  <div class="row" role="tablist">${SUBJECTS.map(x=>`<button class="btn sm ${x.id===RADAR_S?"pri":""}" data-act="radar-s" data-s="${x.id}">${esc(x.name)}</button>`).join("")}</div>
  <div class="row"><span class="note">Format</span>${[["all","All"],["L","Long answers"],["S","Short notes"],["D","Differences"]].map(x=>`<button class="btn sm ${RADAR_T===x[0]?"pri":""}" data-act="radar-t" data-t="${x[0]}">${x[1]}</button>`).join("")}</div>
  ${s.std?`<p class="notice">No past-paper list was uploaded for ${esc(s.name)}; stars show standard curriculum priority.</p>`:""}
  <section class="card" data-s="${RADAR_S}"><div>${rows.map((r,i)=>`<div class="topic"><span>${starsHTML(r.t[1])} ${tagHTML(r.t[2])} ${nmc(r.t)}<br><b>${esc(r.t[0])}</b><br><a class="note" href="#c-${r.c.id}">${esc(s.short)} ${r.c.n} · ${esc(r.c.t)}</a></span><span class="acts"><button class="btn sm star ${isSaved(r.c.id,r.k)?"on":""}" data-act="save" data-c="${r.c.id}" data-k="${r.k}" aria-pressed="${isSaved(r.c.id,r.k)}" title="Save to revision list">${isSaved(r.c.id,r.k)?"★":"☆"}</button><button class="btn sm ${hasAns(r.c.id,r.k)?"pri":""}" data-act="ans-open" data-c="${r.c.id}" data-k="${r.k}" data-u="rai${i}" aria-expanded="false">${hasAns(r.c.id,r.k)?"Answers ✓":"Answers"}</button></span><div class="inline-ai" id="rai${i}"></div></div>`).join("")||'<p class="note">No topics in this format.</p>'}</div></section>`;
}

function vRoadmap(){
  const phases=[
   ["Phase A · Foundations","Weeks 1–6","General principles that every systemic chapter builds on.",["path1","path2","path3","path4","path5","path6","micro1","micro2","pharm1","pharm2","cm1","cm2","fmt1","fmt2","pharm15","path17","micro13"]],
   ["Phase B · Blood, bugs & drugs I","Weeks 7–14","Haematology, bacteriology and the first drug systems.",["path7","path8","path9","path10","micro3","micro4","micro5","pharm3","pharm4","pharm5","pharm6","pharm13","pharm14","path18","micro11","cm3","cm4","fmt3","fmt4"]],
   ["Phase C · Systems & chemotherapy","Weeks 15–24","Systemic pathology, virology, parasitology, mycology and chemotherapy.",["path11","path12","path13","path14","path15","path16","micro6","micro7","micro8","micro9","micro10","pharm7","pharm8","pharm9","pharm10","pharm11","pharm12","micro12","cm5","cm6","cm7","cm8","cm9","fmt5","fmt6","fmt7","fmt8","fmt9","fmt10","fmt11"]],
   ["Phase D · Revision loop","Last 6–8 weeks","Five-star topics, flowchart recall, flashcards and timed mocks.",[]]];
  return `<header class="stack"><span class="eyebrow">The year at a glance</span><h1>Roadmap to 2nd Prof</h1><p class="muted">A suggested order that keeps the three exam subjects moving together, with Community Medicine and FMT running alongside. Tap any chip to open the chapter.</p></header>
  ${phases.map((p,k)=>`<section class="card stack"><div class="row between"><div><span class="eyebrow">${p[1]}</span><h2>${p[0]}</h2></div><span class="chip">${p[3].length?`${p[3].filter(chDone).length}/${p[3].length} done`:"Revision"}</span></div><p class="note">${p[2]}</p>
  ${p[3].length?`<div class="row">${p[3].map(id=>{const c=CH[id];return `<a class="chip" data-s="${c.s}" href="#c-${id}" style="text-decoration:none;background:var(--ss);color:var(--sc)">${chDone(id)?"✓ ":""}${esc(SUB[c.s].short)} ${c.n}: ${esc(c.t)}</a>`;}).join("")}</div>`:`<div class="grid g3"><div class="stack"><b>1 · Radar sweep</b><span class="note">Write timed answers for every ★★★★★ LAQ in the Exam Radar.</span><a class="btn sm" href="#radar">Open radar</a></div><div class="stack"><b>2 · Flowchart recall</b><span class="note">Use Recall mode on each chapter flowchart; redraw it from memory.</span></div><div class="stack"><b>3 · Mock every 3 days</b><span class="note">Mix chapters across subjects; review every wrong answer with Doubt Resolution.</span><a class="btn sm" href="#mock">Start a mock</a></div></div>`}</section>`).join("")}
  <section class="card stack"><h2>Spaced revision rule</h2><p class="note">Revise each chapter on day 1, day 3, day 7 and day 21 after first study. Each pass is shorter: concepts → flowchart → flashcards → quiz.</p><div style="--sc:var(--accent);--ss:var(--accent-soft)">${flowHTML(["Day 0: Learn tab + flowchart","Day 1: Flashcards","Day 3: Flowchart recall mode","Day 7: Chapter quiz","Day 21: Mock test with mixed chapters"])}</div></section>`;
}

function vStudio(){return `<header class="stack"><span class="eyebrow">Ten AI tools</span><h1>AI Studio</h1><p class="muted">Every tool uses the chapter notes in this app as its source, so answers stay close to your syllabus. Answers use your own Claude account.</p><div class="row">${aiBadge()}${langToggle()}</div></header><div class="grid g3">${TOOLS.map(toolTile).join("")}</div>`;}
const toolHead=(id,extra="")=>{const t=TOOLS.find(x=>x[0]===id);return `<header class="stack"><div class="crumbs note"><a href="#studio">AI Studio</a> / ${t[1]}</div><div class="row between"><h1>${t[1]}</h1>${aiBadge()}</div><p class="muted">${t[2]}</p>${extra}</header>`;};

let TURNS=[];
function vTutor(){POST=()=>drawChat();return `${toolHead("tutor",langToggle())}
 <section class="card stack"><div class="grid g2"><div class="field"><label for="tctx">Ground answers in</label>${chSelect("tctx",{all:true,sel:S.lastCh||""})}</div><label class="check"><input type="checkbox" id="tspeak"> Read answers aloud</label></div>
 <div class="chat" id="chat" aria-live="polite"></div>
 <div class="field"><label for="tq">Your question</label><textarea id="tq" placeholder="e.g. Explain the pathogenesis of atherosclerosis as I should write it in a 10-mark answer"></textarea></div>
 <div class="row"><button class="btn pri" data-act="t-send">Ask Atlas</button>${stopBtn("tutor")}<button class="btn ghost" data-act="t-clear">New conversation</button></div>
 <div class="row">${["Mnemonic for Jones criteria","Difference between exotoxin and endotoxin","Why does digoxin toxicity rise with hypokalaemia?","How to write a short note on DIC"].map(x=>`<button class="chip" data-act="t-chip">${esc(x)}</button>`).join("")}</div></section>`;}
function drawChat(){const el=$("#chat");if(!el)return;el.innerHTML=TURNS.length?TURNS.map(t=>t.role==="user"?`<div class="msg me">${esc(t.content)}</div>`:`<div class="msg bot ai-out">${md(t.content)}</div>`).join(""):`<p class="note">Atlas answers using the chapter you choose. Ask follow-ups; it remembers this conversation until you leave the page.</p>`;}

function vSimplify(){return `${toolHead("simplify",langToggle())}<section class="card stack"><div class="grid g2"><div class="field"><label for="sconc">Concept or topic</label><input id="sconc" placeholder="e.g. Antigenic shift vs drift, Zero-order kinetics, Rigor mortis"></div><div class="field"><label for="slvl">Explain it</label><select id="slvl"><option value="like I'm 12, with an everyday analogy">Like I'm 12 (analogy)</option><option value="for a 2nd-year MBBS student, step by step">Step by step for MBBS</option><option value="as exam-ready points I can reproduce">Exam-ready points</option></select></div></div><div class="field"><label for="sch">Chapter (optional)</label>${chSelect("sch",{all:true})}</div><div class="row"><button class="btn pri" data-act="s-go">Simplify</button>${stopBtn("simp")}</div><div class="ai-out" id="sout"></div></section>`;}
function vQgen(){return `${toolHead("qgen",langToggle())}<section class="card stack"><div class="grid g3"><div class="field"><label for="qch">Chapter</label>${chSelect("qch",{sel:S.lastCh||""})}</div><div class="field"><label for="qtype">Type</label><select id="qtype"><option value="mcq">MCQs (interactive)</option><option value="short notes">Short-note questions + answer outlines</option><option value="long answer">Long-answer questions + model structure</option><option value="viva">Viva voce questions + crisp answers</option><option value="case-based">Clinical case-based questions</option></select></div><div class="field"><label for="qn">How many</label><select id="qn"><option>5</option><option>10</option><option>15</option></select></div></div><div class="field"><label for="qlvl">Difficulty</label><select id="qlvl"><option value="university exam level">University exam</option><option value="NEET-PG level, tougher">NEET-PG level</option><option value="basic recall">Basic recall</option></select></div><div class="row"><button class="btn pri" data-act="q-go">Generate</button>${stopBtn("qgen")}</div><div class="ai-out" id="qout"></div><div id="qquiz"></div></section>`;}
function vSummary(){return `${toolHead("summary",langToggle())}<section class="card stack"><div class="grid g2"><div class="field"><label for="smch">Chapter</label>${chSelect("smch",{sel:S.lastCh||""})}</div><div class="field"><label for="smstyle">Summary style</label><select id="smstyle"><option value="one-page chapter summary with headings">One-page chapter summary</option><option value="10 most important points">10-point rapid revision</option><option value="night-before-exam cheat sheet with mnemonics and tables">Night-before cheat sheet</option><option value="topic-wise summary of each exam topic in 3 lines">Topic-wise 3-liners</option></select></div></div><div class="field"><label for="smtopic">Focus on a topic (optional)</label><input id="smtopic" placeholder="e.g. Only DIC and haemophilia"></div><div class="row"><button class="btn pri" data-act="sm-go">Summarise</button>${stopBtn("sum")}</div><div class="ai-out" id="smout"></div></section>`;}
function vCards(){return `${toolHead("cards",langToggle())}<section class="card stack"><div class="grid g3"><div class="field"><label for="cch">Chapter</label>${chSelect("cch",{sel:S.lastCh||""})}</div><div class="field"><label for="ctopic">Topic focus (optional)</label><input id="ctopic" placeholder="e.g. Tumour markers"></div><div class="field"><label for="cn">Number of cards</label><select id="cn"><option>8</option><option>12</option><option>20</option></select></div></div><div class="row"><button class="btn pri" data-act="c-go">Generate cards</button>${stopBtn("cards")}<button class="btn" data-act="c-bank">Use built-in cards</button></div><div class="ai-out" id="cout"></div><div id="cdeck"></div></section>`;}
let GEN_CARDS=null;
function vMock(){const s=SUB[MOCK_S];return `${toolHead("mock")}<section class="card stack"><div class="row">${SUBJECTS.map(x=>`<button class="btn sm ${x.id===MOCK_S?"pri":""}" data-act="mock-s" data-s="${x.id}">${esc(x.name)}</button>`).join("")}</div>
 <div class="field"><label>Chapters</label><div class="grid g2">${s.chapters.map(c=>`<label class="check"><input type="checkbox" class="mch" value="${c.id}" checked> ${c.n}. ${esc(c.t)}</label>`).join("")}</div><div class="row"><button class="btn sm ghost" data-act="mock-all" data-v="1">Select all</button><button class="btn sm ghost" data-act="mock-all" data-v="0">Clear</button></div></div>
 <div class="grid g3"><div class="field"><label for="mn">Questions</label><select id="mn"><option>10</option><option>20</option><option>30</option></select></div><div class="field"><label for="mt">Time per question</label><select id="mt"><option value="60">60 seconds</option><option value="45">45 seconds</option><option value="90">90 seconds</option><option value="0">Untimed</option></select></div><div class="field"><label for="msrc">Questions from</label><select id="msrc"><option value="ai">AI: fresh questions</option><option value="bank">Built-in bank (instant)</option></select></div></div>
 <div class="row"><button class="btn pri" data-act="mock-go">Start mock test</button>${stopBtn("mock")}</div><div class="ai-out" id="mout"></div></section><div id="mbox"></div>`;}

function weakList(){return ALLCH.map(c=>{const q=S.quiz[c.id];const mastery=q?q.last/100:(chDone(c.id)?.5:0);const w=heatOf(c)*(SUB[c.s].std?.7:1);return {c,q,mastery,score:w*(1-mastery)};}).sort((a,b)=>b.score-a.score);}
function vCoach(){const w=weakList();const tested=Object.keys(S.quiz).length;
 return `${toolHead("coach",langToggle())}<section class="grid g3">${SUBJECTS.map(s=>{const qs=s.chapters.map(c=>S.quiz[c.id]).filter(Boolean);const avg=qs.length?Math.round(qs.reduce((a,q)=>a+q.last,0)/qs.length):null;return `<div class="card stack" data-s="${s.id}"><div class="row between"><b>${esc(s.name)}</b><div class="ring" style="--p:${avg??0}"><span>${avg==null?"—":avg+"%"}</span></div></div><span class="note">${qs.length}/${s.chapters.length} chapters quizzed · ${subjPct(s.id)}% completed</span></div>`;}).join("")}</section>
 <section class="card stack"><h2>Study next</h2><p class="note">${tested?"Ranked by exam weight × how much you still need to master it.":"Take a few chapter quizzes and this list will adapt. For now it is ranked by exam weight."}</p><div class="tablewrap"><table class="plain"><thead><tr><th>Chapter</th><th>Exam weight</th><th>Your last score</th><th></th></tr></thead><tbody>${w.slice(0,8).map(x=>`<tr data-s="${x.c.s}"><td><b>${esc(SUB[x.c.s].short)} ${x.c.n}. ${esc(x.c.t)}</b></td><td><span class="heat">${[1,2,3,4,5].map(k=>`<i class="${k<=heatOf(x.c)?"on":""}"></i>`).join("")}</span></td><td>${x.q?x.q.last+"%":chDone(x.c.id)?"Studied, not quizzed":"Not started"}</td><td><a class="btn sm" href="#c-${x.c.id}">Study</a></td></tr>`).join("")}</tbody></table></div>
 <div class="row"><button class="btn pri" data-act="coach-go">Get my AI coaching plan</button>${stopBtn("coach")}</div><div class="ai-out" id="coachout"></div></section>`;}

let REC=null;
function vVoice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 return `${toolHead("voice",langToggle())}<section class="card stack" style="align-items:center;text-align:center"><button class="mic" id="micbtn" data-act="mic" aria-label="Speak your question">${ico("mic",44)}</button><p class="note" id="micnote">${SR?"Tap the mic and ask your question. If your browser blocks the microphone here, type below instead.":"Voice input is not available in this browser view. Type your question below; answers are still read aloud."}</p>
 <div class="field" style="width:100%;max-width:680px;text-align:left"><label for="vq">Your question</label><textarea id="vq" placeholder="e.g. Explain the life cycle of Plasmodium in simple words"></textarea></div>
 <div class="row" style="justify-content:center"><select id="vlang" aria-label="Speech language"><option value="en-IN">English (India)</option><option value="hi-IN">Hindi</option></select><button class="btn pri" data-act="v-go">Ask and listen</button>${stopBtn("voice")}<button class="btn" data-act="v-hush">Stop speaking</button></div></section><div class="ai-out" id="vout"></div>`;}
function speak(text){try{const syn=window.speechSynthesis;if(!syn)return;syn.cancel();const plain=text.replace(/[#*`|>_-]+/g," ").replace(/\s+/g," ");const u=new SpeechSynthesisUtterance(plain.slice(0,4000));u.lang=($("#vlang")?.value)||"en-IN";u.rate=1;syn.speak(u);}catch(e){}}

function vPlanner(){const p=S.plan;const d=new Date();d.setDate(d.getDate()+90);
 POST=()=>drawPlan();
 return `${toolHead("planner")}<section class="card stack"><h2>${p?"Update your plan":"Build your plan"}</h2>
 <div class="grid g3"><div class="field"><label for="pex">Exam date</label><input type="date" id="pex" value="${p?p.exam:dstr(d)}"></div><div class="field"><label for="phr">Study hours per day</label><select id="phr">${[2,3,4,5,6,8].map(h=>`<option ${(p?p.hrs:4)==h?"selected":""}>${h}</option>`).join("")}</select></div><div class="field"><label for="pweak">Weak subject (extra time)</label><select id="pweak"><option value="">None</option>${SUBJECTS.map(s=>`<option value="${s.id}" ${p&&p.weak===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select></div></div>
 <div class="field"><label>Include</label><div class="row">${SUBJECTS.map(s=>`<label class="check"><input type="checkbox" class="psub" value="${s.id}" ${(!p&&!s.std)||(p&&p.subs.includes(s.id))?"checked":""}> ${esc(s.name)}</label>`).join("")}</div></div>
 <label class="check"><input type="checkbox" id="pskip" ${!p||p.skip?"checked":""}> Skip chapters I've already marked complete</label>
 <div class="row"><button class="btn pri" data-act="p-go">${p?"Rebuild plan":"Create plan"}</button>${p?`<button class="btn" data-act="p-ai">Refine into a daily timetable with AI</button>${stopBtn("plan")}`:""}</div><div class="ai-out" id="pout"></div></section>
 <section class="card stack" id="planview"></section>`;}
function buildPlan({exam,hrs,weak,subs,skip}){
  const start=new Date();start.setHours(0,0,0,0);const end=new Date(exam+"T00:00:00");
  const days=Math.round((end-start)/864e5);if(!(days>=3))return null;
  const rev=Math.max(2,Math.round(days*.15));const studyDays=days-rev;
  const order=[];const lists=subs.map(sid=>SUB[sid].chapters.filter(c=>!(skip&&chDone(c.id))));
  for(let k=0;lists.some(l=>l[k]);k++)lists.forEach(l=>{if(l[k])order.push(l[k]);});
  const wt=c=>(1+starSum(c)/6+c.topics.length*.12)*(c.s===weak?1.5:1)*(SUB[c.s].std?.7:1);
  const W=order.reduce((a,c)=>a+wt(c),0);const H=studyDays*hrs;
  const queue=order.map(c=>({id:c.id,h:Math.max(.5,wt(c)/W*H)}));
  const out=[];let qi=0;
  for(let d=0;d<days;d++){const dt=new Date(start);dt.setDate(dt.getDate()+d);const items=[];
    if(d>=studyDays){const sid=subs[(d-studyDays)%subs.length];items.push({k:"rev",txt:`Revision: ${SUB[sid].name} five-star topics + flowchart recall`,h:hrs-1,s:sid});items.push({k:"mock",txt:`Timed mock test: ${SUB[sid].name}`,h:1,s:sid});}
    else{let left=hrs-.25;if((d+1)%7===0){items.push({k:"mock",txt:"Weekly mixed mock test + review mistakes",h:1});left-=1;}
      while(left>.24&&qi<queue.length){const q=queue[qi];const take=Math.min(left,q.h);items.push({k:"study",id:q.id,h:Math.round(take*4)/4,txt:`${SUB[CH[q.id].s].short} ${CH[q.id].n}: ${CH[q.id].t}`,s:CH[q.id].s});q.h-=take;left-=take;if(q.h<=.01)qi++;}
      if(qi>=queue.length&&left>.24)items.push({k:"rev",txt:"Catch-up / revise weakest chapter",h:Math.round(left*4)/4});
      items.push({k:"cards",txt:"15-min flashcard review of earlier chapters",h:.25});}
    out.push({date:dstr(dt),items:items.map(x=>({...x,done:false}))});}
  return {exam,hrs,weak,subs,skip,days:out,made:today()};
}
function drawPlan(){const v=$("#planview");if(!v)return;const p=S.plan;if(!p){v.innerHTML=`<p class="note">Your plan will appear here: every day until the exam, chapters split by exam weight, weekly mocks and a final revision block.</p>`;return;}
  const t=today();const weeks=[];p.days.forEach((d,i)=>{const w=Math.floor(i/7);(weeks[w]=weeks[w]||[]).push({d,i});});
  const curW=Math.max(0,Math.floor(p.days.findIndex(d=>d.date===t)/7));
  const total=p.days.reduce((a,d)=>a+d.items.length,0),dn=p.days.reduce((a,d)=>a+d.items.filter(x=>x.done).length,0);
  v.innerHTML=`<div class="row between"><h2>Your plan · ${p.days.length} days to ${esc(p.exam)}</h2><span class="chip">${dn}/${total} tasks done</span></div><div class="bar"><i style="width:${total?Math.round(dn/total*100):0}%"></i></div>
  ${weeks.map((w,wi)=>`<details ${wi===curW?"open":""}><summary><b>Week ${wi+1}</b> <span class="note">${esc(w[0].d.date)} → ${esc(w[w.length-1].d.date)}</span></summary>${w.map(({d,i})=>`<div class="day ${d.date===t?"today":""}"><span class="d">${new Date(d.date+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}${d.date===t?"<br><b>TODAY</b>":""}</span><div>${d.items.map((x,j)=>`<label class="task ${x.done?"done":""}" ${x.s?`data-s="${x.s}"`:""}><input type="checkbox" data-act-change="ptask" data-d="${i}" data-j="${j}" ${x.done?"checked":""}><span>${x.s?'<span class="dot" style="display:inline-block;background:var(--sc);margin-right:6px"></span>':""}${esc(x.txt)} <span class="note">· ${x.h}h</span>${x.id?` <a class="note" href="#c-${x.id}">open</a>`:""}</span></label>`).join("")}</div></div>`).join("")}</details>`).join("")}`;
}
function planToday(){const p=S.plan;if(!p)return `<p class="note">No plan yet. Tell the planner your exam date and daily hours and it will lay out every day for you.</p>`;const i=p.days.findIndex(d=>d.date===today());if(i<0)return `<p class="note">Today is outside your plan dates. Rebuild the plan from the planner.</p>`;const d=p.days[i];return `<div>${d.items.map((x,j)=>`<label class="task ${x.done?"done":""}" ${x.s?`data-s="${x.s}"`:""}><input type="checkbox" data-act-change="ptask" data-d="${i}" data-j="${j}" ${x.done?"checked":""}><span>${esc(x.txt)} <span class="note">· ${x.h}h</span>${x.id?` <a class="note" href="#c-${x.id}">open</a>`:""}</span></label>`).join("")}</div>`;}

function vDoubt(){return `${toolHead("doubt",langToggle())}<section class="card stack"><div class="field"><label for="dq">Your doubt or the full MCQ</label><textarea id="dq" placeholder="e.g. Why is the hydrostatic test unreliable in a putrefied body?  — or paste an MCQ with options"></textarea></div><div class="grid g2"><div class="field"><label for="dmine">What you think / your answer (optional)</label><input id="dmine" placeholder="e.g. I chose option B because…"></div><div class="field"><label for="dch">Related chapter (optional)</label>${chSelect("dch",{all:true})}</div></div><div class="row"><button class="btn pri" data-act="d-go">Explain step by step</button>${stopBtn("doubt")}</div><div class="ai-out" id="dout"></div></section>`;}

function vProgress(){const L=level();
 return `<header class="stack"><span class="eyebrow">Saved in this browser</span><h1>My Progress</h1></header>
 <section class="grid g3"><div class="card stack"><span class="eyebrow">Level</span><h2>${esc(L.name)}</h2><div class="bar"><i style="width:${L.pct}%"></i></div><span class="note">${S.xp} XP${L.next?` · ${L.next-S.xp} to next level`:""}</span></div><div class="card stack"><span class="eyebrow">Streak</span><h2>🔥 ${S.streak} day${S.streak===1?"":"s"}</h2><span class="note">Earn XP on a day to keep it going.</span></div><div class="card stack"><span class="eyebrow">Chapters</span><h2>${Object.keys(S.done).length}/${ALLCH.length}</h2><span class="note">${Object.keys(S.quiz).length} chapters quizzed</span></div></section>
 <section class="card stack"><h2>By subject</h2>${SUBJECTS.map(s=>`<div class="stack" data-s="${s.id}" style="gap:4px"><div class="row between"><b>${esc(s.name)}</b><span class="note">${subjPct(s.id)}%</span></div><div class="bar"><i style="width:${subjPct(s.id)}%;background:var(--sc)"></i></div></div>`).join("")}</section>
 <section class="card stack"><h2>Recent tests</h2>${S.hist.length?`<div class="tablewrap"><table class="plain"><thead><tr><th>Date</th><th>Test</th><th>Score</th></tr></thead><tbody>${S.hist.slice(0,12).map(h=>`<tr><td>${esc(h.d)}</td><td>${esc(h.title)}</td><td>${h.score}/${h.total}</td></tr>`).join("")}</tbody></table></div>`:'<p class="note">No tests yet. Try a chapter quiz or the daily dose on Home.</p>'}<a class="btn" href="#coach">See weak areas →</a></section>
 <section class="card stack"><h2>Reset</h2><p class="note">Progress lives only in this browser on this device. Resetting clears XP, streak, quiz scores, saved cards and your plan.</p><div class="row" id="resetrow"><button class="btn" data-act="reset1">Reset my progress</button></div></section>`;}

function isSaved(c,k){return S.saved.some(x=>x.c===c&&x.k===+k);}
function readPct(id){return Math.round((S.read[id]||[]).length/CH[id].core.length*100);}
function vSaved(){const list=S.saved.filter(x=>CH[x.c]&&CH[x.c].topics[x.k]);
 return `<header class="stack"><span class="eyebrow">Your picks</span><h1>Revision List</h1><p class="muted">Topics you starred with ☆. Use it for last-week revision and viva prep.</p></header>
 ${list.length?`<section class="card"><div>${list.map((x,i)=>{const c=CH[x.c],t=c.topics[x.k];return `<div class="topic" data-s="${c.s}"><span>${starsHTML(t[1])} ${tagHTML(t[2])} ${nmc(t)}<br><b>${esc(t[0])}</b><br><a class="note" href="#c-${c.id}">${esc(SUB[c.s].short)} ${c.n} · ${esc(c.t)}</a></span><span class="acts"><button class="btn sm ${hasAns(c.id,x.k)?"pri":""}" data-act="ans-open" data-c="${c.id}" data-k="${x.k}" data-u="sv${i}" aria-expanded="false">${hasAns(c.id,x.k)?"Answers ✓":"Answers"}</button><button class="btn sm" data-act="save" data-c="${c.id}" data-k="${x.k}">Remove</button></span><div class="inline-ai" id="sv${i}"></div></div>`;}).join("")}</div></section>
 <div class="row"><button class="btn pri" data-act="sv-quiz">Quiz me on these (AI)</button>${stopBtn("svq")}</div><div class="ai-out" id="svout"></div><div id="svbox"></div>`
 :`<section class="card stack"><h2>Nothing saved yet</h2><p class="note">Open any chapter's Learn tab or the Exam Radar and press ☆ next to a topic.</p><div class="row"><a class="btn pri" href="#radar">Open Exam Radar</a></div></section>`}`;}

/* ============ focus timer ============ */
const FOCUS={end:0,id:null};
function fmtLeft(){const s=Math.max(0,Math.round((FOCUS.end-Date.now())/1000));return `${Math.floor(s/60)}:${pad(s%60)}`;}
function chime(){try{const a=new (window.AudioContext||window.webkitAudioContext)();[660,880,990].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=f;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.15,a.currentTime+i*.18);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+i*.18+.3);o.start(a.currentTime+i*.18);o.stop(a.currentTime+i*.18+.32);});}catch(e){}}
function focusTick(){const t=$("#focustxt");if(Date.now()>=FOCUS.end){clearInterval(FOCUS.id);FOCUS.end=0;if(t)t.textContent="Focus 25:00";$("#focusbtn")?.classList.remove("pri");chime();addXP(15,"focus session done");return;}if(t)t.textContent=fmtLeft();}

/* ============ Ask Atlas drawer ============ */
function mountDrawer(){if($("#fab"))return;document.body.insertAdjacentHTML("beforeend",`<button id="fab" data-act="drawer" aria-label="Ask Atlas, the AI tutor">${ico("chat",22)}<span>Ask Atlas</span></button>
<aside id="drawer" hidden aria-label="Ask Atlas"><div class="row between"><div><span class="eyebrow">Quick AI tutor</span><h3>Ask Atlas</h3></div><button class="btn sm ghost" data-act="drawer" aria-label="Close">✕</button></div><p class="note" id="drctx"></p><div class="field"><label for="drq">Your question</label><textarea id="drq" placeholder="e.g. Give me a mnemonic for the causes of DIC"></textarea></div><div class="row"><button class="btn pri" data-act="dr-go">Ask</button>${stopBtn("fab")}<a class="btn ghost" href="#tutor">Open full tutor</a></div><div class="ai-out" id="drout"></div></aside>`);}
function drawerCh(){const h=location.hash.slice(1);return h.startsWith("c-")&&CH[h.slice(2)]?CH[h.slice(2)]:(S.lastCh&&CH[S.lastCh])||null;}

/* ============ router ============ */
const ROUTES={notes:vNotes,flowcharts:vFlowcharts,saved:vSaved,home:vHome,subjects:vSubjects,radar:vRadar,roadmap:vRoadmap,studio:vStudio,progress:vProgress,tutor:vTutor,simplify:vSimplify,qgen:vQgen,summary:vSummary,cards:vCards,mock:vMock,coach:vCoach,voice:vVoice,planner:vPlanner,doubt:vDoubt};
function route(){clearInterval(QUIZ_TIMER);if(typeof FL_WALK!=="undefined"&&FL_WALK){clearInterval(FL_WALK);FL_WALK=null;}const shEl=$("#sheet");if(shEl)shEl.hidden=true;Object.values(CTL).forEach(c=>c.abort());try{speechSynthesis.cancel();}catch(e){}POST=null;
  const h=(location.hash||"#home").slice(1);let html;
  if(h.startsWith("s-")&&SUB[h.slice(2)])html=vSubject(h.slice(2));
  else if(h.startsWith("fc-")&&FLOWMAP[h.slice(3)])html=vFlow(h.slice(3));
  else if(h.startsWith("read-"))html=vRead(h.slice(5));
  else if(h.startsWith("c-")&&CH[h.slice(2)]){if(LAST_ROUTE!==h)CHTAB="learn";html=vChapter(h.slice(2));}
  else html=(ROUTES[h]||vHome)();
  LAST_ROUTE=h;
  $("#main").innerHTML=`<div class="wrap">${topbar()}${html}</div>`;
  if(POST)POST();markNav();window.scrollTo(0,0);
}
let LAST_ROUTE=null;
window.addEventListener("hashchange",route);

/* ============ search ============ */
const INDEX=ALLCH.flatMap(c=>[{label:c.t,sub:SUB[c.s].name+" · chapter "+c.n,id:c.id},...c.topics.map(t=>({label:t[0],sub:SUB[c.s].name+" · "+c.t,id:c.id})),...c.hy.map(x=>({label:hy(x).q,sub:SUB[c.s].name+" · flashcard",id:c.id}))]);
document.addEventListener("input",e=>{
  if(e.target.id==="q"){const v=e.target.value.trim().toLowerCase();const r=$("#qres");if(!v){r.hidden=true;return;}
    const hits=INDEX.filter(x=>x.label.toLowerCase().includes(v)).slice(0,12);
    r.innerHTML=hits.length?hits.map(x=>`<a href="#c-${x.id}"><b>${esc(x.label)}</b><br><span class="note">${esc(x.sub)}</span></a>`).join(""):`<a href="#tutor" data-act="ask-search"><b>No match. Ask the AI Tutor about "${esc(v)}"</b></a>`;r.hidden=false;}
});
document.addEventListener("click",e=>{const r=$("#qres");if(r&&!e.target.closest(".search"))r.hidden=true;});

/* ============ actions ============ */
const ACT={
 stop:el=>{CTL[el.dataset.stop]?.abort();},
 sheet:()=>{const sh=$("#sheet");sh.hidden=!sh.hidden;},
 "sheet-go":el=>{$("#sheet").hidden=true;location.hash=el.getAttribute("href");},
 seen:()=>{S.seen=true;save();$(".onboard")?.remove();},
 fs:el=>{S.fs=Math.max(85,Math.min(130,S.fs+(+el.dataset.d)));save();applyFS();toast(`Text size ${S.fs}%`);},
 focus:()=>{if(FOCUS.end){clearInterval(FOCUS.id);FOCUS.end=0;$("#focustxt").textContent="Focus 25:00";$("#focusbtn").classList.remove("pri");toast("Focus session stopped");return;}FOCUS.end=Date.now()+25*60000;FOCUS.id=setInterval(focusTick,1000);$("#focusbtn").classList.add("pri");focusTick();toast("Focus on: 25 minutes, phone away");},
 read:el=>{const id=location.hash.slice(3),k=+el.dataset.k;const set=new Set(S.read[id]||[]);const li=el.closest("li");if(set.has(k)){set.delete(k);}else{set.add(k);}S.read[id]=[...set];save();const on=set.has(k);li.classList.toggle("got",on);el.textContent=on?"✓":"";el.setAttribute("aria-pressed",on);
   $("#chbar").style.width=readPct(id)+"%";$("#chread").textContent=`${set.size}/${CH[id].core.length} concepts understood`;
   if(on&&set.size===CH[id].core.length&&!chDone(id)){toast("All concepts ticked — try the Quiz tab next");}},
 save:el=>{const c=el.dataset.c,k=+el.dataset.k;const i=S.saved.findIndex(x=>x.c===c&&x.k===k);if(i>=0)S.saved.splice(i,1);else S.saved.push({c,k});save();
   if(location.hash==="#saved"){route();return;}const on=i<0;el.classList.toggle("on",on);el.textContent=on?"★":"☆";el.setAttribute("aria-pressed",on);toast(on?"Saved to revision list":"Removed from revision list");},
 "sv-ans":el=>{const x=S.saved.filter(x=>CH[x.c]&&CH[x.c].topics[x.k])[+el.dataset.i];const c=CH[x.c];aiStream($("#sv"+el.dataset.i),modelAnswerPrompt(c,c.topics[x.k]),{key:"saved"});},
 "sv-quiz":async()=>{const list=S.saved.filter(x=>CH[x.c]&&CH[x.c].topics[x.k]);const ids=[...new Set(list.map(x=>x.c))];const v=await aiJSON($("#svout"),mcqPrompt(Math.min(10,Math.max(5,list.length)),ids,` Focus ONLY on these saved topics: ${list.map(x=>CH[x.c].topics[x.k][0]).join("; ")}.`),{key:"svq"});const qs=normQs(v,ids[0]);if(qs.length)runQuiz($("#svbox"),qs,{title:"Revision list quiz"});else if(v)$("#svout").innerHTML='<p class="notice">Could not read the questions. Press the button again.</p>';},
 "q-explain":el=>{if(!LASTQ)return;const k=+el.dataset.i,q=LASTQ.qs[k],mine=LASTQ.ans[k];const c=q.ch&&CH[q.ch];aiStream($("#qx"+k),`${RULES()}${ctx(c)}\n\nA student got this MCQ wrong.\nQuestion: ${q.q}\nOptions: ${q.o.map((o,i)=>"ABCD"[i]+". "+o).join(" | ")}\nCorrect: ${"ABCD"[q.a]}. ${q.o[q.a]}\n${mine!=null?`Student chose: ${"ABCD"[mine]}. ${q.o[mine]}`:"Student did not answer."}\n\nIn under 150 words: why the correct option is right, why the chosen option is wrong, and a one-line memory hook.`,{key:"qx"+k});},
 drawer:()=>{const d=$("#drawer");const open=d.hidden;d.hidden=!open;$("#fab").setAttribute("aria-expanded",open);if(open){const c=drawerCh();$("#drctx").textContent=c?`Answers use notes from: ${SUB[c.s].name} › ${c.t}`:"Ask about any 2nd-year topic.";$("#drq").focus();}},
 "dr-go":()=>{const q=$("#drq").value.trim();if(!q){$("#drq").focus();return;}const c=drawerCh();aiStream($("#drout"),`${RULES()}${ctx(c)}\n\nStudent question: ${q}\nKeep it under 200 words unless the question needs more.`,{key:"fab"});},
 done:el=>{const id=el.dataset.id;if(S.done[id]){delete S.done[id];save();route();return;}S.done[id]=today();save();addXP(25,"chapter complete");route();},
 tab:el=>{CHTAB=el.dataset.t;renderTab(location.hash.slice(3));},
 "radar-subj":el=>{RADAR_S=el.dataset.s;RADAR_T="all";location.hash="#radar";},
 "mock-subj":el=>{MOCK_S=el.dataset.s;location.hash="#mock";},
 "radar-s":el=>{RADAR_S=el.dataset.s;route();},
 "radar-t":el=>{RADAR_T=el.dataset.t;route();},
 "radar-ans":el=>{const c=CH[el.dataset.c],t=c.topics[+el.dataset.k];aiStream($("#rai"+el.dataset.i),modelAnswerPrompt(c,t),{key:"radar"});},
 "t-simplify":el=>{const c=CH[location.hash.slice(3)],t=c.topics[+el.dataset.k];aiStream($("#tai"+el.dataset.k),`${RULES()}${ctx(c)}\n\nExplain "${t[0]}" in very simple language for a struggling 2nd-year student: start with a one-line big idea, then an everyday analogy, then 4–6 plain bullets, then one memory trick. Keep it under 250 words.`,{key:"topic"});},
 "t-answer":el=>{const c=CH[location.hash.slice(3)],t=c.topics[+el.dataset.k];aiStream($("#tai"+el.dataset.k),modelAnswerPrompt(c,t),{key:"topic"});},
 recall:el=>{const f=$("#flowbox");const on=f.classList.toggle("recall");$$(".fbox,.fcol",f).forEach(x=>x.classList.remove("shown"));el.textContent=on?"Show all":"Recall mode";},
 "flow-ai":()=>{const c=CH[location.hash.slice(3)];aiStream($("#flowai"),`${RULES()}${ctx(c)}\n\nThe student is revising this flowchart: "${c.flow.t}". Steps: ${JSON.stringify(c.flow.n)}.\nExplain each step of the flow in order (why each leads to the next), then give a 1-line mnemonic for the whole sequence and one likely exam question that this flowchart answers.`,{key:"flow"});},
 "more-cards":async()=>{const c=CH[location.hash.slice(3)];const v=await aiJSON($("#cardai"),`${RULES()}${ctx(c)}\n\nCreate 8 new flashcards on this chapter that are NOT already in the high-yield list. Reply with only a JSON array of {"q": short question, "a": crisp answer under 25 words}.`,{key:"cards"});if(Array.isArray(v)){const add=v.filter(x=>x&&x.q&&x.a).map(x=>`${String(x.q).replace(/::/g,":")}::${String(x.a).replace(/::/g,":")}`);S.custom[c.id]=[...(S.custom[c.id]||[]),...add];save();mountCards(c.id);$("#cardai").innerHTML=`<p class="note">Added ${add.length} AI cards to this chapter's deck.</p>`;}},
 "ai-quiz":async()=>{const id=location.hash.slice(3);const box=$("#quizbox");const tmp=document.createElement("div");tmp.className="ai-out";box.prepend(tmp);const v=await aiJSON(tmp,mcqPrompt(5,[id]),{key:"quiz"});const qs=normQs(v,id);if(qs.length)runQuiz(box,qs,{title:"AI quiz"});else if(v)tmp.innerHTML='<p class="notice">Could not read the questions. Press the button again.</p>';},
 "lab-sum":()=>{const c=CH[location.hash.slice(3)];aiStream($("#labout"),`${RULES()}${ctx(c)}\n\nWrite a ${$("#labsum").value} for this chapter. Use tables for differences and arrows for pathways.`,{key:"lab"});},
 "lab-q":()=>{const c=CH[location.hash.slice(3)];aiStream($("#labout"),`${RULES()}${ctx(c)}\n\nGenerate ${$("#labq").value} from this chapter in Indian university exam style, prioritising the starred topics. After each question give a model answer outline (headings + key points + diagram/flow to draw).`,{key:"lab"});},
 "lab-ask":()=>{const c=CH[location.hash.slice(3)];const q=$("#labask").value.trim();if(!q){$("#labask").focus();return;}aiStream($("#labout"),`${RULES()}${ctx(c)}\n\nStudent question: ${q}`,{key:"lab"});},
 "t-send":()=>tutorSend(),
 "t-chip":el=>{$("#tq").value=el.textContent;tutorSend();},
 "t-clear":()=>{TURNS=[];drawChat();},
 "ask-search":()=>{const v=$("#q").value;setTimeout(()=>{const t=$("#tq");if(t)t.value=v;},50);},
 "s-go":()=>{const q=$("#sconc").value.trim();if(!q){$("#sconc").focus();return;}const c=CH[$("#sch").value];aiStream($("#sout"),`${RULES()}${ctx(c)}\n\nSimplify this concept ${$("#slvl").value}: "${q}". Structure: Big idea (1 line) → Analogy → How it works (numbered steps) → Why it matters clinically → Memory hook → One self-check question with answer.`,{key:"simp"});},
 "q-go":async()=>{const id=$("#qch").value,type=$("#qtype").value,n=+$("#qn").value,lvl=$("#qlvl").value;$("#qquiz").innerHTML="";
   if(type==="mcq"){const v=await aiJSON($("#qout"),mcqPrompt(n,[id],` Difficulty: ${lvl}.`),{key:"qgen"});const qs=normQs(v,id);if(qs.length)runQuiz($("#qquiz"),qs,{title:"Generated MCQs"});else if(v)$("#qout").innerHTML='<p class="notice">Could not read the questions. Press Generate again.</p>';}
   else aiStream($("#qout"),`${RULES()}${ctx(CH[id])}\n\nGenerate ${n} ${type} questions at ${lvl}, prioritising starred topics. For each, give a model answer outline: key headings, must-write points, the diagram/flowchart/table to draw, and marks-fetching keywords.`,{key:"qgen"});},
 "sm-go":()=>{const c=CH[$("#smch").value];const f=$("#smtopic").value.trim();aiStream($("#smout"),`${RULES()}${ctx(c)}\n\nWrite a ${$("#smstyle").value}${f?` focusing on: ${f}`:""}. Use tables for differences and arrows for sequences. End with "Most likely exam questions" (3 items).`,{key:"sum"});},
 "c-go":async()=>{const c=CH[$("#cch").value],n=+$("#cn").value,f=$("#ctopic").value.trim();const v=await aiJSON($("#cout"),`${RULES()}${ctx(c)}\n\nCreate ${n} revision flashcards${f?` on: ${f}`:""} for this chapter. Mix definitions, mechanisms, drugs of choice, differences and numbers. Reply with only a JSON array of {"q": short question, "a": crisp answer under 25 words}.`,{key:"cards"});
   if(Array.isArray(v)){GEN_CARDS={ch:c.id,cards:v.filter(x=>x&&x.q&&x.a).map(x=>({q:String(x.q),a:String(x.a)}))};if(!GEN_CARDS.cards.length){$("#cout").innerHTML='<p class="notice">No cards came back. Try again.</p>';return;}$("#cdeck").innerHTML=deckHTML()+`<div class="row" style="justify-content:center;margin-top:10px"><button class="btn pri" data-act="c-save">Save ${GEN_CARDS.cards.length} cards to chapter deck</button></div>`;runDeck($("#cdeck"),GEN_CARDS.cards);}},
 "c-bank":()=>{const c=CH[$("#cch").value];$("#cout").innerHTML="";$("#cdeck").innerHTML=deckHTML();runDeck($("#cdeck"),chCards(c),{chId:c.id});},
 "c-save":()=>{if(!GEN_CARDS)return;S.custom[GEN_CARDS.ch]=[...(S.custom[GEN_CARDS.ch]||[]),...GEN_CARDS.cards.map(x=>`${x.q.replace(/::/g,":")}::${x.a.replace(/::/g,":")}`)];save();toast("Saved to chapter deck");GEN_CARDS=null;},
 "mock-s":el=>{MOCK_S=el.dataset.s;route();},
 "mock-all":el=>{$$(".mch").forEach(x=>x.checked=el.dataset.v==="1");},
 "mock-go":async()=>{const ids=$$(".mch").filter(x=>x.checked).map(x=>x.value);if(!ids.length){$("#mout").innerHTML='<p class="notice">Pick at least one chapter.</p>';return;}
   const n=+$("#mn").value,t=+$("#mt").value,src=$("#msrc").value;let qs=[];
   if(src==="ai"){const v=await aiJSON($("#mout"),mcqPrompt(n,ids,` Spread questions across the chapters, weighted towards starred topics.`),{key:"mock"});qs=normQs(v,ids[0]);if(!qs.length&&v)$("#mout").innerHTML='<p class="notice">Could not read the questions; switch to the built-in bank or try again.</p>';}
   else{qs=shuffle(bankQs(ids)).slice(0,n);$("#mout").innerHTML=qs.length<n?`<p class="note">The bank has ${qs.length} questions for these chapters. Use AI for more.</p>`:"";}
   if(qs.length){runQuiz($("#mbox"),qs,{timed:t,title:`${SUB[MOCK_S].name} mock`});$("#mbox").scrollIntoView({behavior:"smooth"});}},
 "coach-go":()=>{const w=weakList().slice(0,10).map(x=>`${SUB[x.c.s].name} › ${x.c.t}: exam weight ${heatOf(x.c)}/5, ${x.q?`last quiz ${x.q.last}%, best ${x.q.best}%`:chDone(x.c.id)?"studied, not quizzed":"not started"}`).join("\n");
   const done=Object.keys(S.done).length;aiStream($("#coachout"),`${RULES()}\n\nYou are now the student's study coach. Their data:\n- Chapters completed: ${done}/${ALLCH.length}\n- XP ${S.xp}, streak ${S.streak} days\n- Exam date: ${S.plan?S.plan.exam:"not set"}; study hours/day: ${S.plan?S.plan.hrs:"not set"}\n- Priority list (weight × weakness):\n${w}\n\nGive: 1) a 3-line diagnosis of where they stand, 2) the next 7 days as a day-by-day plan using the chapters above (be specific: which chapter, which app tab — Learn, Flowchart, Flashcards, Quiz, Mock), 3) three habits to fix weak areas, 4) one motivating line.`,{key:"coach"});},
 mic:el=>startMic(el),
 "v-go":async()=>{const q=$("#vq").value.trim();if(!q){$("#vq").focus();return;}const t=await aiStream($("#vout"),`${RULES()}\n\nThe student asked by voice: "${q}". Answer in a spoken, conversational style that sounds good read aloud: short sentences, no tables, at most 180 words, end with one quick recap line.`,{key:"voice"});if(t)speak(t);},
 "v-hush":()=>{try{speechSynthesis.cancel();}catch(e){}},
 "p-go":()=>{const subs=$$(".psub").filter(x=>x.checked).map(x=>x.value);const exam=$("#pex").value;if(!subs.length){$("#pout").innerHTML='<p class="notice">Pick at least one subject.</p>';return;}
   const p=buildPlan({exam,hrs:+$("#phr").value,weak:$("#pweak").value,subs,skip:$("#pskip").checked});if(!p){$("#pout").innerHTML='<p class="notice">Choose an exam date at least 3 days from today.</p>';return;}S.plan=p;save();toast("Plan created");route();},
 "p-ai":()=>{const p=S.plan;const first=p.days.slice(0,7).map(d=>`${d.date}: ${d.items.map(x=>x.txt+" ("+x.h+"h)").join("; ")}`).join("\n");aiStream($("#pout"),`${RULES()}\n\nTurn this week's study plan into a realistic daily timetable for an MBBS student who also attends college ${"(roughly 9 am–4 pm on weekdays)"} and studies ${p.hrs} hours a day. Use time slots, 50-minute focus blocks with breaks, which app tool to use in each block (Learn, Flowchart recall, Flashcards, Quiz, Mock), and a Sunday catch-up. Exam date: ${p.exam}.\n\nThis week's plan:\n${first}`,{key:"plan"});},
 "d-go":()=>{const q=$("#dq").value.trim();if(!q){$("#dq").focus();return;}const mine=$("#dmine").value.trim();const c=CH[$("#dch").value];aiStream($("#dout"),`${RULES()}${ctx(c)}\n\nResolve this doubt step by step.\nDoubt / MCQ: ${q}\n${mine?`Student's thinking: ${mine}\n`:""}\nFormat exactly:\n## What is being asked\n## Key concept\n## Step-by-step reasoning (numbered)\n## Answer\n## ${mine?"Where your reasoning slipped":"Common mistake"}\n## Memory hook`,{key:"doubt"});},
 reset1:()=>{$("#resetrow").innerHTML=`<span>Clear everything on this device?</span><button class="btn" data-act="reset2" style="border-color:var(--bad);color:var(--bad)">Yes, reset</button><button class="btn ghost" data-act="reset0">Cancel</button>`;},
 reset0:()=>route(),
 reset2:()=>{const lang=S.lang;S=defState();S.lang=lang;save();applyFS();renderSide();route();toast("Progress reset");}
};
function modelAnswerPrompt(c,t){const f=t[2]==="L"?"a 10-mark long answer":t[2]==="D"?"a difference table answer (5 marks)":"a 5-mark short note";return `${RULES()}${ctx(c)}\n\nWrite ${f} on "${t[0]}" exactly as a topper would in the Era University 2nd Prof exam: introduction/definition, then headed sections (etiology, pathogenesis/MOA, features, diagnosis/uses, complications/ADR as relevant), a flowchart or table to draw (show it in text), and 3 marks-fetching keywords in bold at the end. Keep it reproducible in ${t[2]==="L"?"15":"7"} minutes of writing.`;}
async function tutorSend(){const ta=$("#tq");const q=ta.value.trim();if(!q){ta.focus();return;}ta.value="";
  TURNS.push({role:"user",content:q});TURNS=TURNS.slice(-12);if(TURNS[0].role!=="user")TURNS.shift();drawChat();
  const bubble=document.createElement("div");bubble.className="msg bot ai-out";$("#chat").appendChild(bubble);
  const c=CH[$("#tctx").value];
  const t=await aiStream(bubble,[{role:"user",content:RULES()+ctx(c)+"\n\nAnswer the student's questions that follow. Keep answers focused (under 300 words unless asked for more)."},...TURNS],{key:"tutor",chat:true});
  if(t){TURNS.push({role:"assistant",content:t});if($("#tspeak")?.checked)speak(t);}else TURNS.pop();
}
function startMic(btn){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const note=$("#micnote");
  if(!SR){note.textContent="Voice input is not available in this browser view. Type your question below; the answer will still be read aloud.";$("#vq").focus();return;}
  if(REC){try{REC.stop();}catch(e){}return;}
  try{REC=new SR();REC.lang=$("#vlang").value;REC.interimResults=true;REC.maxAlternatives=1;
    REC.onresult=e=>{$("#vq").value=[...e.results].map(r=>r[0].transcript).join(" ");};
    REC.onerror=e=>{note.textContent=e.error==="not-allowed"||e.error==="service-not-allowed"?"The microphone is blocked in this view. Type your question instead; answers are still read aloud.":"Could not hear clearly. Tap the mic and try again, or type.";};
    REC.onend=()=>{btn.classList.remove("live");REC=null;if($("#vq").value.trim())ACT["v-go"]();};
    REC.start();btn.classList.add("live");note.textContent="Listening… tap again to stop.";}
  catch(e){REC=null;note.textContent="The microphone is not available here. Type your question instead.";}
}
document.addEventListener("click",e=>{const el=e.target.closest("[data-act]");if(!el)return;const f=ACT[el.dataset.act];if(f){if(el.tagName!=="A")e.preventDefault();f(el,e);}});
document.addEventListener("click",e=>{if(e.target.id==="sheet")e.target.hidden=true;});
document.addEventListener("click",e=>{const x=e.target.closest(".recall .fbox, .recall .fcol");if(x)x.classList.add("shown");});
document.addEventListener("change",e=>{const el=e.target;const a=el.dataset.actChange;
  if(a==="lang"){S.lang=el.value;save();$$("#langSel").forEach(s=>s.value=S.lang);toast(S.lang==="hinglish"?"AI answers in Hinglish":"AI answers in English");}
  if(a==="ptask"){const d=S.plan.days[+el.dataset.d].items[+el.dataset.j];d.done=el.checked;save();el.closest(".task").classList.toggle("done",el.checked);if(el.checked)addXP(5,"task done");}
});
document.addEventListener("keydown",e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.target.isContentEditable;
  if(e.key==="Escape"){const d=$("#drawer");if(d&&!d.hidden){ACT.drawer();return;}const r=$("#qres");if(r)r.hidden=true;}
  if(e.target.id==="q"&&["ArrowDown","ArrowUp","Enter"].includes(e.key)){const items=$$("#qres a");if(!items.length)return;let i=items.findIndex(a=>a.classList.contains("act"));
    if(e.key==="Enter"){e.preventDefault();(items[i]||items[0]).click();return;}e.preventDefault();items.forEach(a=>a.classList.remove("act"));i=e.key==="ArrowDown"?(i+1)%items.length:(i-1+items.length)%items.length;items[i].classList.add("act");items[i].scrollIntoView({block:"nearest"});return;}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==="/"){e.preventDefault();$("#q")?.focus();return;}
  const opts=$$(".opt:not([disabled])");if(opts.length){const m={"1":0,"2":1,"3":2,"4":3,"a":0,"b":1,"c":2,"d":3}[e.key.toLowerCase()];if(m!=null&&opts[m]){e.preventDefault();opts[m].click();return;}}
  if(e.key==="Enter"&&$("#qnext")){e.preventDefault();$("#qnext").click();return;}
  if($("#fc")&&!$("#drawer:not([hidden])")){if(e.key===" "){e.preventDefault();$("#fc").click();}else if(e.key==="ArrowRight")$("#fcnext").click();else if(e.key==="ArrowLeft")$("#fcprev").click();else if(e.key.toLowerCase()==="k")$("#fcgot").click();}
});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&e.target.id==="drq"){e.preventDefault();ACT["dr-go"]();}if(e.key==="Enter"&&!e.shiftKey&&e.target.id==="tq"){e.preventDefault();tutorSend();}if(e.key==="Enter"&&e.target.id==="labask"){e.preventDefault();ACT["lab-ask"]();}});

function applyFS(){document.documentElement.style.fontSize=S.fs+"%";}
