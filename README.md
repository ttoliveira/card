# Cartão Virtual

## Configuração (igual aos seus outros projetos)

### 1. Supabase — SQL Editor

Copie e execute **todo** o arquivo `supabase/setup.sql` no SQL Editor.

Isso cria de uma vez:

- tabela `virtual_cards`
- policies de acesso (RLS)
- bucket `card-photos`
- policies de upload/leitura de fotos

### 2. Frontend — `.env`

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

**Vercel:** não defina `VITE_APP_URL` como `localhost` — remova a variável ou use `https://seu-app.vercel.app`. O app detecta a URL do site automaticamente.

### Preview no WhatsApp

O preview (foto + título) funciona quando o link é **HTTPS em produção**. O servidor entrega meta tags Open Graph para crawlers do WhatsApp (`api/og` na Vercel ou function `og` na Netlify).

Configure no painel de hospedagem as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (também usadas pelo endpoint de preview).

### 3. Rodar

```bash
npm install
npm run dev
```

Pronto. Sem CLI, sem deploy de functions.

### `VITE_APP_URL` — precisa?

**Não**, na maioria dos casos. O código usa:

```js
import.meta.env.VITE_APP_URL || window.location.origin
```

- **Dev:** abrindo `http://localhost:5173` → o link compartilhado já sai com `localhost` (sem `.env`).
- **Prod:** abrindo `https://meusite.vercel.app` → o link sai com esse domínio automaticamente.

Só defina `VITE_APP_URL` se quiser **forçar** um domínio fixo (ex.: domínio customizado diferente da URL de deploy). Aí, na Vercel/Netlify, crie a variável no painel **Environment Variables** com `https://seudominio.com` antes do build.

---

## Sobre a pasta `supabase/functions/`

Opcional e **não necessária** para este fluxo. Edge Functions são código servidor separado do SQL — por isso antes pedi `supabase functions deploy`. Seus outros projetos provavelmente usavam só tabela + RLS + Storage via SQL, como agora.

## Erro "read-only transaction"

Se o SQL falhar com isso, troque para a branch **main** do banco no SQL Editor (não use réplica somente leitura).

---

## Publicar no GitHub Pages

O projeto já inclui o workflow `.github/workflows/deploy-pages.yml`.

### Passo a passo

1. Crie o repositório no GitHub (ex: `Card`) e envie o código para a branch `main`.

2. No GitHub: **Settings → Secrets and variables → Actions** e crie:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Settings → Pages → Build and deployment**
   - Source: **GitHub Actions**

4. A cada push na `main`, o site publica em:
   ```
   https://SEU_USUARIO.github.io/NOME_DO_REPO/
   ```
   Exemplo: repositório `Card` → `https://joaosilva.github.io/Card/`

5. O workflow define `VITE_APP_URL` automaticamente para os links de compartilhamento ficarem corretos.

### URLs do app no GitHub Pages

| Página | URL |
|--------|-----|
| Início | `https://usuario.github.io/Card/` |
| Criar | `https://usuario.github.io/Card/criar` |
| Cartão público | `https://usuario.github.io/Card/c/abc123` |

### Limitações no GitHub Pages

- **Só arquivos estáticos** — não roda `api/og` nem Edge Functions. O **preview do WhatsApp** (foto no link) **não funciona** aqui; para isso use Vercel ou Netlify.
- O app (criar cartão, Supabase, compartilhar) **funciona normalmente**.
- Se o repositório for `usuario.github.io` (site de usuário), a URL base é `/` e não `/Card/` — nesse caso ajuste `base` no `vite.config.js` para `'/'`.
