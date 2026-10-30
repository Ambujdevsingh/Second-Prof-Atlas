/* Flowchart exam packs (offline). FA[id] = {ans:"ch:k" (reuse topic model answer) | sh, m, li, lc; rq:[[type,question,answer]]}
   type: L long, S short note, D difference, V viva. Long answers add a node-by-node walk-through built from the flowchart's own explanations. */
const FA={};
const R_MICRO="Ananthanarayan & Paniker Textbook of Microbiology; Apurba Sastry Essentials of Medical Microbiology";
const R_PHARM="KD Tripathi Essentials of Medical Pharmacology; Padmaja Udaykumar";
const R_CM="Park's Textbook of Preventive and Social Medicine";
const R_FMT="Narayan Reddy Essentials of Forensic Medicine & Toxicology";

/* ---- Pathology ---- */
FA["p-injury"]={ans:"path1:0",rq:[
["S","List the morphological features of reversible cell injury.","Light microscopy: cell swelling (hydropic change), fatty change. EM: plasma membrane blebs, loss of microvilli, swollen mitochondria with small densities, dilated ER with detached ribosomes, nucleolar disaggregation, myelin figures."],
["S","Name two features that mark the point of no return.","Inability to restore mitochondrial function (no ATP) and profound disturbance of membrane function; morphologically, nuclear changes (pyknosis, karyorrhexis, karyolysis)."],
["V","Why does Ca²⁺ influx damage cells?","Raised cytosolic Ca²⁺ activates phospholipases (membranes), proteases (cytoskeleton), endonucleases (DNA) and ATPases (more ATP loss) and opens the mitochondrial permeability transition pore."],
["L","Describe the mechanisms of cell injury with a suitable diagram.","Answer with the long model answer: ATP depletion, mitochondrial damage, Ca²⁺ influx, ROS, membrane and DNA damage, ending in necrosis or apoptosis — draw this flowchart."]]};
FA["p-apoptosis"]={ans:"path1:3",rq:[
["D","Differentiate apoptosis and necrosis.","Apoptosis: single cells, shrinkage, intact membrane, apoptotic bodies, no inflammation, needs ATP, DNA ladder. Necrosis: groups, swelling, ruptured membrane, inflammation, smear on gel, always pathological."],
["S","Name the anti- and pro-apoptotic members of the BCL-2 family.","Anti-apoptotic: BCL-2, BCL-XL, MCL-1. Pro-apoptotic effectors: BAX, BAK. Sensors (BH3-only): BIM, BID, BAD, PUMA, NOXA."],
["V","What is the apoptosome?","A complex of cytochrome c, APAF-1 and procaspase-9 that activates caspase-9 in the intrinsic pathway."],
["S","Give physiological and pathological examples of apoptosis.","Physiological: embryogenesis, menstrual endometrium, thymic deletion, involution after weaning. Pathological: DNA damage by radiation/drugs, viral hepatitis (Councilman bodies), cytotoxic T-cell killing, duct-obstruction atrophy."]]};
FA["p-inflam"]={ans:"path2:0",rq:[
["S","Describe the cellular events of acute inflammation.","Margination and rolling (selectins), firm adhesion (integrins–ICAM-1/VCAM-1), transmigration (PECAM-1) in post-capillary venules, chemotaxis (C5a, LTB4, IL-8), phagocytosis with killing by the MPO–H2O2–halide system."],
["S","Name the mechanisms of increased vascular permeability.","Endothelial contraction (immediate transient), direct injury (immediate sustained), leukocyte-mediated injury (delayed prolonged), transcytosis (VEGF), leakage from new vessels."],
["V","Which molecule is responsible for leukocyte rolling?","Selectins (E-, P- and L-selectin) binding sialyl-Lewis X."],
["S","List the outcomes of acute inflammation.","Complete resolution, healing by fibrosis, abscess formation, progression to chronic inflammation."]]};
FA["p-granuloma"]={ans:"path2:3",rq:[
["L","Discuss the pathogenesis and morphology of tuberculosis.","Use the TB long answer: droplet infection, macrophage survival, TH1/IFN-γ response, caseating granuloma, primary (Ghon complex) and secondary TB, complications, lab diagnosis."],
["S","Describe the structure of a tubercle.","Central caseous necrosis surrounded by epithelioid cells, Langhans giant cells, a rim of lymphocytes and fibroblasts; hard tubercle lacks caseation."],
["V","Which cytokine is essential for granuloma formation?","IFN-γ from TH1 cells (with IL-12 from macrophages); TNF maintains it."],
["S","List causes of granulomatous inflammation.","Infections: TB, leprosy, syphilis, fungi (histoplasmosis), cat-scratch disease. Non-infective: sarcoidosis, Crohn's disease, foreign bodies (sutures, talc)."]]};
FA["p-healing"]={ans:"path2:6",rq:[
["D","Healing by first vs second intention.","First: clean apposed wound, little granulation tissue, minimal contraction, thin scar, quick. Second: large/infected wound, abundant granulation tissue, marked contraction by myofibroblasts, larger scar, slow."],
["S","List factors affecting wound healing.","Local: infection (most important), foreign body, poor blood supply, movement, size/site. Systemic: diabetes, malnutrition (protein, vitamin C, zinc), steroids, age, anaemia."],
["V","What is granulation tissue made of?","New capillaries (angiogenesis), proliferating fibroblasts, macrophages and loose oedematous matrix."],
["S","Complications of wound healing.","Deficient scar (dehiscence, ulcer), excessive scar (hypertrophic scar, keloid, proud flesh), contracture, implantation cyst, incisional hernia."]]};
FA["p-thrombo"]={ans:"path3:3",rq:[
["S","Describe the fate of a thrombus.","Propagation, embolisation, dissolution (fibrinolysis of recent thrombi) and organisation with recanalisation."],
["D","Ante-mortem thrombus vs post-mortem clot.","Thrombus: attached, dry, granular, lines of Zahn. Clot: unattached, rubbery, gelatinous with 'chicken fat' and 'currant jelly' layers, no lines of Zahn."],
["S","Define infarct and classify it.","Area of ischaemic necrosis due to occlusion of arterial supply or venous drainage. Pale (white) in solid organs with end arteries; red (haemorrhagic) in lung, intestine, venous occlusion, loose tissues."],
["L","Define embolism. Describe types with special reference to pulmonary thromboembolism.","Use the embolism long answer: thrombo-, fat, air, amniotic fluid emboli; PE from DVT — silent, infarct, saddle embolus with sudden death, pulmonary hypertension."]]};
FA["p-shock"]={ans:"path3:2",rq:[
["S","Pathogenesis of septic shock.","PAMPs (LPS) bind TLRs → TNF, IL-1, IL-6 → vasodilatation (NO), increased permeability, procoagulant state/DIC, metabolic disturbances and later immunosuppression."],
["S","Describe the stages of shock.","Non-progressive (compensated by sympathetic, RAAS, ADH), progressive (tissue hypoperfusion, lactic acidosis), irreversible (severe cell injury, organ failure)."],
["V","What is 'shock lung'?","Diffuse alveolar damage (ARDS) with hyaline membranes in shock, especially septic shock."],
["S","Morphological changes in organs in shock.","Brain: ischaemic encephalopathy; heart: subendocardial haemorrhage; lungs: ARDS; kidney: ATN; adrenals: lipid depletion; GIT: mucosal haemorrhage; liver: centrilobular necrosis."]]};
FA["p-carcino"]={ans:"path5:3",rq:[
["S","Write a note on chemical carcinogenesis.","Initiation (irreversible DNA mutation by carcinogen, often after P450 activation) → promotion (reversible proliferation by promoters like phorbol esters, hormones) → progression. Examples: benzpyrene, aflatoxin B1, β-naphthylamine, vinyl chloride."],
["S","Mechanism of invasion and metastasis.","Loss of E-cadherin, ECM degradation by MMPs, attachment to laminin/fibronectin, migration, intravasation, survival with platelets, extravasation, colonisation and angiogenesis."],
["V","Name the hallmarks of cancer.","Growth-signal self-sufficiency, insensitivity to inhibitors, evasion of apoptosis, limitless replication, angiogenesis, invasion/metastasis, altered metabolism, immune evasion."],
["S","How are oncogenes activated?","Point mutation (RAS), chromosomal translocation (BCR-ABL, MYC), gene amplification (HER2, N-MYC)."]]};
FA["p-ida"]={sh:"Iron deficiency anaemia is a microcytic hypochromic anaemia due to depleted body iron. It develops in stages: storage depletion (low ferritin), iron-deficient erythropoiesis (low serum iron, high TIBC, transferrin saturation < 16%) and frank anaemia. Commonest causes in India are nutritional deficiency, hookworm and menstrual or GI blood loss. Smear shows microcytic hypochromic cells and pencil cells; ferritin is the best single test.",
m:[["Etiology",["Increased loss: hookworm, menorrhagia, GI bleeding (peptic ulcer, piles, cancer)","Increased demand: pregnancy, infancy, adolescence","Decreased intake: vegetarian diet poor in haem iron","Malabsorption: celiac disease, gastrectomy, achlorhydria"]],
["Clinical features",["Fatigue, pallor, breathlessness, palpitations","Koilonychia, angular cheilitis, glossitis, pica","Plummer-Vinson syndrome: dysphagia with oesophageal webs"]],
["Lab diagnosis",["Hb ↓, MCV < 80 fL, MCH ↓, MCHC ↓, RDW ↑","Smear: microcytic hypochromic RBCs, anisopoikilocytosis, pencil cells","Serum ferritin ↓ (< 15 µg/L), serum iron ↓, TIBC ↑, transferrin saturation ↓","Bone marrow: absent stainable iron (Perls stain)","Find the cause: stool for occult blood and ova"]]],
li:"Iron deficiency is the commonest cause of anaemia worldwide and in India, particularly in women and children.",
lc:"Iron deficiency anaemia develops in predictable stages; serum ferritin identifies it early and the underlying cause must always be sought.",r:R_PATH+" — Anaemias",
rq:[["D","Iron deficiency anaemia vs β-thalassaemia trait.","IDA: ferritin ↓, TIBC ↑, RDW ↑, Mentzer index > 13, HbA2 normal/low. Thal trait: ferritin normal, RBC count high, RDW normal, Mentzer < 13, HbA2 > 3.5%."],
["V","Best single test for iron deficiency?","Serum ferritin."],
["S","Plummer-Vinson syndrome.","Triad of iron deficiency anaemia, dysphagia due to oesophageal webs and glossitis; premalignant for post-cricoid carcinoma; mostly middle-aged women."],
["S","Response to oral iron therapy.","Reticulocytosis in 5–10 days, Hb rises ~1 g/dL per week; continue 3–6 months after Hb normalises to refill stores."]]};
FA["p-b12"]={sh:"Megaloblastic anaemia results from impaired DNA synthesis due to vitamin B12 or folate deficiency, causing nuclear–cytoplasmic asynchrony. B12 needs intrinsic factor and the terminal ileum for absorption; causes include pernicious anaemia, gastrectomy, ileal disease, fish tapeworm and vegan diet. Blood shows macro-ovalocytes, hypersegmented neutrophils and pancytopenia; marrow shows megaloblasts. B12 (not folate) deficiency causes subacute combined degeneration of the cord.",
m:[["Pathogenesis",["B12 is a cofactor converting methyl-THF to THF (methionine synthase) and methylmalonyl-CoA to succinyl-CoA","Without it, folate is trapped → ↓ thymidine → impaired DNA synthesis","Nuclear maturation lags behind cytoplasm → large cells (megaloblasts)","Ineffective erythropoiesis → intramedullary haemolysis (↑ LDH, ↑ indirect bilirubin)","↑ Methylmalonic acid → myelin damage (B12 only)"]],
["Blood & marrow",["MCV > 100 fL, macro-ovalocytes, anisopoikilocytosis","Hypersegmented neutrophils (earliest sign)","Pancytopenia","Marrow: hypercellular, megaloblasts, giant metamyelocytes"]],
["Diagnosis",["Serum B12 and red-cell folate","Raised homocysteine (both) and methylmalonic acid (B12)","Anti-intrinsic factor and anti-parietal cell antibodies (pernicious anaemia)"]]],
li:"Megaloblastic anaemias are macrocytic anaemias caused by defective DNA synthesis, most often due to deficiency of vitamin B12 or folic acid.",
lc:"Recognising B12 deficiency is important because its neurological damage may become permanent and giving folate alone can worsen it.",r:R_PATH+" — Megaloblastic anaemias",
rq:[["D","B12 vs folate deficiency.","Both: megaloblastic anaemia, ↑ homocysteine. B12 only: neurological signs (SACD), ↑ methylmalonic acid, stores last years. Folate: no neuro signs, stores last months, common in pregnancy, alcohol."],
["V","Earliest peripheral smear sign of megaloblastic anaemia?","Hypersegmented neutrophils (≥ 5% with 5 lobes or any with 6)."],
["S","Pernicious anaemia.","Autoimmune atrophic gastritis of body/fundus with loss of parietal cells and intrinsic factor; anti-IF and anti-parietal antibodies; B12 deficiency; risk of gastric carcinoma."],
["S","Why should folate not be given alone in B12 deficiency?","It may correct the anaemia but allow neurological damage (SACD) to progress."]]};
FA["p-dic"]={sh:"Disseminated intravascular coagulation is an acquired thrombohaemorrhagic disorder in which widespread activation of coagulation forms microthrombi and consumes platelets and clotting factors, with secondary fibrinolysis causing bleeding. Triggers: obstetric complications, sepsis, APL, trauma, burns, snake bite, malignancy. Labs: ↓ platelets, ↑ PT, ↑ aPTT, ↓ fibrinogen, ↑ D-dimer, schistocytes.",
m:[["Causes",["Release of tissue factor: abruptio placentae, retained dead fetus, amniotic fluid embolism, APL, mucin-secreting adenocarcinoma, trauma, burns","Endothelial injury: Gram-negative sepsis, meningococcaemia, heat stroke, snake bite, immune complexes"]],
["Pathogenesis",["Excess thrombin → microthrombi → ischaemic organ damage","Consumption of platelets, fibrinogen, factors V, VIII → bleeding","Plasmin activation → FDPs/D-dimer with anticoagulant action","RBCs sheared → microangiopathic haemolytic anaemia"]],
["Lab findings",["Thrombocytopenia","Prolonged PT, aPTT, thrombin time","Low fibrinogen","Raised D-dimer and FDP","Schistocytes on smear"]]],
li:"DIC is not a disease in itself but a complication of many serious conditions.",
lc:"DIC combines thrombosis and bleeding; treatment targets the trigger plus replacement of platelets and factors.",r:R_PATH+" — Bleeding disorders",
rq:[["V","Most useful test for DIC?","D-dimer along with platelets, PT, aPTT and fibrinogen."],
["S","Causes of DIC in obstetrics.","Abruptio placentae, amniotic fluid embolism, retained dead fetus, septic abortion, eclampsia."],
["D","DIC vs TTP.","Both: thrombocytopenia, schistocytes. DIC: ↑ PT/aPTT, ↓ fibrinogen, ↑ D-dimer. TTP: normal PT/aPTT, ADAMTS13 deficiency, neurological and renal involvement."],
["S","Morphology of DIC.","Microthrombi in kidneys (cortical necrosis), brain, lungs, adrenals (Waterhouse-Friderichsen), placenta; haemorrhages in skin and serosa."]]};
FA["p-mi"]={sh:"Myocardial infarction is death of cardiac muscle from prolonged ischaemia, usually due to thrombosis on a disrupted atherosclerotic plaque. Irreversible injury begins after 20–40 minutes, starting subendocardially. Morphology evolves: coagulative necrosis (4–12 h), neutrophils (1–3 d), macrophages and softening (3–7 d), granulation tissue (1–2 wk), scar (2–8 wk). Markers: troponin I/T (most specific), CK-MB. Complications: arrhythmia, failure, rupture, aneurysm, thrombus, Dressler syndrome.",
m:[["Pathogenesis",["Atherosclerotic plaque disruption → platelet aggregation → occlusive thrombus","Ischaemia → ATP loss → contractility stops in 60 s","Irreversible damage after 20–40 min; wavefront from subendocardium outward","Reperfusion (PCI, thrombolysis) salvages myocardium but can cause reperfusion injury"]],
["Morphology by time",[["Time","Gross","Microscopy"],["0–12 h","None","Wavy fibres, early coagulative necrosis"],["12–24 h","Dark mottling","Contraction bands, early neutrophils"],["1–3 d","Mottled yellow-tan","Neutrophils, coagulative necrosis"],["3–7 d","Yellow, soft","Macrophages remove dead cells (rupture risk)"],["1–2 wk","Red-grey margins","Granulation tissue"],["2–8 wk","Grey-white scar","Collagen"]]],
["Cardiac markers",["Troponin I/T: rise 3–4 h, peak 24–48 h, stay 7–10 days (most specific)","CK-MB: rise 3–4 h, peak 24 h, normal by 48–72 h (re-infarction)","Myoglobin: earliest but non-specific"]]],
li:"Ischaemic heart disease is the leading cause of death worldwide; acute MI is its most important form.",
lc:"The timeline of morphological change explains both the diagnosis and the complications of MI.",r:R_PATH+" — Heart",
rq:[["V","Most specific marker of MI?","Cardiac troponin I/T."],
["S","Complications of MI.","Arrhythmias, LV failure, cardiogenic shock, myocardial rupture (3–7 d), papillary muscle rupture, mural thrombus and embolism, ventricular aneurysm, pericarditis, Dressler syndrome."],
["V","When is the infarct most likely to rupture?","3–7 days, when macrophages remove necrotic tissue and the wall is softest."],
["L","Define atherosclerosis; describe its etiopathogenesis and complications.","Response-to-injury hypothesis: endothelial injury, lipid accumulation and oxidation, monocyte entry, foam cells, platelets, smooth muscle proliferation; complications rupture, thrombosis, aneurysm, embolism."]]};
FA["p-rhd"]={sh:"Rheumatic fever is an acute immune-mediated multisystem disease occurring 2–3 weeks after group A streptococcal pharyngitis, due to cross-reactivity of anti-M protein antibodies and T cells with host tissues (molecular mimicry). Acute carditis shows Aschoff bodies with Anitschkow cells and verrucous vegetations; chronic RHD causes valvular fibrosis, most often mitral stenosis (fish-mouth valve). Diagnosis by Jones criteria.",
m:[["Pathogenesis",["Group A β-haemolytic streptococcal pharyngitis","Antibodies and CD4 T cells against M protein cross-react with cardiac myosin and valve glycoproteins","Genetic susceptibility","Recurrent infections → progressive valve damage"]],
["Acute rheumatic carditis (pancarditis)",["Myocardium: Aschoff bodies (fibrinoid necrosis, lymphocytes, Anitschkow caterpillar cells, Aschoff giant cells)","Endocardium: small warty vegetations along lines of closure; MacCallum plaques in left atrium","Pericardium: fibrinous 'bread-and-butter' pericarditis"]],
["Chronic RHD",["Mitral (commonest) > aortic valve","Leaflet thickening, commissural fusion, chordae shortening → fish-mouth/button-hole stenosis","Complications: AF, left atrial thrombi, embolism, CHF, infective endocarditis"]],
["Jones criteria (major)",["Carditis, migratory polyarthritis, Sydenham chorea, erythema marginatum, subcutaneous nodules (with evidence of preceding streptococcal infection)"]]],
li:"Rheumatic heart disease remains a major cause of acquired heart disease in young Indians.",
lc:"RHD is preventable: prompt treatment of strep throat and penicillin prophylaxis after an attack stop recurrences.",r:R_PATH+" — Heart",
rq:[["V","Pathognomonic lesion of rheumatic carditis?","Aschoff body."],
["S","Jones criteria.","Major: carditis, polyarthritis, chorea, erythema marginatum, subcutaneous nodules. Minor: fever, arthralgia, raised ESR/CRP, prolonged PR interval. Plus evidence of strep infection (ASO, throat culture)."],
["S","Morphology of chronic RHD of mitral valve.","Thick fibrotic leaflets, fused commissures, short thick fused chordae, calcification → fish-mouth stenosis; dilated left atrium with thrombi."],
["D","Vegetations in rheumatic fever vs infective endocarditis.","RF: small, warty, firm, along lines of closure, non-destructive. IE: large, friable, bulky, destructive, contain organisms, embolise."]]};
FA["p-cirrhosis"]={sh:"Cirrhosis is a diffuse process of hepatic fibrosis with conversion of normal architecture into structurally abnormal regenerative nodules. Causes: alcohol, chronic HBV/HCV, NAFLD, biliary disease, haemochromatosis, Wilson disease. Activated stellate cells lay down collagen. Classified as micronodular (< 3 mm) or macronodular (> 3 mm). Complications: portal hypertension (varices, ascites, splenomegaly), liver failure, hepatic encephalopathy, hepatocellular carcinoma.",
m:[["Pathogenesis",["Chronic hepatocyte injury and death","Kupffer cells and inflammatory cells release TGF-β, PDGF, TNF","Activated stellate (Ito) cells become myofibroblasts → collagen I and III in space of Disse","Capillarisation of sinusoids impairs exchange","Bridging fibrous septa + regenerative nodules; vascular shunts"]],
["Classification",["Morphological: micronodular (alcohol), macronodular (post-viral), mixed","Etiological: alcoholic, post-hepatitic, biliary, metabolic (Wilson, haemochromatosis, α1-AT), cryptogenic"]],
["Portal hypertension consequences",["Oesophageal varices (haematemesis)","Ascites","Congestive splenomegaly, hypersplenism","Caput medusae, haemorrhoids","Hepatic encephalopathy (portosystemic shunting)"]],
["Lab diagnosis",["LFT: ↓ albumin, ↑ bilirubin, ↑ PT/INR, AST/ALT variable","Thrombocytopenia","Imaging (USG, elastography), liver biopsy (gold standard)","Etiology tests: HBsAg, anti-HCV, ceruloplasmin, ferritin"]]],
li:"Cirrhosis is the end stage of many chronic liver diseases and among the top causes of death worldwide.",
lc:"Cirrhosis results from fibrosis and regeneration; its complications stem from portal hypertension and failing liver function.",r:R_PATH+" — Liver",
rq:[["V","Main cell producing collagen in cirrhosis?","Hepatic stellate (Ito) cell."],
["S","Causes of portal hypertension.","Prehepatic: portal vein thrombosis. Intrahepatic: cirrhosis (commonest), schistosomiasis, non-cirrhotic portal fibrosis. Post-hepatic: Budd-Chiari, constrictive pericarditis, right heart failure."],
["D","Micronodular vs macronodular cirrhosis.","Micro: nodules < 3 mm, uniform, alcohol, early. Macro: > 3 mm, variable, post-viral; alcoholic cirrhosis may become macronodular later."],
["S","Mallory-Denk bodies.","Eosinophilic intracytoplasmic aggregates of damaged keratin filaments in hepatocytes; alcoholic hepatitis, NASH, Wilson disease."]]};
FA["p-nephrotic"]={sh:"Nephrotic syndrome is massive proteinuria (> 3.5 g/day in adults), hypoalbuminaemia (< 3 g/dL), generalised oedema, hyperlipidaemia and lipiduria due to increased glomerular permeability. Primary causes: minimal change disease (commonest in children), membranous nephropathy, FSGS, MPGN. Secondary: diabetes, amyloidosis, SLE. Complications: infections, thrombosis (renal vein), protein malnutrition.",
m:[["Pathophysiology",["Injury to podocytes/GBM → loss of size and charge barrier → proteinuria","Hypoalbuminaemia → ↓ oncotic pressure → oedema; RAAS activation → Na⁺ retention","Hepatic lipoprotein synthesis ↑ → hyperlipidaemia; lipiduria (oval fat bodies)","Loss of antithrombin III and immunoglobulins → thrombosis, infections"]],
["Causes",[["Category","Examples"],["Children","Minimal change disease (85%)"],["Adults primary","Membranous nephropathy, FSGS, MPGN"],["Secondary","Diabetic nephropathy, amyloidosis, SLE, HBV/HCV, HIV, drugs (NSAIDs, gold)"]]],
["Minimal change disease",["Normal glomeruli on light microscopy","Effacement of podocyte foot processes on EM","Selective proteinuria; excellent steroid response"]]],
li:"Nephrotic syndrome is a clinical complex caused by glomerular diseases that increase permeability to plasma proteins.",
lc:"Nephrotic syndrome is defined by heavy proteinuria; its consequences follow from loss of albumin and other plasma proteins.",r:R_PATH+" — Kidney",
rq:[["D","Nephritic vs nephrotic syndrome.","Nephritic: haematuria with RBC casts, hypertension, oliguria, mild proteinuria (< 3.5 g), azotaemia. Nephrotic: proteinuria > 3.5 g, hypoalbuminaemia, oedema, hyperlipidaemia, lipiduria."],
["V","Commonest cause of nephrotic syndrome in children?","Minimal change disease."],
["S","Membranous nephropathy.","Commonest primary cause in adults; anti-PLA2R antibodies; subepithelial deposits with 'spikes' on silver stain; granular IgG and C3; may be secondary to SLE, HBV, drugs, tumours."],
["V","Why does thrombosis occur in nephrotic syndrome?","Urinary loss of antithrombin III, increased fibrinogen and haemoconcentration."]]};
FA["p-dm"]={ans:"path16:4",rq:[
["S","Pathogenesis of type 2 diabetes.","Insulin resistance (obesity, visceral fat, FFAs, adipokines, inflammation) plus β-cell dysfunction (glucotoxicity, lipotoxicity, amyloid); genetic predisposition."],
["S","Morphology of diabetic nephropathy.","GBM thickening, diffuse mesangial sclerosis, nodular glomerulosclerosis (Kimmelstiel-Wilson), hyaline arteriolosclerosis of afferent and efferent arterioles, pyelonephritis, papillary necrosis."],
["V","Diagnostic criteria of diabetes?","FPG ≥ 126 mg/dL, 2-h OGTT ≥ 200 mg/dL, HbA1c ≥ 6.5%, or random ≥ 200 mg/dL with symptoms."],
["D","Type 1 vs type 2 diabetes.","T1: autoimmune β-cell destruction, young, lean, absolute insulin deficiency, ketosis-prone, HLA-DR3/DR4. T2: insulin resistance + β-cell dysfunction, older, obese, relative deficiency, strong genetic link, HHS."]]};
