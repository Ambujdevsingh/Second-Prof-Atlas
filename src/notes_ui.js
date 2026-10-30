/* ============ Notes & Books: PDF reader with page bookmarks ============ */
const PDFJS_V="3.11.174";
const DOCS=[
 {id:"syl-path",t:"Pathology: past-paper priority list",s:"path",src:"docs/syllabus-pathology.pdf",hosted:true,desc:"Seniors' chapter-wise list of LAQs and short notes with star ratings.",
  toc:[[1,"Cell injury, immunopathology, haemodynamics"],[2,"Inflammation, healing, neoplasia, nutrition"],[3,"Genetics, anaemias, bleeding, WBC, blood vessels"],[4,"Heart, respiratory, GIT"],[5,"Liver, kidney, male & female genital tract"],[6,"Breast, skin, endocrine, bone, CNS, cytology"]],
  ch:{path1:1,path3:1,path4:1,path2:2,path5:2,path6:2,path7:3,path8:3,path9:3,path10:3,path11:4,path12:4,path13:5,path14:5,path15:5,path16:6,path17:6,path18:2}},
 {id:"syl-micro",t:"Microbiology: past-paper priority list",s:"micro",src:"docs/syllabus-microbiology.pdf",hosted:true,desc:"General, immunology, bacteriology, virology, parasitology, mycology and applied topics with stars.",
  toc:[[1,"General bacteriology, immunology begins"],[2,"Immunology (serology, hypersensitivity), Staph, Strep"],[3,"Pneumococcus, Neisseria, C. diphtheriae, Bacillus, Clostridium, E. coli"],[4,"Shigella, Salmonella, Vibrio, Pseudomonas, H. influenzae, M. tuberculosis"],[5,"M. leprae, spirochaetes, Chlamydia, virology, polio"],[6,"Influenza, arboviruses, rabies, hepatitis B, protozoa"],[7,"Toxoplasma, helminths, enumerations"],[8,"HIV, mycology, clinical microbiology"]],
  ch:{micro1:1,micro2:1,micro3:2,micro4:3,micro5:4,micro6:5,micro7:6,micro8:6,micro9:8,micro10:8,micro11:5,micro12:6,micro13:8}},
 {id:"syl-pharm",t:"Pharmacology: past-paper priority list",s:"pharm",src:"docs/syllabus-pharmacology.pdf",hosted:true,desc:"General pharmacology to chemotherapy, with MOA/ADR/uses prompts and stars.",
  toc:[[1,"General pharmacology, ANS begins"],[2,"ANS, autacoids, respiratory drugs"],[3,"Hormones, muscle relaxants, local anaesthetics, CNS begins"],[4,"Antiarrhythmics, antianginals, antihypertensives, diuretics, blood"],[5,"CNS drugs, ACE inhibitors, CHF"],[6,"GIT drugs, antimicrobials, anti-TB"],[7,"Antifungal, antiviral, antimalarial, anthelmintics"],[8,"Anticancer, immunosuppressants, chelators, vitamins, vaccines"]],
  ch:{pharm1:1,pharm2:2,pharm3:2,pharm4:3,pharm5:3,pharm6:5,pharm7:4,pharm8:4,pharm9:6,pharm10:6,pharm11:7,pharm12:8,pharm13:3,pharm14:3,pharm15:1}},
 {id:"note-ddi",t:"Pharmacology class notes: drug interactions",s:"pharm",src:"docs/notes-drug-interactions.pdf",hosted:true,desc:"Lecture slides with handwritten effects and outcomes of common drug pairs.",
  toc:[[1,"Atropine–levodopa to warfarin–NSAIDs"],[2,"Tetracycline–iron to insulin–β-blockers"]],ch:{pharm1:1}},
 {id:"bk-mfm",t:"M for Microbiology",s:"micro",own:true,pages:184,desc:"184-page microbiology notes, from general bacteriology onwards."},
 {id:"bk-pmf",t:"Patho Main File",s:"path",own:true,pages:72,desc:"72-page pathology main file."},
 {id:"bk-pb1",t:"Pathology Prof Buster: Paper 1",s:"path",own:true,pages:272,desc:"General pathology and haematology, chapters 1–12."},
 {id:"bk-pb2",t:"Pathology Prof Buster: Paper 2",s:"path",own:true,pages:348,desc:"Systemic pathology, chapters 13 onwards."}];
const DOCMAP=()=>{const m={};DOCS.forEach(d=>m[d.id]=d);(S.mybooks||[]).forEach(d=>m[d.id]={...d,own:true,custom:true});return m;};

/* ---- IndexedDB for students' own PDFs (stays in this browser) ---- */
function idb(){return new Promise((res,rej)=>{try{const r=indexedDB.open("atlas-books",1);r.onupgradeneeded=()=>r.result.createObjectStore("files");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});}
const MEMBOOKS={};
async function bookPut(id,file){MEMBOOKS[id]=file;try{const db=await idb();await new Promise((res,rej)=>{const tx=db.transaction("files","readwrite");tx.objectStore("files").put({name:file.name,size:file.size,blob:file},id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});return true;}catch(e){return false;}}
async function bookGet(id){if(MEMBOOKS[id])return MEMBOOKS[id];try{const db=await idb();return await new Promise(res=>{const r=db.transaction("files").objectStore("files").get(id);r.onsuccess=()=>res(r.result?r.result.blob:null);r.onerror=()=>res(null);});}catch(e){return null;}}
async function bookDel(id){delete MEMBOOKS[id];try{const db=await idb();db.transaction("files","readwrite").objectStore("files").delete(id);}catch(e){}}
async function bookList(){const out={};try{const db=await idb();await new Promise(res=>{const st=db.transaction("files").objectStore("files");const r=st.openCursor();r.onsuccess=()=>{const c=r.result;if(c){out[c.key]={name:c.value.name,size:c.value.size};c.continue();}else res();};r.onerror=()=>res();});}catch(e){}Object.entries(MEMBOOKS).forEach(([k,f])=>{if(!out[k])out[k]={name:f.name,size:f.size,session:true};});return out;}

/* ---- pdf.js loader (main-thread worker, CDN scripts only) ---- */
let PDFJS_P=null;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("load "+src));document.head.appendChild(s);});}
function pdfjs(){if(!PDFJS_P){const base=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_V}/`;PDFJS_P=loadScript(base+"pdf.worker.min.js").then(()=>loadScript(base+"pdf.min.js")).then(()=>{const L=window.pdfjsLib;L.GlobalWorkerOptions.workerSrc=base+"pdf.worker.min.js";return L;}).catch(e=>{PDFJS_P=null;throw e;});}return PDFJS_P;}

let NT_TAB="library", BM_S="all", RD={doc:null,pdf:null,page:1,zoom:1,task:null,goto:null};
const fmtMB=b=>(b/1048576).toFixed(b>10485760?0:1)+" MB";

function vNotes(){POST=()=>drawNotes();
  return `<header class="stack"><span class="eyebrow">Read & bookmark</span><h1>Notes & Books</h1><p class="muted">Open the reference PDFs, jump to any page and bookmark important topics by subject and page. Bookmarks and your own books stay in this browser.</p></header>
  <div class="row" role="tablist"><button class="btn ${NT_TAB==="library"?"pri":""}" data-act="nt-tab" data-t="library" role="tab" aria-selected="${NT_TAB==="library"}">${ico("book",18)} Library</button><button class="btn ${NT_TAB==="bm"?"pri":""}" data-act="nt-tab" data-t="bm" role="tab" aria-selected="${NT_TAB==="bm"}">${ico("bookmark",18)} Bookmarks (${(S.bm||[]).length})</button></div>
  <div id="ntbody" class="stack"></div>`;}
async function drawNotes(){const b=$("#ntbody");if(!b)return;
  if(NT_TAB==="bm"){b.innerHTML=bmListHTML();return;}
  b.innerHTML=`<p class="note">Loading library…</p>`;const have=await bookList();if(!$("#ntbody"))return;const M=DOCMAP();
  const hosted=DOCS.filter(d=>d.hosted),own=DOCS.filter(d=>d.own),custom=(S.mybooks||[]);
  const card=d=>{const h=have[d.id];const n=(S.bm||[]).filter(x=>x.doc===d.id).length;const s=SUB[d.s];
    return `<div class="doccard" data-s="${d.s}"><div class="docicon">${ico("doc",22)}</div><div class="stack" style="gap:4px;min-width:0"><span class="eyebrow" style="color:var(--sc)">${esc(s?s.name:"General")}</span><b>${esc(d.t)}</b><span class="note">${esc(d.desc||"")}</span>
    <span class="row" style="gap:6px">${d.hosted?'<span class="chip">Included</span>':h?`<span class="chip" style="color:var(--good)">✓ Added · ${fmtMB(h.size)}${h.session?" (this session only)":""}</span>`:'<span class="chip">Not added yet</span>'}${n?`<span class="chip">${n} bookmark${n>1?"s":""}</span>`:""}</span>
    <div class="row">${(d.hosted||h)?`<a class="btn sm pri" href="#read-${d.id}">Read</a>`:""}${d.own?`<label class="btn sm"><input type="file" accept="application/pdf" class="sr" data-act-change="bk-file" data-id="${d.id}">${h?"Replace PDF":"Add my PDF"}</label>${h?`<button class="btn sm ghost" data-act="bk-del" data-id="${d.id}">Remove</button>`:""}`:""}${d.custom?`<button class="btn sm ghost" data-act="bk-forget" data-id="${d.id}">Delete entry</button>`:""}</div></div></div>`;};
  b.innerHTML=`<section class="stack"><h2>Included reference documents</h2><p class="note">Your seniors' past-paper priority lists and class notes, available to every student.</p><div class="grid g2">${hosted.map(card).join("")}</div></section>
  <section class="stack"><h2>Your books</h2><p class="notice">These books are copyrighted study material, so they aren't hosted on the website. Add your own PDF copy once; it is saved only in this browser on this device, never uploaded.</p><div class="grid g2">${own.map(card).join("")}${custom.map(card).join("")}</div></section>
  <section class="card stack"><h2>Add another PDF</h2><div class="grid g3"><div class="field"><label for="nbt">Title</label><input id="nbt" placeholder="e.g. KD Tripathi notes"></div><div class="field"><label for="nbs">Subject</label><select id="nbs">${SUBJECTS.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></div><div class="field"><label for="nbf">PDF file</label><input id="nbf" type="file" accept="application/pdf"></div></div><div class="row"><button class="btn pri" data-act="bk-addnew">Add to library</button></div></section>`;
}
function bmListHTML(){const M=DOCMAP();const all=(S.bm||[]).filter(x=>M[x.doc]);
  const list=all.filter(x=>BM_S==="all"||x.s===BM_S).sort((a,b)=>a.s.localeCompare(b.s)||a.doc.localeCompare(b.doc)||a.page-b.page);
  const chips=`<div class="row" role="group" aria-label="Subject"><button class="btn sm ${BM_S==="all"?"pri":""}" data-act="bm-s" data-s="all">All (${all.length})</button>${SUBJECTS.map(s=>`<button class="btn sm ${BM_S===s.id?"pri":""}" data-act="bm-s" data-s="${s.id}">${esc(s.name)} (${all.filter(x=>x.s===s.id).length})</button>`).join("")}</div>`;
  if(!list.length)return chips+`<section class="card stack"><h2>No bookmarks yet</h2><p class="note">Open any document from the Library, go to a page and press <b>Bookmark this page</b>.</p></section>`;
  const bySub={};list.forEach(x=>(bySub[x.s]=bySub[x.s]||[]).push(x));
  return chips+Object.entries(bySub).map(([sid,arr])=>`<section class="card stack" data-s="${sid}"><h2 style="color:var(--sc)">${esc(SUB[sid].name)}</h2>${[...new Set(arr.map(x=>x.doc))].map(did=>`<div class="stack" style="gap:6px"><b>${esc(M[did].t)}</b>${arr.filter(x=>x.doc===did).map(x=>`<div class="bmrow"><a class="pg" href="#read-${did}" data-act="bm-open" data-id="${x.id}">p.${x.page}</a><div style="min-width:0"><b>${esc(x.title)}</b>${x.ch&&CH[x.ch]?` <a class="note" href="#c-${x.ch}">· ${esc(CH[x.ch].t)}</a>`:""}${x.note?`<p class="note">${esc(x.note)}</p>`:""}</div><button class="btn sm ghost" data-act="bm-del" data-id="${x.id}" aria-label="Delete bookmark">✕</button></div>`).join("")}</div>`).join("")}</section>`).join("");}

function vRead(id){const d=DOCMAP()[id];if(!d)return `<p>Document not found.</p>`;RD.doc=d;RD.pdf=null;RD.page=RD.goto||1;RD.goto=null;
  POST=()=>openDoc(d);
  return `<header class="ch-head" data-s="${d.s}"><div class="crumbs"><a href="#notes">Notes & Books</a> / ${esc(SUB[d.s]?SUB[d.s].name:"")}</div><h1 style="font-size:clamp(1.4rem,2.6vw,2rem)">${esc(d.t)}</h1>
  <div class="row rdbar"><button class="btn sm" data-act="rd-prev" aria-label="Previous page">←</button><span class="row" style="gap:6px"><label for="rdpg" class="note">Page</label><input id="rdpg" type="number" min="1" value="${RD.page}" style="width:72px" class="pgin"><span class="note" id="rdtot">of …</span></span><button class="btn sm" data-act="rd-next" aria-label="Next page">→</button>
  <span class="row" style="gap:4px"><button class="btn sm" data-act="rd-zoom" data-z="-0.25" aria-label="Zoom out">−</button><span class="note" id="rdz">100%</span><button class="btn sm" data-act="rd-zoom" data-z="0.25" aria-label="Zoom in">+</button></span>
  <button class="btn sm pri" data-act="bm-form">${ico("bookmark",16)} Bookmark this page</button><button class="btn sm" data-act="rd-ai">Explain this page with AI</button>${stopBtn("rdai")}</div></header>
  <div class="rdview" data-s="${d.s}"><section class="card rdcanvas" id="rdwrap"><div id="rdmsg" class="note">Opening document…</div><canvas id="rdc" hidden></canvas></section>
  <aside class="stack rdside"><div class="card stack" id="bmform" hidden></div><div class="ai-out" id="rdai"></div>
  ${d.toc?`<div class="card stack"><h3>Contents</h3>${d.toc.map(t=>`<button class="tocrow" data-act="rd-go" data-p="${t[0]}"><span class="pg">p.${t[0]}</span><span>${esc(t[1])}</span></button>`).join("")}</div>`:""}
  <div class="card stack"><h3>Bookmarks in this document</h3><div id="rdbms"></div></div></aside></div>`;}
async function openDoc(d){const msg=$("#rdmsg");
  try{const L=await pdfjs();let src;
    if(d.hosted){const r=await fetch(d.src);if(!r.ok)throw new Error("fetch");src={data:new Uint8Array(await r.arrayBuffer())};}
    else{const blob=await bookGet(d.id);if(!blob){msg.innerHTML=`This book isn't added on this device yet. <a href="#notes">Add your PDF in the Library</a>.`;return;}src={data:new Uint8Array(await blob.arrayBuffer())};}
    const pdf=await L.getDocument(src).promise;if(RD.doc!==d)return;RD.pdf=pdf;$("#rdtot").textContent=`of ${pdf.numPages}`;$("#rdpg").max=pdf.numPages;
    msg.hidden=true;$("#rdc").hidden=false;drawBmSide();renderPage(Math.min(RD.page,pdf.numPages));}
  catch(e){msg.innerHTML=`Could not open this PDF here. ${navigator.onLine===false?"You appear to be offline.":"Check your connection and try again."}`;}}
async function renderPage(n){const pdf=RD.pdf;if(!pdf)return;n=Math.max(1,Math.min(pdf.numPages,n|0||1));RD.page=n;$("#rdpg").value=n;
  try{RD.task&&RD.task.cancel();}catch(e){}
  const page=await pdf.getPage(n);const wrap=$("#rdwrap");if(!wrap)return;const cw=wrap.clientWidth-24;const base=page.getViewport({scale:1});
  const scale=cw/base.width*RD.zoom;const dpr=Math.min(2,window.devicePixelRatio||1);const vp=page.getViewport({scale:scale*dpr});
  const c=$("#rdc");c.width=vp.width;c.height=vp.height;c.style.width=(vp.width/dpr)+"px";c.style.height=(vp.height/dpr)+"px";
  $("#rdz").textContent=Math.round(RD.zoom*100)+"%";
  RD.task=page.render({canvasContext:c.getContext("2d"),viewport:vp});try{await RD.task.promise;}catch(e){}
  $$(".tocrow").forEach(b=>b.classList.toggle("on",+b.dataset.p===n));drawBmSide();}
function drawBmSide(){const el=$("#rdbms");if(!el||!RD.doc)return;const arr=(S.bm||[]).filter(x=>x.doc===RD.doc.id).sort((a,b)=>a.page-b.page);
  el.innerHTML=arr.length?arr.map(x=>`<div class="bmrow ${x.page===RD.page?"on":""}"><button class="pg" data-act="rd-go" data-p="${x.page}">p.${x.page}</button><div style="min-width:0"><b>${esc(x.title)}</b>${x.note?`<p class="note">${esc(x.note)}</p>`:""}</div><button class="btn sm ghost" data-act="bm-del" data-id="${x.id}" aria-label="Delete bookmark">✕</button></div>`).join(""):`<p class="note">No bookmarks yet. Go to a page and press Bookmark this page.</p>`;}
function bmFormHTML(){const d=RD.doc;const near=Object.entries(d.ch||{}).filter(([k,p])=>p===RD.page).map(([k])=>k);
  return `<div class="row between"><h3>Bookmark page ${RD.page}</h3><button class="btn sm ghost" data-act="bm-form" aria-label="Close">✕</button></div>
  <div class="field"><label for="bmt">Topic / title</label><input id="bmt" placeholder="e.g. DIC – pathogenesis" value=""></div>
  <div class="grid g2"><div class="field"><label for="bms">Subject</label><select id="bms">${SUBJECTS.map(s=>`<option value="${s.id}" ${s.id===d.s?"selected":""}>${esc(s.name)}</option>`).join("")}</select></div>
  <div class="field"><label for="bmc">Chapter (optional)</label><select id="bmc"><option value="">—</option>${SUBJECTS.map(s=>`<optgroup label="${esc(s.name)}">${s.chapters.map(c=>`<option value="${c.id}" ${near[0]===c.id?"selected":""}>${esc(s.short)} ${c.n}. ${esc(c.t)}</option>`).join("")}</optgroup>`).join("")}</select></div></div>
  <div class="field"><label for="bmn">Your note (optional)</label><textarea id="bmn" style="min-height:70px" placeholder="Why this page matters, mnemonic, exam year…"></textarea></div>
  <div class="row"><button class="btn pri" data-act="bm-save">Save bookmark</button></div>`;}
async function pageImage(){const c=$("#rdc");if(!c||c.hidden)return null;const maxW=1400;const k=Math.min(1,maxW/c.width);const t=document.createElement("canvas");t.width=Math.round(c.width*k);t.height=Math.round(c.height*k);const x=t.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,t.width,t.height);x.drawImage(c,0,0,t.width,t.height);return await new Promise(res=>t.toBlob(res,"image/jpeg",.82));}

Object.assign(ACT,{
 "nt-tab":el=>{NT_TAB=el.dataset.t;route();},
 "bm-s":el=>{BM_S=el.dataset.s;$("#ntbody").innerHTML=bmListHTML();},
 "bm-open":el=>{const x=(S.bm||[]).find(b=>b.id===el.dataset.id);if(x){RD.goto=x.page;}},
 "bm-del":el=>{S.bm=(S.bm||[]).filter(b=>b.id!==el.dataset.id);save();toast("Bookmark deleted");if(location.hash==="#notes")$("#ntbody").innerHTML=bmListHTML();else drawBmSide();},
 "bm-form":()=>{const f=$("#bmform");if(!RD.pdf){toast("Wait for the page to load");return;}f.hidden=!f.hidden;if(!f.hidden){f.innerHTML=bmFormHTML();$("#bmt").focus();f.scrollIntoView({block:"nearest"});}},
 "bm-save":()=>{const title=$("#bmt").value.trim()||`Page ${RD.page}`;S.bm=S.bm||[];S.bm.push({id:"b"+Date.now().toString(36),doc:RD.doc.id,page:RD.page,title,s:$("#bms").value,ch:$("#bmc").value,note:$("#bmn").value.trim(),d:today()});save();$("#bmform").hidden=true;drawBmSide();addXP(2,"page bookmarked");},
 "rd-prev":()=>renderPage(RD.page-1),
 "rd-next":()=>renderPage(RD.page+1),
 "rd-go":el=>renderPage(+el.dataset.p),
 "rd-zoom":el=>{RD.zoom=Math.max(.5,Math.min(3,RD.zoom+(+el.dataset.z)));renderPage(RD.page);},
 "rd-ai":async()=>{const out=$("#rdai");const img=await pageImage();if(!img){toast("Wait for the page to load");return;}
   aiStream(out,`${RULES()}\n\nThe attached image is page ${RD.page} of "${RD.doc.t}" (${SUB[RD.doc.s]?SUB[RD.doc.s].name:""}). It may be handwritten or a scanned book page. 1) Read and list the topics on the page. 2) Explain the most important ones clearly for exam preparation. 3) Point out anything that looks incorrect or outdated. 4) Give 3 quick self-test questions with answers. If the image is unreadable, say so.`,{key:"rdai",images:[img]});},
 "bk-del":async el=>{await bookDel(el.dataset.id);toast("Removed from this device");drawNotes();},
 "bk-forget":async el=>{const id=el.dataset.id;await bookDel(id);S.mybooks=(S.mybooks||[]).filter(b=>b.id!==id);S.bm=(S.bm||[]).filter(b=>b.doc!==id);save();drawNotes();},
 "bk-addnew":async()=>{const f=$("#nbf").files[0];const t=$("#nbt").value.trim();if(!f){toast("Choose a PDF file first");return;}if(f.type&&f.type!=="application/pdf"){toast("Please choose a PDF file");return;}
   const id="my-"+Date.now().toString(36);S.mybooks=S.mybooks||[];S.mybooks.push({id,t:t||f.name.replace(/\.pdf$/i,""),s:$("#nbs").value,desc:"Added by you."});save();const ok=await bookPut(id,f);toast(ok?"Added to your library":"Added for this session only (browser storage is unavailable)");drawNotes();}
});
document.addEventListener("change",async e=>{const el=e.target;
  if(el.dataset&&el.dataset.actChange==="bk-file"){const f=el.files[0];if(!f)return;if(f.type&&f.type!=="application/pdf"){toast("Please choose a PDF file");return;}toast("Saving your PDF…");const ok=await bookPut(el.dataset.id,f);toast(ok?"Saved in this browser":"Added for this session only (browser storage is unavailable)");drawNotes();}
  if(el.id==="rdpg")renderPage(+el.value);});
document.addEventListener("keydown",e=>{if(!location.hash.startsWith("#read-")||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;if(e.key==="ArrowRight"){e.preventDefault();renderPage(RD.page+1);}if(e.key==="ArrowLeft"){e.preventDefault();renderPage(RD.page-1);}});
let RD_RS;window.addEventListener("resize",()=>{clearTimeout(RD_RS);RD_RS=setTimeout(()=>{if(location.hash.startsWith("#read-")&&RD.pdf)renderPage(RD.page);},250);});
function syllabusLinks(chId){return DOCS.filter(d=>d.hosted&&d.ch&&d.ch[chId]).map(d=>`<a class="chip" href="#read-${d.id}" data-act="rd-preset" data-p="${d.ch[chId]}" style="text-decoration:none">${ico("doc",14)} ${esc(d.t)} · p.${d.ch[chId]}</a>`).join("");}
ACT["rd-preset"]=el=>{RD.goto=+el.dataset.p;};
