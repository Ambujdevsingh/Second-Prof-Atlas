import pathlib, glob
root = pathlib.Path(__file__).parent
src = root / "src"
css = (src / "style.css").read_text()
js = "const SUBJECTS=[];\n" + "\n".join((src / f).read_text() for f in ["c_path.js", "c_micro.js", "c_pharm.js", "c_cm.js", "c_fmt.js", "c_add.js", "c_flows1.js", "c_flows2.js", "c_flows3.js", "ans_path_a.js", "ans_path_b.js", "ans_path_ext.js"] + sorted(pathlib.Path(f).name for f in glob.glob(str(src / "ans2_*.js"))) + ["glossary.js", "qb_path1_cards.js", "qb_path2.js", "flowans1.js", "flowans2.js", "flowans3.js", "chsum.js", "app.js", "flows_ui.js", "notes_ui.js", "answers_ui.js", "practice_ui.js", "flowexam_ui.js", "summary_ui.js", "home_ui.js", "quotes.js", "games_data.js", "games.js", "init.js"])
fonts = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@500;700&display=swap">'''
body = f'''<style>
{css}
</style>
<div class="app"><aside class="side" id="side" aria-label="Sidebar"></aside><main class="main" id="main"></main></div>
<nav class="tabbar" id="tabbar" aria-label="Main"></nav>
<script>
{js}
</script>
'''
artifact = f'<title>Second Prof Atlas</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{fonts}\n{body}'
pass
site = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Second Prof Atlas · MBBS Phase II</title>
<meta name="description" content="Free MBBS 2nd-year learning platform: Pathology, Microbiology, Pharmacology, Community Medicine and FMT with flowcharts, exam radar, quizzes, planner and AI tutor.">
<meta name="theme-color" content="#C2255C">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231F4FD1'/%3E%3Ctext x='16' y='22' font-size='16' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold'%3EII%3C/text%3E%3C/svg%3E">
{fonts}
<style>html{{-webkit-text-size-adjust:100%}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}:root{{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}}</style>
</head><body>
{body}</body></html>
'''
(root / "index.html").write_text(site)
pass
print(len(artifact), len(site))
