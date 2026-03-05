# Integração Supabase — Escritório de Advocacia

## Parte 1: Banco de dados

1. Acesse o [Dashboard do Supabase](https://app.supabase.com) e crie um projeto (ou use um existente).
2. No menu lateral, abra **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql`.
3. A tabela `casos_juridicos` será criada com os campos definidos.

## Parte 2: Instalação do SDK (JavaScript)

Na raiz do projeto, no terminal:

```bash
npm install @supabase/supabase-js
```

(O projeto já inclui `package.json` com a dependência; o comando acima instala os pacotes em `node_modules`.)

Se você **não** usa npm/bundler e abre as páginas direto no navegador (arquivo ou servidor estático), use o Supabase via CDN nas suas páginas (veja “Uso no navegador” abaixo).

## Configuração das credenciais

1. No Supabase: **Project Settings** → **API**.
2. Copie **Project URL** e **anon public** key.
3. Crie o arquivo de config (não versionado):
   - Copie `static/js/config.supabase.example.js` para `static/js/config.supabase.js`.
   - Abra `config.supabase.js` e substitua:
     - `SUPABASE_URL` pela **Project URL**.
     - `SUPABASE_ANON_KEY` pela chave **anon public**.
4. Adicione ao `.gitignore`:
   ```
   static/js/config.supabase.js
   ```

## Uso no navegador (HTML)

Carregue os scripts **nessa ordem** (ajuste os caminhos se precisar):

```html
<!-- 1) Credenciais (use config.supabase.js em produção) -->
<script src="static/js/config.supabase.js"></script>
<!-- 2) Biblioteca Supabase (CDN — use se NÃO estiver usando npm/bundler) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<!-- 3) Cliente e funções do escritório -->
<script src="static/js/supabaseClient.js"></script>
```

Depois você pode usar:

- **Inserir relato do formulário de contato:**  
  `inserirRelatoCliente({ nome_cliente: '...', whatsapp: '...', relato_cliente: '...' })`
- **Buscar dados para o dashboard:**  
  `buscarDadosParaDashboard()`  
  Retorna um objeto com `casos`, `distribuicaoPorTipo`, `evoluco7Dias` e `taxaConversaoLeads` para alimentar os gráficos (Chart.js).

## Uso com Node / backend (ex.: Python + JS)

Se rodar o `supabaseClient.js` em Node (ou bundler), defina as variáveis de ambiente:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

O mesmo arquivo lê essas variáveis quando não houver `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`.

## Políticas de segurança (RLS)

No Supabase, por padrão a Row Level Security (RLS) está ativa. Para a tabela `casos_juridicos` aceitar inserção e leitura com a chave anon, crie políticas no SQL Editor, por exemplo:

- Inserção (anon): `INSERT` para `anon`.
- Leitura (anon): `SELECT` para `anon` (ou para `authenticated` se só usuários logados puderem ver).

Isso evita que qualquer pessoa com a URL do projeto leia ou escreva sem regras.
