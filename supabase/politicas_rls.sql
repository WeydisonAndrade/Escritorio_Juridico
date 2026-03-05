-- =============================================================================
-- Políticas RLS para a tabela casos_juridicos
-- Execute no SQL Editor do Supabase após criar a tabela (schema.sql).
-- Permite que a aplicação use a chave "anon" para INSERT e SELECT.
-- =============================================================================

-- Habilitar RLS na tabela
ALTER TABLE casos_juridicos ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode inserir um novo relato (formulário público de contato)
CREATE POLICY "Permitir inserção pública em casos_juridicos"
ON casos_juridicos FOR INSERT
TO anon
WITH CHECK (true);

-- Qualquer um com a chave anon pode ler os casos (para o dashboard;
-- em produção você pode restringir a usuários autenticados usando TO authenticated)
CREATE POLICY "Permitir leitura pública em casos_juridicos"
ON casos_juridicos FOR SELECT
TO anon
USING (true);
