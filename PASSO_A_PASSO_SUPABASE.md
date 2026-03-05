# Guia passo a passo — Supabase no Escritório de Advocacia

Siga esta ordem. Cada passo depende do anterior.

---

## Passo 1: Criar (ou abrir) o projeto no Supabase

1. Acesse **https://app.supabase.com** e faça login.
2. Clique em **New Project** (ou selecione um projeto existente).
3. Preencha:
   - **Name:** nome do projeto (ex.: `escritorio-advocacia`).
   - **Database Password:** crie e guarde uma senha forte (você vai precisar para acessar o banco).
   - **Region:** escolha a mais próxima (ex.: South America).
4. Clique em **Create new project** e espere o projeto ser criado (alguns segundos).

---

## Passo 2: Criar a tabela no banco (SQL)

1. No menu lateral do Supabase, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra no seu computador o arquivo **`supabase/schema.sql`** do seu projeto.
4. Copie **todo** o conteúdo desse arquivo.
5. Cole no editor SQL do Supabase (na área de texto grande).
6. Clique no botão **Run** (ou use Ctrl+Enter).
7. Deve aparecer uma mensagem de sucesso. A tabela **`casos_juridicos`** foi criada.

---

## Passo 3: Liberar leitura e escrita (políticas RLS)

O Supabase usa Row Level Security (RLS). Sem políticas, a API não consegue inserir nem ler dados.

1. Ainda no **SQL Editor**, clique em **New query** de novo.
2. Cole o conteúdo do arquivo **`supabase/politicas_rls.sql`** (veja no seu projeto).
3. Clique em **Run**.
4. Pronto: a tabela passa a aceitar **INSERT** e **SELECT** com a chave pública (anon).

*(Se preferir, você pode usar o passo 3.1 abaixo em vez do arquivo.)*

**3.1 — Alternativa:** criar as políticas manualmente no Supabase:
- Menu **Authentication** → **Policies** (ou **Table Editor** → tabela `casos_juridicos` → "RLS").
- Criar política de **INSERT** para função `anon`.
- Criar política de **SELECT** para função `anon`.

---

## Passo 4: Copiar a URL e a chave da API

1. No menu lateral, clique no ícone de **engrenagem** (Settings).
2. Clique em **API** (no submenu Project Settings).
3. Na seção **Project URL**, clique em **Copy** e guarde em um bloco de notas:
   - Algo como: `https://xxxxxxxx.supabase.co`
4. Na seção **Project API keys**, copie a chave **anon** **public** (não use a chave **service_role** no front):
   - Clique em **Copy** ao lado de **anon public**.
   - Guarde essa chave no mesmo bloco de notas.

---

## Passo 5: Instalar o SDK do Supabase no projeto

1. Abra o **terminal** (PowerShell ou CMD).
2. Vá até a pasta do projeto, por exemplo:
   ```bash
   cd "C:\Users\Administrador\OneDrive\Área de Trabalho\Meu Portfólio\Escritório_Advocacia"
   ```
3. Rode:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Espere terminar. Deve aparecer algo como `added 1 package` e a pasta **`node_modules`** será criada.

---

## Passo 6: Configurar as credenciais no navegador

1. Na pasta do projeto, vá em **`static/js/`**.
2. Copie o arquivo **`config.supabase.example.js`** e cole na mesma pasta.
3. Renomeie a cópia para **`config.supabase.js`**.
4. Abra **`config.supabase.js`** no editor.
5. Substitua:
   - `https://SEU_PROJETO.supabase.co` → pela **Project URL** que você copiou no Passo 4.
   - `sua-chave-anonima-aqui` → pela chave **anon public** que você copiou no Passo 4.
6. Salve o arquivo.
7. **Importante:** adicione **`static/js/config.supabase.js`** ao **`.gitignore`** para não subir a chave no Git.

---

## Passo 7: Usar o Supabase nas páginas (formulário e dashboard)

Os arquivos **index.html** e **dashboard.html** já foram atualizados para carregar os três scripts abaixo. Você só precisa ter concluído o **Passo 6** (criar e preencher `config.supabase.js`). Se esse arquivo não existir, o navegador pode mostrar erro 404 nele até você criá-lo.

Para o **formulário de contato** e o **dashboard** falarem com o Supabase, as páginas carregam três scripts **nessa ordem**:

1. **Config** (suas credenciais):  
   `static/js/config.supabase.js`
2. **Biblioteca Supabase** (CDN):  
   `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js`
3. **Seu cliente e funções:**  
   `static/js/supabaseClient.js`

Em **index.html** (página com o formulário de contato), adicione antes do `</body>`:

```html
<script src="static/js/config.supabase.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="static/js/supabaseClient.js"></script>
```

Em **dashboard.html**, adicione os mesmos três scripts antes dos outros scripts do dashboard.

Depois disso:
- No formulário, você pode chamar **`inserirRelatoCliente({ nome_cliente, whatsapp, relato_cliente })`** ao enviar o formulário.
- No dashboard, você pode chamar **`buscarDadosParaDashboard()`** e usar o retorno para alimentar os gráficos (Chart.js).

---

## Resumo rápido (checklist)

- [ ] Passo 1: Projeto criado no Supabase  
- [ ] Passo 2: Script `supabase/schema.sql` executado no SQL Editor  
- [ ] Passo 3: Políticas RLS aplicadas (`supabase/politicas_rls.sql` ou manual)  
- [ ] Passo 4: URL e chave anon copiadas  
- [ ] Passo 5: `npm install @supabase/supabase-js` executado  
- [ ] Passo 6: `config.supabase.js` criado e preenchido com URL e chave  
- [ ] Passo 7: Scripts adicionados em `index.html` e `dashboard.html`  

---

## Problemas comuns

- **"Supabase não configurado"**  
  Verifique se `config.supabase.js` existe, está sendo carregado **antes** de `supabaseClient.js`, e se a URL e a chave estão corretas.

- **Erro 401 ou 403 ao inserir/ler**  
  Confira se as políticas RLS (Passo 3) foram criadas e se você está usando a chave **anon**, não a **service_role**.

- **Página em branco ou erro no console**  
  Confira a ordem dos scripts (config → CDN Supabase → supabaseClient.js) e se os caminhos (`static/js/...`) estão corretos em relação à pasta do seu site.

Se quiser, no próximo passo podemos integrar o **envio do formulário** em `index.html` para chamar `inserirRelatoCliente` e o **dashboard** para usar `buscarDadosParaDashboard()` nos gráficos.
