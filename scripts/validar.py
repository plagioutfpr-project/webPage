#!/usr/bin/env python3
"""Valida arquivos, caminhos relativos, ausência dos acessos à plataforma e HTTP estático."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen
from urllib.error import HTTPError
import sys

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'docs/inventario.json').read_text())
errors, references = [], set()
pages = sorted(root.glob('*.html'))
counts = {}


def inspect_ref(value, current):
    u = urlsplit(value)
    if u.scheme or u.netloc:
        return
    if u.path.startswith('/'):
        errors.append(f'{current.name}: caminho deve ser relativo: {value}')
    target = (current.parent / unquote(u.path)).resolve() if u.path else current
    if not target.is_relative_to(root) or not target.is_file():
        errors.append(f'{current.name}: recurso ausente ou fora do projeto: {value}')
        return
    if u.path:
        references.add(target.relative_to(root).as_posix())
    if u.fragment and target.suffix == '.html':
        ids = set(re.findall(r'\bid=[\"\x27]([^\"\x27]+)', target.read_text()))
        if u.fragment not in ids:
            errors.append(f'{current.name}: âncora ausente: {value}')


class Refs(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'base':
            errors.append(f'{current.name}: base altera resolução dos caminhos relativos')
        if tag == 'a':
            if attrs.get('aria-disabled') == 'true':
                counts[current.name] += 1
                if ('href' in attrs or attrs.get('tabindex') != '-1'
                        or attrs.get('role') != 'link'):
                    errors.append(f'{current.name}: acesso da plataforma ainda presente')
            elif re.search(r'(?:^|/)(?:login|cadastro)(?:\.html)?/?$',
                           urlsplit(attrs.get('href') or '').path):
                errors.append(f'{current.name}: link de login/cadastro ativo')
        for attr in ('href', 'src', 'poster', 'data'):
            if attrs.get(attr):
                inspect_ref(attrs[attr], current)


for current in pages:
    counts[current.name] = 0
    Refs().feed(current.read_text())
for name, expected in manifest['suspensao_links_por_pagina'].items():
    if counts.get(name) != expected:
        errors.append(f'{name}: controle da plataforma deveria ter sido removido')
if (root/'index.html').read_bytes() != (root/'landing.html').read_bytes():
    errors.append('index.html deve preservar integralmente landing.html')
for item in manifest['arquivos_copiados']:
    p = root / item['destino']
    if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != item['sha256_destino']:
        errors.append('Arquivo divergente do inventário: ' + item['destino'])
for p in root.rglob('*'):
    rel = p.relative_to(root)
    if '.git' in rel.parts:
        continue
    if p.is_symlink():
        errors.append('Link simbólico: ' + str(rel))
    if p.is_file() and (p.name.startswith('.env') or p.suffix in ('.log', '.sql', '.sqlite', '.db') or 'node_modules' in rel.parts):
        errors.append('Arquivo indevido na entrega: ' + str(rel))
for p in list((root/'css').rglob('*.css')) + list((root/'js').rglob('*.js')):
    code = p.read_text()
    for value in re.findall(r'url\(\s*[\"\x27]?([^\s\)\"\x27]+)', code):
        inspect_ref(value, p)
    if re.search(r'@import\b|\bfetch\s*\(|\bimport\s+(?:[\"\x27]|.*?\bfrom\s)', code):
        errors.append('Dependência adicional requer inspeção: ' + str(p))

if len(sys.argv) > 1:
    base = sys.argv[1].rstrip('/')
    for rel in sorted(references | {p.name for p in pages} | {'favicon.ico', ''}):
        try:
            with urlopen(base + '/' + rel, timeout=10) as response:
                if response.status != 200:
                    errors.append(f'HTTP {response.status}: {rel}')
                if response.read() != (root/(rel or 'index.html')).read_bytes():
                    errors.append('Resposta HTTP divergente: ' + rel)
                mime = response.headers.get_content_type()
                if rel.endswith('.js') and mime not in ('text/javascript', 'application/javascript'):
                    errors.append('MIME JavaScript inválido: ' + rel)
                if rel.endswith('.css') and mime != 'text/css':
                    errors.append('MIME CSS inválido: ' + rel)
        except Exception as exc:
            errors.append(f'HTTP {rel}: {exc}')
    for rel in ('login.html', 'cadastro.html', 'rota-inexistente'):
        try:
            with urlopen(base + '/' + rel, timeout=10):
                errors.append('Rota indisponível retornou sucesso: ' + rel)
        except HTTPError as exc:
            if exc.code != 404:
                errors.append(f'HTTP {exc.code} em rota indisponível: {rel}')
        except Exception as exc:
            errors.append(f'HTTP {rel}: {exc}')

if (root/'dist').exists():
    expected = ({p.name for p in pages} | {'favicon.ico'} |
                {p.relative_to(root).as_posix() for folder, ext in
                 [('assets', '*.webp'), ('css', '*.css'), ('js', '*.js')]
                 for p in (root/folder).rglob(ext)})
    actual = {p.relative_to(root/'dist').as_posix() for p in (root/'dist').rglob('*') if p.is_file()}
    if expected != actual:
        errors.append('dist/ contém arquivos ausentes ou indevidos')
    for rel in expected & actual:
        if (root/rel).read_bytes() != (root/'dist'/rel).read_bytes():
            errors.append('dist/ desatualizado: ' + rel)

report = {'paginas_html':len(pages), 'arquivos_inventariados':len(manifest['arquivos_copiados']),
          'referencias_locais_unicas':len(references), 'http_testado':len(sys.argv)>1,
          'entrada':'index.html', 'controles_suspensos':counts,
          'dist_verificado':(root/'dist').exists(), 'erros':errors}
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
