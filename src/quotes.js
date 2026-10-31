/* ============ Daily inspiration — original quotes, rotate every day ============ */
const QUOTES=[
 ["life","Life","🌿",[
  "Life isn't measured in the chapters you finish, but in the person you become while reading them.",
  "Some days you heal others; some days you heal yourself. Both count.",
  "Breathe. The syllabus is long, but so is the beautiful life you are building.",
  "A gentle day is still a day of progress.",
  "Life rarely waits for perfect timing — it rewards the courage to begin anyway.",
  "Every small kindness you offer today becomes someone's reason to believe tomorrow.",
  "Rest is not the opposite of work; it is what lets the work last.",
  "Your life is a slow, beautiful case history — write it with care."]],
 ["love","Love","💗",[
  "Love is the quiet hand on your shoulder that says, ‘Keep going, I'm proud of you.’",
  "The best medicine has always been someone who believes in you.",
  "Love grows the way knowledge does — a little more each day, never in a hurry.",
  "You are loved on the days you shine and on the days you simply survive.",
  "Behind every late night of study is a heart cheering you on.",
  "Love doesn't lighten the load; it makes you strong enough to carry it.",
  "Some people are a home you can return to between every hard chapter.",
  "Be as gentle with your own heart as you are with your patients."]],
 ["journey","Journey","🧭",[
  "Every expert was once a beginner who refused to give up.",
  "The road to ‘Doctor’ is paved with ordinary days done well.",
  "Don't compare your chapter one to someone else's chapter twenty.",
  "Slow progress is still progress — the stethoscope waits for those who keep walking.",
  "The journey teaches what no textbook can: patience, humility and heart.",
  "Look back sometimes — you've already climbed further than you once believed you could.",
  "Detours are part of the map, not the end of it.",
  "One page, one concept, one day at a time — that's how mountains are crossed."]],
 ["goal","Dedication & Goals","🎯",[
  "Discipline is choosing what you want most over what you want now.",
  "Goals are dreams with a timetable — and you are writing yours today.",
  "Show up on the dull days; that's where the real difference is made.",
  "Dedication isn't loud. It's the light still on at midnight.",
  "Set the goal, break it into today, and then simply do today.",
  "Ten honest minutes every day will outrun one heroic night.",
  "Your future patients are counting on the effort you make today.",
  "Focus on the next right step; the goal will meet you halfway."]],
 ["dream","Dreams","✨",[
  "Dream in white coats; work in small, steady steps.",
  "Your dreams are not too big — your days just haven't caught up with them yet.",
  "Keep your dream close enough to see and far enough to keep you growing.",
  "Every dream you've ever had is waiting on the other side of today's effort.",
  "Dreams don't expire; they simply wait for you to be ready.",
  "Hold your dream like a stethoscope — close to your heart.",
  "The world needs the doctor you are dreaming of becoming.",
  "Dream boldly, study patiently, believe completely."]],
 ["win","Achievement","🏆",[
  "Celebrate the small wins — they are the stepping stones of great ones.",
  "Achievement is just persistence wearing its finest clothes.",
  "Every chapter completed is a promise kept to your future self.",
  "Success isn't one exam; it's every single time you didn't quit.",
  "Today's effort becomes tomorrow's confidence in the viva.",
  "Be proud of how far you've come and excited for where you're going.",
  "The marks will come; the knowledge you build stays forever.",
  "Great doctors aren't born — they're made, one finished day at a time."]]];
let QSHIFT={};
function dayNo(){const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);}
function quoteFor(i){const q=QUOTES[i][3];return q[(dayNo()+i*3+(QSHIFT[i]||0))%q.length];}
function quoteCard(i){const [id,name,emo]=QUOTES[i];return `<figure class="qt" data-q="${id}"><div class="qt-top"><span class="qt-emo" aria-hidden="true">${emo}</span><span class="qt-cat">${name}</span><button class="qt-more" data-act="qnext" data-i="${i}" aria-label="Show another ${name} quote" title="Another one">↻</button></div><blockquote>“${esc(quoteFor(i))}”</blockquote></figure>`;}
function quotesSection(){const d=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long"});
  return `<section class="stack qsec">${hwHead(`Fresh every day · ${d}`,"Daily inspiration 💫")}<div class="qgrid" id="qgrid">${QUOTES.map((_,i)=>quoteCard(i)).join("")}</div></section>`;}
Object.assign(ACT,{qnext:el=>{const i=+el.dataset.i;QSHIFT[i]=(QSHIFT[i]||0)+1;const f=el.closest(".qt");f.outerHTML=quoteCard(i);const n=$(`#qgrid .qt[data-q="${QUOTES[i][0]}"]`);n&&n.classList.add("flip");}});
