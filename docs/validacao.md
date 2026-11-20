# Validação para publicação estática

Testes executados em **20/11/2026**, após a remoção dos controles de plataforma, entrada e criação de conta, mantendo a preparação para GitHub e Cloudflare Pages. A aplicação foi servida diretamente da pasta gerada `dist/`, com servidores HTTP estáticos locais. Os testes não executaram backend, API ou banco de dados. A publicação no Cloudflare Pages não foi executada.

## Resultados

| Verificação | Resultado |
| --- | --- |
| Entrada raiz | `/` retorna os mesmos bytes de `index.html` |
| Endereço anterior | `landing.html` permanece idêntico a `index.html` |
| Preparação da publicação | 33 arquivos públicos; sem documentação, testes, metadados Git ou README dos ativos em `dist/` |
| Arquivos preservados nesta preparação | 18 arquivos em assets, três CSS, três JS e favicon byte a byte inalterados |
| Revisão dos HTMLs | Acessos à plataforma removidos; blocos vazios retirados; convites sem destino ajustados; demais links e recursos relativos preservados |
| Caminhos e âncoras | 31 referências locais únicas resolvidas; nenhum caminho local a partir da raiz |
| HTTP estático | Nove HTMLs, recursos referenciados e favicon com HTTP 200 e bytes corretos; MIME de CSS e JS válido |
| Rotas ausentes | Login, cadastro e endereço inexistente retornam HTTP 404 no servidor local |
| Matriz de navegador | Oito endereços × dois tamanhos × dois temas × duas bases = **64 casos aprovados** |
| Capturas e layout | Quatro capturas da inicial atualizadas; layout conferido em desktop e celular. A comparação byte a byte com a versão anterior não se aplica à remoção solicitada |
| Tamanhos e temas | 1440 e 390 px, altura 900 px, temas claro e escuro |
| Menu móvel | Abre e fecha com Escape; aria-expanded correto em todas as páginas |
| Tema | Alternância pelo controle e persistência após recarregar |
| Navegação real | Inicial → Sobre → inicial pelo logo, em desktop e celular, na raiz e no subdiretório |
| Layout e imagens | Nenhum overflow horizontal; todas as imagens carregadas |
| Perguntas frequentes | Nove perguntas abertas e fechadas por clique, nos dois tamanhos |
| Materiais | Cinco downloads com bytes conferidos e cinco ampliações em novas abas, nas duas bases |
| Animação da árvore | Geometria SVG gerada e revelação respondendo à rolagem com movimento normal |
| Plataforma indisponível | 30 controles removidos (20 nas páginas originais e dez na cópia index); nenhum controle suspenso ou link de login/cadastro restante |
| Recursos externos bloqueados | Oito endereços carregam conteúdo e imagens locais nas duas bases |
| Erros | Nenhum erro JavaScript monitorado, HTTP local ou requisição à API; nenhuma falha externa no teste conectado |
| Git | Branch main; destino plagioutfpr-project/webPage; dist e arquivos locais ignorados |

As capturas atuais usam movimento reduzido para eliminar estados transitórios; a animação com movimento normal foi testada separadamente. O teste de igualdade visual com a versão anterior foi dispensado nesta revisão porque a remoção dos controles altera intencionalmente a composição. Os projetos externos de origem não foram modificados.

## Bases e relatórios

- Raiz: `http://127.0.0.1:8765/`, servindo exclusivamente `dist/`; [testes-navegador.json](testes-navegador.json) registra os 32 casos.
- Subdiretório: `http://127.0.0.1:8767/paginaWEB/dist/`; [testes-navegador-subdiretorio.json](testes-navegador-subdiretorio.json) registra outros 32 casos. O teste também detecta pedidos que escapem do caminho-base.
- Capturas da inicial: quatro arquivos `landing-{1440,390}-{light,dark}.png`, atualizados após a retirada dos controles.

Navegador utilizado: **Chromium 153.0.8010.12**, via Playwright externo ao projeto. A sintaxe dos três JavaScript do site e do script de navegador foi validada com `node --check`.

## Repetir

Siga o [README](../README.md) para gerar `dist/`, iniciar o servidor e executar os validadores. O teste de navegador aceita qualquer base em `SITE_URL`, incluindo subdiretórios. Para comparar capturas automaticamente, informe em `SOURCE_URL` uma referência que já contenha a remoção solicitada. A versão anterior à remoção terá diferenças visuais esperadas.

Parâmetros de ferramentas utilizados neste ambiente:

```bash
SITE_URL=http://127.0.0.1:8765 \
PLAYWRIGHT_MODULE=/home/dakells/.npm/_npx/e41f203b7505f1fb/node_modules/playwright \
CHROMIUM_PATH=/home/dakells/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
node scripts/validar-navegador.cjs
```

Para o segundo cenário, foram usados `SITE_URL=http://127.0.0.1:8767/paginaWEB/dist` e `REPORT_FILE=docs/testes-navegador-subdiretorio.json`.

## Limites da verificação

A publicação no Cloudflare Pages não foi executada. Seus redirecionamentos automáticos de `.html` para URLs sem extensão e a escolha de `404.html` pelo serviço seguem a configuração documentada e precisam de conferência após a publicação. Os testes locais verificam arquivos estáticos, não simulam a infraestrutura da Cloudflare. O arquivo 404 não carrega recursos nem links relativos, para funcionar também em rotas ausentes aninhadas.

Google Fonts continua externo, conforme a versão anterior; sem internet, as fontes alternativas podem mudar a tipografia. Os destinos de Instagram, YouTube e publicações externas não foram abertos. A verificação foi feita em Chromium nos tamanhos descritos, sem alegação de cobertura de todos os navegadores.

Nenhuma regressão foi detectada nos cenários executados. As instruções objetivas para a publicação futura estão em [publicacao-cloudflare-pages.md](publicacao-cloudflare-pages.md).
