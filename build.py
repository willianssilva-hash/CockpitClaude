"""Gera index.html (painel publicado) a partir de painel.html, runtime.js e dos CSVs em data/."""
from pathlib import Path
R = Path(__file__).parent
painel = (R / 'painel.html').read_text(encoding='utf8')
d3 = (R / 'd3.min.js').read_text(encoding='utf8')
runtime = (R / 'runtime.js').read_text(encoding='utf8')
csvs = ''.join(
    f'<script type="text/csv" data-id="{n}">\n{(R/(n+".csv")).read_text(encoding="utf8").strip()}\n</script>\n'
    for n in ['veiculos', 'motoristas', 'historico', 'manutencoes'])
html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>COCKPIT DIÁRIO TRANSPORTE</title>
<meta name="description" content="Painel diário de frota e motoristas da Colormaq — Filial BA e Matriz SP.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230B2E59'/%3E%3Cpath d='M6 20h14v-8h4l3 4v4h-2' stroke='%23fff' stroke-width='2.4' fill='none' stroke-linejoin='round'/%3E%3Ccircle cx='11' cy='22' r='2.4' fill='%23fff'/%3E%3Ccircle cx='23' cy='22' r='2.4' fill='%23fff'/%3E%3C/svg%3E">
<script>\n{d3}\n</script>
<style>
html, body {{ margin: 0; min-height: 100%; background: #EEF2F7; }}
@media (prefers-color-scheme: dark) {{ html, body {{ background: #0A1120; }} }}
#dash-root {{ --font-anthropic-sans: "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif; --font-anthropic-serif: Georgia, "Times New Roman", serif; min-height: 100vh; }}
#dash-root .cdt {{ min-height: 100vh; }}
</style>
</head>
<body>
{csvs}<script>
{runtime}
</script>
<div id="dash-root">
{painel}
</div>
<script>window.__cdtIniciar();</script>
</body>
</html>
'''
(R / 'index.html').write_text(html, encoding='utf8')
print('index.html gerado:', len(html), 'bytes')
