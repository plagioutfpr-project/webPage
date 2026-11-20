# Plágio: Não Copie Essa Ideia — site institucional

Projeto estático pronto para versionamento no GitHub e publicação no plano gratuito do **Cloudflare Pages**. A página inicial é **`index.html`**, servida em `/`; `landing.html` permanece como endereço compatível com a versão anterior. Ambos contêm a mesma página, com a identidade visual, as animações e as funcionalidades institucionais existentes.

Os acessos à **Plataforma de Cursos continuam indisponíveis**. A pedido do usuário, os botões e links de plataforma, catálogo, login, entrada e criação de conta foram removidos de todas as páginas. Os blocos vazios foram retirados e os convites de acesso foram ajustados; o botão “Conhecer o projeto” permanece centralizado. O novo `index.html` contém apenas a página institucional. Não há autenticação, backend, banco de dados, API ou funcionalidades novas.

## Estrutura

```text
paginaWEB/
├── index.html                  # página inicial em /
├── landing.html                # cópia compatível da inicial
├── sobre.html
├── equipe.html
├── cartilha.html
├── parceiros.html
├── materiais.html
├── perguntas-frequentes.html
├── 404.html                    # impede fallback SPA no Cloudflare Pages
├── favicon.ico
├── assets/                     # logo e imagens WebP locais
├── css/                        # estilos originais preservados
├── js/                         # animação, menu e tema originais preservados
├── scripts/
│   ├── preparar-publicacao.py   # monta somente arquivos públicos em dist/
│   ├── validar.py
│   └── validar-navegador.cjs
├── docs/                       # instruções, inventário e resultados dos testes
├── .gitignore
└── README.md
```

`dist/` é gerada e ignorada pelo Git. Apenas seu conteúdo será publicado: nove HTMLs (incluindo a inicial, o endereço antigo e a página 404), favicon, 17 imagens, três CSS e três JavaScript. README, documentação, scripts de teste e metadados Git ficam fora da publicação.

## Executar e validar localmente

Requisito de preparação: **Python 3.9 ou superior**, sem pacotes adicionais. O site no navegador não depende de Python, Node.js ou instalação npm.

```bash
cd /mnt/disco/paginaWEB
python3 scripts/preparar-publicacao.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Abra **http://127.0.0.1:8000/**. Encerre o servidor com Ctrl+C. Também é possível servir a pasta do projeto diretamente para editar os arquivos. Evite `file://`, pois o tema usa módulo JavaScript.

Em outro terminal, com o servidor ativo:

```bash
python3 scripts/validar.py http://127.0.0.1:8000
```

O validador verifica entrada raiz, arquivos e hashes, recursos e âncoras, caminhos relativos, MIME de CSS/JavaScript, ausência dos controles de acesso à plataforma, rotas indisponíveis e correspondência entre a fonte e `dist/`. Sempre gere `dist/` novamente após editar arquivos públicos. O inventário registra hashes da versão entregue; ao alterar intencionalmente arquivos inventariados, revise também seus hashes em `docs/inventario.json`.

Para testes funcionais em navegador, use Playwright com Chromium em um ambiente de testes **fora desta pasta**:

```bash
SITE_URL=http://127.0.0.1:8000 \
PLAYWRIGHT_MODULE=/caminho/externo/node_modules/playwright \
CHROMIUM_PATH=/caminho/externo/chromium \
node scripts/validar-navegador.cjs
```

`PLAYWRIGHT_MODULE` e `CHROMIUM_PATH` são dispensáveis se a ferramenta e o navegador já forem encontrados por padrão. `SOURCE_URL` permite comparar com uma cópia anterior servida por HTTP; `REPORT_FILE` permite escolher o relatório. São parâmetros dos testes, não variáveis do site. Veja os resultados em [docs/validacao.md](docs/validacao.md).

## GitHub e Cloudflare Pages

O repositório de destino é **[plagioutfpr-project/webPage](https://github.com/plagioutfpr-project/webPage)**, na branch `main`. O remote `origin` usa `https://github.com/plagioutfpr-project/webPage.git`. As instruções para enviar atualizações e conectar o repositório ao Pages estão em **[docs/publicacao-cloudflare-pages.md](docs/publicacao-cloudflare-pages.md)**.

Configuração da publicação:

| Campo do Cloudflare Pages | Valor |
| --- | --- |
| Integração | GitHub |
| Branch de produção | `main` |
| Framework preset | `None` |
| Root directory | raiz do repositório (deixar vazio) |
| Build command | `python3 scripts/preparar-publicacao.py` |
| Build output directory | `dist` |
| Variáveis de ambiente / secrets | nenhuma |

O comando apenas copia arquivos estáticos para publicação; não compila a aplicação nem executa serviços. Não é necessário configurar Workers, Pages Functions, Wrangler ou GitHub Actions.

## Compatibilidade e dependências externas

Todos os recursos e links internos usam **caminhos relativos**. O projeto funciona tanto na raiz quanto em um subdiretório servido por HTTP com barra final (`/subdiretorio/`). CSS, JavaScript, imagens, cartazes para download e âncoras estão locais. Navegação, menu móvel, perguntas expansíveis, tema com persistência e árvore SVG funcionam no navegador.

O Cloudflare Pages pode redirecionar URLs terminadas em `.html` para a versão sem extensão. Isso é compatível com os caminhos relativos destas páginas, todas no mesmo nível. `404.html` desativa o fallback SPA automático: endereços ausentes, como login e cadastro, devem responder 404, em vez de exibir a inicial. Não existe redirecionamento ou reativação da plataforma.

As fontes **Fraunces** e **Work Sans** permanecem no Google Fonts (`fonts.googleapis.com` e `fonts.gstatic.com`), como na versão anterior. Sem acesso a esses serviços, o conteúdo local funciona com fontes alternativas e a tipografia pode variar. Instagram, YouTube, Lattes/CNPq, Repositório UTFPR, SEI-SICITE e OneDrive permanecem links externos; sua disponibilidade não é garantida pelos testes locais.

O navegador deve suportar módulos JavaScript, SVG, IntersectionObserver e CSS color-mix. A persistência do tema utiliza localStorage. A origem histórica da cópia e dos ativos está em [docs/inventario.md](docs/inventario.md).

**A publicação no Cloudflare Pages ainda não foi executada.**
