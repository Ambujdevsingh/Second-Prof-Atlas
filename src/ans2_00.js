/* Offline answers, part 2 — all remaining topics, every subject. Z(chapter, topicIndex, refs, simplify, short, medium, long). Original wording following standard textbooks. */
const RB={p:R_PATH,m:"Ananthanarayan & Paniker Textbook of Microbiology; Apurba Sastry Essentials of Medical Microbiology",ph:"KD Tripathi Essentials of Medical Pharmacology",cm:"Park's Textbook of Preventive and Social Medicine",f:"Narayan Reddy Essentials of Forensic Medicine & Toxicology"};
function Z(ch,k,r,s,sh,m,l){ANS[ch+":"+k]={r:RB[r]||r,s,sh,m,l:l||{}};}
