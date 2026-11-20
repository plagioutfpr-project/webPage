# Inventário e proveniência

Origem comum: `/mnt/disco/projetoSite/plataforma_cursos/src/public/`. Foram extraídos 32 arquivos; 24 permanecem idênticos à origem. Os sete HTMLs foram adaptados para caminhos relativos e entrada `index.html`. Posteriormente, por solicitação do usuário, os controles de acesso à plataforma, login e cadastro foram removidos integralmente, junto com blocos vazios e convites de acesso sem destino. CSS, JavaScript, imagens e favicon foram preservados nesta revisão. A tabela abaixo registra os tamanhos históricos na origem; o JSON mantém hashes de origem, hashes de destino atualizados e `bytes_destino`.

| Destino relativo | Origem relativa à raiz acima | Bytes |
| --- | --- | ---: |
| `assets/institucional/README.md` | `assets/institucional/README.md` | 872 |
| `assets/institucional/alexandre-costa.webp` | `assets/institucional/alexandre-costa.webp` | 72990 |
| `assets/institucional/daniel-passos.webp` | `assets/institucional/daniel-passos.webp` | 15718 |
| `assets/institucional/edna-ferreira-silva.webp` | `assets/institucional/edna-ferreira-silva.webp` | 21110 |
| `assets/institucional/fabiana-pinheiro.webp` | `assets/institucional/fabiana-pinheiro.webp` | 17792 |
| `assets/institucional/faculdade-guarapuava.webp` | `assets/institucional/faculdade-guarapuava.webp` | 9834 |
| `assets/institucional/fundacao-araucaria.webp` | `assets/institucional/fundacao-araucaria.webp` | 22018 |
| `assets/institucional/joao-paulo-aires.webp` | `assets/institucional/joao-paulo-aires.webp` | 32038 |
| `assets/institucional/maria-eduarda-macedo.webp` | `assets/institucional/maria-eduarda-macedo.webp` | 40124 |
| `assets/institucional/material-identifica.webp` | `assets/institucional/material-identifica.webp` | 78590 |
| `assets/institucional/material-marionete.webp` | `assets/institucional/material-marionete.webp` | 96890 |
| `assets/institucional/material-mascara.webp` | `assets/institucional/material-mascara.webp` | 71950 |
| `assets/institucional/material-originalidade.webp` | `assets/institucional/material-originalidade.webp` | 92634 |
| `assets/institucional/material-xadrez.webp` | `assets/institucional/material-xadrez.webp` | 89734 |
| `assets/institucional/ppgect.webp` | `assets/institucional/ppgect.webp` | 31528 |
| `assets/institucional/uniguairaca.webp` | `assets/institucional/uniguairaca.webp` | 11450 |
| `assets/institucional/utfpr.webp` | `assets/institucional/utfpr.webp` | 22630 |
| `assets/landing/logo-plagio.webp` | `assets/landing/logo-plagio.webp` | 10764 |
| `cartilha.html` | `cartilha.html` | 7581 |
| `css/institucional.css` | `css/institucional.css` | 15082 |
| `css/landing/landing-responsive.css` | `css/landing/landing-responsive.css` | 5719 |
| `css/landing/landing.css` | `css/landing/landing.css` | 20124 |
| `equipe.html` | `equipe.html` | 10235 |
| `favicon.ico` | `favicon.ico` | 32038 |
| `js/institucional.js` | `js/institucional.js` | 2162 |
| `js/landing.js` | `js/landing.js` | 15485 |
| `js/theme.js` | `js/theme.js` | 3181 |
| `landing.html` | `landing.html` | 16443 |
| `materiais.html` | `materiais.html` | 8170 |
| `parceiros.html` | `parceiros.html` | 7820 |
| `perguntas-frequentes.html` | `perguntas-frequentes.html` | 7594 |
| `sobre.html` | `sobre.html` | 8164 |

Tamanho total dos arquivos na origem: **898,464 bytes**.

## Preparação para Cloudflare Pages

A entrada atual é `index.html`, cópia byte a byte de `landing.html`, que continua disponível como endereço anterior. O arquivo não tem relação com o catálogo `index.html` excluído na extração. Os 20 controles de acesso à plataforma das sete páginas originais e os dez da cópia `index.html` foram removidos da interface. Não restam controles suspensos visíveis. As estruturas flex existentes reposicionam o menu, o botão principal restante e os links do rodapé sem espaços reservados para os itens retirados.

Foram acrescentados `.gitignore`, `404.html`, `scripts/preparar-publicacao.py` e `docs/publicacao-cloudflare-pages.md`. A página 404 é somente uma resposta estática para rotas ausentes e impede o fallback SPA do Pages. `dist/` contém 33 arquivos públicos e é ignorada pelo Git. O README de proveniência dos ativos fica no repositório, fora da publicação. O Git local utiliza `main`, com `origin` apontando para `https://github.com/plagioutfpr-project/webPage.git`. A publicação no Cloudflare Pages permanece pendente.

## Arquivos de entrega gerados

`README.md`, `docs/inventario.md`, `docs/inventario.json`, `docs/validacao.md`, `docs/testes-navegador.json`, quatro capturas `docs/landing-*.png` e os scripts `scripts/validar.py` e `scripts/validar-navegador.cjs` documentam e validam a extração. Não integram o código da página original.

## Recursos e destinos externos

- http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4738929D1 — equipe.html
- https://1drv.ms/b/s!AqqpbKeTHqetnotjCkC18kt1Yqs7Fg?e=mgDEKC — equipe.html
- https://fonts.googleapis.com — cartilha.html, equipe.html, landing.html, materiais.html, parceiros.html, perguntas-frequentes.html, sobre.html
- https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Work+Sans:wght@300;400;500;600;700&display=swap — cartilha.html, equipe.html, landing.html, materiais.html, parceiros.html, perguntas-frequentes.html, sobre.html
- https://fonts.gstatic.com — cartilha.html, equipe.html, landing.html, materiais.html, parceiros.html, perguntas-frequentes.html, sobre.html
- https://repositorio.utfpr.edu.br/jspui/handle/1/2902 — cartilha.html, equipe.html
- https://seisicite.com.br/storage/seisicite-trabalhos-finais/470-b71c56b9c21dc17eab586af0ffef8c95d41d89678cee35936d2eebe26ed7a646.pdf — equipe.html
- https://www.instagram.com/plagio.utfpr/ — cartilha.html, equipe.html, landing.html, materiais.html, parceiros.html, perguntas-frequentes.html, sobre.html
- https://www.youtube.com/@plagioutfpr — cartilha.html, equipe.html, landing.html, materiais.html, parceiros.html, perguntas-frequentes.html, sobre.html

Google Fonts é a única dependência externa de renderização: Fraunces e Work Sans, com arquivos servidos por fonts.gstatic.com. Os demais endereços são links de navegação, não arquivos necessários ao carregamento. A árvore e suas animações são geradas pelo JavaScript local; não há biblioteca gráfica externa.

## Plataforma separada — controles removidos

Os links de catálogo, plataforma, login e cadastro foram inicialmente suspensos e, na revisão solicitada pelo usuário, removidos do HTML. Também foram retirados o bloco “Já participa?”, seus separadores, a área vazia de ações no encerramento da inicial e o convite final ao catálogo nas perguntas frequentes. Os textos que convidavam diretamente a entrar ou criar conta foram ajustados ao conteúdo institucional disponível.

Foram removidos 20 controles nas páginas originais (landing 10, sobre 3, equipe 1, cartilha 2, parceiros 1, materiais 1 e perguntas frequentes 2), além de dez na cópia `index.html`. O inventário JSON registra essa distribuição em `controles_plataforma_removidos_por_pagina`; a contagem atual de controles suspensos é zero em todas as páginas. As rotas da plataforma no JSON são referências históricas da origem: o novo `index.html` contém apenas a página institucional. Login, cadastro, catálogo e backend continuam excluídos.

## Exclusões justificadas

- `src/public/index.html`, páginas acadêmicas, login/cadastro, API, configuração Node/Express, bancos e motor de IA: pertencem à plataforma.
- CSS/tokens/scripts compartilhados da plataforma: não importados pelas páginas extraídas.
- `papagaio-detalhado.webp`, `equipe-registro-*.webp` e PDFs de `assets/materiais`: não referenciados por este conjunto. A página de materiais utiliza cinco cartazes WebP.
- `.stitch/landing*.html`: capturas estáticas para design, com CSS incorporado, não fontes de execução da página.
- Worktrees e cópias de auditoria: duplicatas; o SHA-256 de `landing.html` coincide em todos os 13 worktrees examinados.
- Antigo Wix: não é a entrada do novo site nem dependência de execução. O registro de proveniência de alguns ativos foi preservado.
- `.git`, `node_modules`, `.env`, credenciais, logs, caches, builds e conteúdos privados não foram copiados.
