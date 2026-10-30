/* ============ Offline answers viewer ============ */
const ANS_TABS=[["s","Simplify"],["sh","Short · 2–3 marks"],["m","Medium · 5 marks"],["l","Long · 10 marks"]];
const hasAns=(c,k)=>!!ANS[c+":"+k];
const ansCount=c=>CH[c].topics.filter((_,k)=>hasAns(c,k)).length;
function defTab(t){return t[2]==="L"?"l":(t[2]==="S"||t[2]==="D")?"m":"sh";}
function secHTML(sec){const [h,v]=sec;let body;
  if(typeof v==="string")body=`<p>${esc(v)}</p>`;
  else if(Array.isArray(v)&&Array.isArray(v[0]))body=`<div class="tablewrap"><table class="plain anstbl"><thead><tr>${v[0].map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${v.slice(1).map(r=>`<tr>${r.map((x,i)=>i?`<td>${esc(x)}</td>`:`<td><b>${esc(x)}</b></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  else body=`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
  return `<h4>${esc(h)}</h4>${body}`;}
function wordsOf(html){return html.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length;}
function ansBody(a,tab){
  if(tab==="s"){const [idea,ana,pts,hook]=a.s;return `<p class="big">${esc(idea)}</p><div class="analogy"><b>Think of it like this</b><p>${esc(ana)}</p></div><ul>${pts.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="hook"><b>Memory hook</b> ${esc(hook)}</div>`;}
  if(tab==="sh")return `<p>${esc(a.sh)}</p>`;
  if(tab==="m")return a.m.map(secHTML).join("");
  const L=a.l||{};return `${L.i?`<h4>Introduction</h4><p>${esc(L.i)}</p>`:""}${a.m.map(secHTML).join("")}${(L.x||[]).map(secHTML).join("")}${L.f?`<h4>Diagram / flowchart to draw</h4><pre class="diag">${esc(L.f)}</pre>`:""}${L.c?`<h4>Conclusion</h4><p>${esc(L.c)}</p>`:""}`;}
function ansPanel(c,k,uid,tab){const t=CH[c].topics[k];const a=ANS[c+":"+k];
  if(!a)return `<div class="anspanel" data-c="${c}" data-k="${k}" data-u="${uid}"><p class="notice">The offline answer for <b>${esc(t[0])}</b> hasn't been written yet. Answers are being added subject by subject (Pathology first). Meanwhile you can generate one with AI:</p>
   <div class="row"><button class="btn sm" data-act="ans-gen" data-len="simplify" data-c="${c}" data-k="${k}" data-u="${uid}">Simplify</button><button class="btn sm" data-act="ans-gen" data-len="short" data-c="${c}" data-k="${k}" data-u="${uid}">Short</button><button class="btn sm" data-act="ans-gen" data-len="medium" data-c="${c}" data-k="${k}" data-u="${uid}">Medium</button><button class="btn sm" data-act="ans-gen" data-len="long" data-c="${c}" data-k="${k}" data-u="${uid}">Long</button>${stopBtn("ans"+uid)}</div><div class="ai-out" id="ag-${uid}"></div></div>`;
  tab=tab||defTab(t);const body=ansBody(a,tab);
  return `<div class="anspanel" data-c="${c}" data-k="${k}" data-u="${uid}"><div class="anstabs" role="tablist">${ANS_TABS.map(x=>`<button role="tab" aria-selected="${x[0]===tab}" class="${x[0]===tab?"on":""}" data-act="ans-tab" data-t="${x[0]}" data-c="${c}" data-k="${k}" data-u="${uid}">${x[1]}</button>`).join("")}<span class="note offl">✓ Works offline</span></div>
  <div class="ansbody">${body}</div>
  <div class="ansfoot"><span class="note">${tab==="s"?"":`≈ ${wordsOf(body)} words · `}<b>Read more in:</b> ${esc(a.r)}</span>
  <div class="row"><input class="ansq" id="aq-${uid}" placeholder="Need more detail? e.g. explain the mechanism of Ca²⁺ injury" aria-label="Ask for more detail"><button class="btn sm" data-act="ans-ask" data-c="${c}" data-k="${k}" data-u="${uid}" data-tab="${tab}">Ask AI</button>${stopBtn("ans"+uid)}</div><div class="ai-out" id="ag-${uid}"></div></div></div>`;}
function ansText(a,tab){const tmp=document.createElement("div");tmp.innerHTML=ansBody(a,tab);return tmp.textContent.replace(/\s+/g," ").trim().slice(0,6000);}
Object.assign(ACT,{
 "ans-open":el=>{const u=el.dataset.u,box=document.getElementById(u);if(!box)return;if(box.dataset.open==="1"){box.innerHTML="";box.dataset.open="";el.setAttribute("aria-expanded","false");return;}
   box.innerHTML=ansPanel(el.dataset.c,+el.dataset.k,u);box.dataset.open="1";el.setAttribute("aria-expanded","true");},
 "ans-tab":el=>{const u=el.dataset.u,box=document.getElementById(u);box.innerHTML=ansPanel(el.dataset.c,+el.dataset.k,u,el.dataset.t);box.dataset.open="1";const b=box.querySelector(`[data-t="${el.dataset.t}"]`);b&&b.focus();},
 "ans-ask":el=>{const c=el.dataset.c,k=+el.dataset.k,u=el.dataset.u;const q=document.getElementById("aq-"+u).value.trim();if(!q){document.getElementById("aq-"+u).focus();return;}
   const a=ANS[c+":"+k],t=CH[c].topics[k];aiStream(document.getElementById("ag-"+u),`${RULES()}${ctx(CH[c])}\n\nThe student is reading this model answer on "${t[0]}":\n"""${ansText(a,el.dataset.tab)}"""\n\nTheir follow-up question: ${q}\nAnswer it clearly, building on the model answer, in under 250 words.`,{key:"ans"+u});},
 "ans-gen":el=>{const c=el.dataset.c,k=+el.dataset.k,u=el.dataset.u,len=el.dataset.len,t=CH[c].topics[k];
   const spec={simplify:"Explain it in very simple language: big idea, an everyday analogy, 4–6 plain bullet points, a memory hook. Under 220 words.",short:"Write a 2–3 mark short answer (60–90 words): definition plus key facts.",medium:"Write a 5-mark answer (200–260 words) with headings and must-write points; use a table if it is a difference question.",long:"Write a 10-mark long answer (400–550 words): definition/introduction, headed sections (etiology, pathogenesis/mechanism, features, diagnosis or uses, complications), a flowchart or table in text, and a conclusion."}[len];
   aiStream(document.getElementById("ag-"+u),`${RULES()}${ctx(CH[c])}\n\nTopic: "${t[0]}". ${spec} End with which standard textbook chapter to read.`,{key:"ans"+u});}
});
