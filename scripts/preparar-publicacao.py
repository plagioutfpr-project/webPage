#!/usr/bin/env python3
"""Monta dist/ com arquivos estáticos; não publica nem acessa serviços externos."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
output = root / 'dist'
pages = ['index', 'landing', 'sobre', 'equipe', 'cartilha', 'parceiros',
         'materiais', 'perguntas-frequentes', '404']
files = [root / f'{name}.html' for name in pages] + [root / 'favicon.ico']
for folder, suffix in [('assets', '.webp'), ('css', '.css'), ('js', '.js')]:
    files.extend(sorted((root / folder).rglob(f'*{suffix}')))

for source in files:
    if not source.is_file() or source.is_symlink():
        raise SystemExit(f'Arquivo público ausente ou inválido: {source}')
if output.is_symlink():
    raise SystemExit('dist/ não pode ser um link simbólico.')
if output.exists():
    shutil.rmtree(output)
output.mkdir()
for source in files:
    target = output / source.relative_to(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
print(f'{len(files)} arquivos públicos preparados em {output}')
