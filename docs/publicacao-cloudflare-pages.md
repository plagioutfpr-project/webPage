# Publicar no Cloudflare Pages com GitHub

Preparação realizada em 20/11/2026. Repositório de destino: **[plagioutfpr-project/webPage](https://github.com/plagioutfpr-project/webPage)**, branch `main`. A publicação no Cloudflare Pages será feita posteriormente pelo responsável.

## 1. Revisar e versionar atualizações

O Git local utiliza `main`, com remote `origin` apontando para `https://github.com/plagioutfpr-project/webPage.git`. Para futuras alterações:

```bash
cd /mnt/disco/paginaWEB
python3 scripts/preparar-publicacao.py
python3 scripts/validar.py
git status --short
git add .
git diff --cached --stat
git commit -m "Atualiza site institucional"
```

`dist/`, dependências, arquivos de ambiente e caches são ignorados. Os arquivos-fonte, imagens, documentação, testes e capturas de referência entram no versionamento. O site não requer instalação de dependências.

## 2. Enviar ao GitHub

Com uma conta que tenha permissão de escrita no repositório:

```bash
git push -u origin main
```

Use a autenticação normal do GitHub; não coloque tokens nos arquivos ou na URL do remote. O Pages precisa de uma branch já enviada para selecioná-la como produção. Se o GitHub responder com erro 403, o proprietário deverá conceder permissão **Write** à conta autenticada, ou o responsável deverá autenticar o Git com uma conta que já tenha essa permissão.

## 3. Conectar o Cloudflare Pages

1. Entre no painel da Cloudflare e acesse **Workers & Pages**.
2. Selecione **Create application → Pages → Connect to Git**.
3. Escolha **GitHub** e autorize o aplicativo Cloudflare Pages para `plagioutfpr-project/webPage`.
4. Selecione o repositório e avance para a configuração.
5. Configure os campos abaixo.

| Campo | Valor |
| --- | --- |
| Project name | nome de sua preferência |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory (advanced) | deixar vazio: raiz do repositório |
| Build command | `python3 scripts/preparar-publicacao.py` |
| Build output directory | `dist` |
| Environment variables | nenhuma |

Se o projeto for colocado dentro de outro repositório, ajuste somente **Root directory** para a pasta que contém este README e `scripts/`. Não selecione um projeto Workers: esta configuração usa **Pages**, apenas com arquivos estáticos.

6. Quando decidir publicar, selecione **Save and Deploy**. Esse é o passo que inicia a publicação.
7. Ao concluir, a Cloudflare fornecerá `https://NOME_DO_PROJETO.pages.dev/`. Esse subdomínio dispensa comprar domínio próprio.

A preparação em Python usa apenas a biblioteca padrão e gera os 33 arquivos públicos em `dist/`. Não há instalação npm ou dependências de runtime. Documentação e ferramentas de teste ficam apenas no GitHub. Não configure fallback SPA, Functions, banco de dados ou variáveis de autenticação.

## 4. Conferir após a publicação

- Abra `/` e confirme a inicial, o logo e a árvore animada ao rolar.
- Navegue pelas seis páginas institucionais e volte pelo logo ou link Início.
- Confira o menu em celular e a alternância de tema após recarregar.
- Abra e feche as perguntas; amplie e baixe os cinco cartazes de Materiais.
- Confirme que os botões e links de acesso à plataforma, catálogo, login e cadastro não aparecem na interface.
- Confira `/landing.html`, mantido para endereços antigos.
- Confira que `/login.html`, `/cadastro.html` e uma rota inexistente retornam **404**. O arquivo público `404.html` impede o fallback automático para a inicial.
- O Pages pode redirecionar `/sobre.html` para `/sobre`; ambas devem resolver a página. O mesmo vale para as demais páginas, sem afetar recursos relativos.

Essas verificações em produção deverão ser feitas pelo responsável: os testes desta entrega ocorreram em hospedagem HTTP estática local, sem deploy.

## 5. Atualizações futuras

Edite os arquivos-fonte na raiz do projeto, teste novamente e revise os hashes de destino dos arquivos alterados no inventário. Faça commit e push quando quiser publicar a atualização. Após a conexão, o Pages faz novos builds automaticamente a cada push na branch de produção; outras branches podem gerar previews. `dist/` será recriada pelo comando de build, portanto não deve ser enviada ao GitHub.

## Referências oficiais

Configuração consultada em 20/11/2026:

- [Integração Git e conexão ao GitHub](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Publicação de HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Configuração de build](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Rotas HTML, páginas 404 e fallback SPA](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Limites do Cloudflare Pages por plano](https://developers.cloudflare.com/pages/platform/limits/)
