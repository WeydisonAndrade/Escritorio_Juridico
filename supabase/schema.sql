-- =============================================================================
-- Escritório de Advocacia — Estrutura do banco (Supabase/PostgreSQL)
-- Execute este script no SQL Editor do Supabase (Dashboard > SQL Editor).
-- =============================================================================

-- Tabela principal: casos jurídicos (relatos de clientes e gestão)
CREATE TABLE IF NOT EXISTS casos_juridicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_recebimento TIMESTAMPTZ NOT NULL DEFAULT now(),
    nome_cliente TEXT NOT NULL,
    whatsapp TEXT,
    relato_cliente TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'Pendente',
    palavras_chave TEXT[] DEFAULT '{}',
    prioridade TEXT NOT NULL DEFAULT 'Média'
        CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
    valor_estimado DECIMAL(12, 2) DEFAULT NULL,
    status_gestao TEXT NOT NULL DEFAULT 'Novo'
);

-- Exemplo de valores: categoria ('Acidente', 'Horas Extras', 'Pendente', etc.)
-- status_gestao ('Novo', 'Em análise', 'Contrato Assinado', etc.)

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_casos_data_recebimento ON casos_juridicos (data_recebimento DESC);
CREATE INDEX IF NOT EXISTS idx_casos_categoria ON casos_juridicos (categoria);
CREATE INDEX IF NOT EXISTS idx_casos_status_gestao ON casos_juridicos (status_gestao);
CREATE INDEX IF NOT EXISTS idx_casos_prioridade ON casos_juridicos (prioridade);

-- Comentários nas colunas (documentação)
COMMENT ON TABLE casos_juridicos IS 'Relatos de clientes e acompanhamento de casos do escritório';
COMMENT ON COLUMN casos_juridicos.palavras_chave IS 'Palavras-chave extraídas pelo processamento (ex.: Python) para filtros e buscas';
COMMENT ON COLUMN casos_juridicos.valor_estimado IS 'Valor estimado do caso em reais';
