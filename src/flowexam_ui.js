/* ============ Flowchart exam packs + viewer polish ============ */
const RQ_T={L:["LAQ","L"],S:["Short note","S"],D:["Difference","D"],V:["Viva","N"]};
function faResolve(f){const fa=FA[f.id];if(!fa)return null;const a=fa.ans&&ANS[fa.ans];
  return {sh:fa.sh||(a&&a.sh)||"",m:fa.m||(a&&a.m)||[],x:(a&&a.l&&a.l.x)||[],li:fa.li||(a&&a.l&&a.l.i)||f.sum,lc:fa.lc||(a&&a.l&&a.l.c)||"",r:fa.r||(a&&a.r)||"",rq:fa.rq||[],fig:a&&a.l&&a.l.f};}
function flowText(nodes){const out=[];const lab=x=>typeof x==="string"?x:Array.isArray(x)?x[0]:x;
  nodes.forEach((n,i)=>{if(typeof n==="string"||Array.isArray(n))out.push(lab(n));else if(n.k)out.push("⇒ "+lab(n.k));else if(n.b)out.push(n.b.map(col=>"["+col.filter(x=>typeof x==="string"||Array.isArray(x)).map(lab).join(" → ")+"]").join("   |   "));});
  return out.join("\n   ↓\n");}
let FX_TAB="tip";
function examPackHTML(f){const P=faResolve(f);
  if(!P)return f.exam?`<section class="card stack expack"><h2>Exam tip</h2><p>${esc(f.exam)}</p></section>`:"";
  return `<section class="card stack expack" data-s="${f.s}" id="expack"><div class="row between"><div><span class="eyebrow">Exam pack · works offline</span><h2>Questions & model answers</h2></div><span class="note">${P.rq.length} related questions · 3 answer lengths</span></div>
  <div class="anstabs" role="tablist">${[["tip","Exam tip & questions"],["sh","Short · 2–3 marks"],["m","Medium · 5 marks"],["l","Long · 10 marks"]].map(t=>`<button role="tab" aria-selected="${FX_TAB===t[0]}" class="${FX_TAB===t[0]?"on":""}" data-act="fx-tab" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>
  <div class="ansbody" id="fxbody">${fxBody(f,P,FX_TAB)}</div>
  <div class="ansfoot"><span class="note"><b>Read more in:</b> ${esc(P.r)}</span><div class="row"><button class="btn sm" data-act="fl-answer">Ask AI for another version</button>${stopBtn("flans")}</div><div class="ai-out" id="flans"></div></div></section>`;}
function fxBody(f,P,tab){const nodes=flatFlow(f.n);
  if(tab==="tip")return `<div class="tipbox"><b>Exam tip</b><p>${esc(f.exam)}</p></div><h4>Related exam questions</h4><p class="note">Try answering in your head first, then reveal the model answer.</p><div class="rqlist">${P.rq.map((q,i)=>`<div class="rq"><button class="rqq" data-act="rq-toggle" aria-expanded="false"><span class="tag ${RQ_T[q[0]][1]}">${RQ_T[q[0]][0]}</span><span>${esc(q[1])}</span><span class="chev" aria-hidden="true">▾</span></button><div class="rqa" hidden><p>${esc(q[2])}</p></div></div>`).join("")}</div>`;
  if(tab==="sh")return `<p>${esc(P.sh)}</p>`;
  if(tab==="m")return P.m.map(secHTML).join("");
  return `<h4>Introduction</h4><p>${esc(P.li)}</p>${P.m.map(secHTML).join("")}${P.x.map(secHTML).join("")}
   <h4>Step-by-step explanation of the flowchart</h4><ol class="walk">${nodes.map(n=>`<li><b>${esc(n.label)}</b>${n.exp?` — ${esc(n.exp)}`:""}</li>`).join("")}</ol>
   ${(f.terms&&f.terms.length)?`<h4>Key terms</h4><ul>${f.terms.map(t=>`<li><b>${esc(t[0])}:</b> ${esc(t[1])}</li>`).join("")}</ul>`:""}
   <h4>Diagram to draw</h4><pre class="diag">${esc(flowText(f.n))}</pre>${P.lc?`<h4>Conclusion</h4><p>${esc(P.lc)}</p>`:""}`;}
function flSeen(id){S.flowSeen=S.flowSeen||{};return new Set(S.flowSeen[id]||[]);}
function flMark(id,i){const s=flSeen(id);s.add(i);S.flowSeen[id]=[...s];save();return s;}
function flProgressHTML(id,n){const s=flSeen(id).size;return `<div class="flprog"><div class="bar"><i style="width:${Math.round(s/n*100)}%;background:var(--sc)"></i></div><span class="note">${s}/${n} steps explored</span></div>`;}
Object.assign(ACT,{
 "fx-tab":el=>{FX_TAB=el.dataset.t;const f=FLOWMAP[location.hash.slice(4)];const P=faResolve(f);$("#fxbody").innerHTML=fxBody(f,P,FX_TAB);$$('#expack [data-act="fx-tab"]').forEach(b=>{const on=b.dataset.t===FX_TAB;b.classList.toggle("on",on);b.setAttribute("aria-selected",on);});},
 "rq-toggle":el=>{const a=el.nextElementSibling;a.hidden=!a.hidden;el.setAttribute("aria-expanded",!a.hidden);el.classList.toggle("open",!a.hidden);},
 "fl-dot":el=>flSelect(+el.dataset.ni)
});
