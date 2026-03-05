/**
 * Cliente Supabase — Escritório de Advocacia
 * Configure as credenciais em config.supabase.js (copie de config.supabase.example.js)
 * ou defina window.SUPABASE_URL e window.SUPABASE_ANON_KEY antes de carregar este script.
 */

(function (global) {
    'use strict';

    var createClient = (global.supabase && (global.supabase.createClient || global.supabase))
        || (typeof require === 'function' && (function () { try { return require('@supabase/supabase-js').createClient; } catch (e) { return null; } })());

    var url = global.SUPABASE_URL || (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL);
    var key = global.SUPABASE_ANON_KEY || (typeof process !== 'undefined' && process.env && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY));

    if (!url || !key) {
        console.warn('Supabase: defina SUPABASE_URL e SUPABASE_ANON_KEY (em config.supabase.js ou .env).');
    }

    var client = (url && key && createClient) ? createClient(url, key) : null;

    /**
     * Insere o relato do cliente vindo do formulário de contato (nome, whatsapp, caso).
     * Retorna Promise com { data, error }.
     * @param {Object} dados - { nome_cliente, whatsapp, relato_cliente, categoria?, prioridade?, palavras_chave? }
     */
    function inserirRelatoCliente(dados) {
        if (!client) return Promise.resolve({ data: null, error: new Error('Supabase não configurado') });
        var payload = {
            nome_cliente: dados.nome_cliente || dados.nome || '',
            whatsapp: dados.whatsapp || '',
            relato_cliente: dados.relato_cliente || dados.caso || dados.relato || '',
            categoria: dados.categoria || 'Pendente',
            prioridade: dados.prioridade || 'Média',
            palavras_chave: Array.isArray(dados.palavras_chave) ? dados.palavras_chave : (dados.palavras_chave ? [dados.palavras_chave] : []),
            valor_estimado: dados.valor_estimado != null ? dados.valor_estimado : null,
            status_gestao: dados.status_gestao || 'Novo'
        };
        return client.from('casos_juridicos').insert(payload).select('id').single();
    }

    /**
     * Busca todos os dados necessários para alimentar os gráficos do dashboard (Chart.js).
     * Retorna Promise com objeto no formato de configuracoesGestao + lista de casos para triagem.
     * @returns {Promise<Object>} { casos, distribuicaoPorTipo, evoluco7Dias, taxaConversaoLeads }
     */
    function buscarDadosParaDashboard() {
        if (!client) {
            return Promise.resolve({
                casos: [],
                distribuicaoPorTipo: [],
                evolucao7Dias: [],
                taxaConversaoLeads: 0
            });
        }
        return client
            .from('casos_juridicos')
            .select('id, data_recebimento, nome_cliente, whatsapp, relato_cliente, categoria, prioridade, status_gestao, valor_estimado')
            .order('data_recebimento', { ascending: false })
            .then(function (res) {
                if (res.error) return { casos: [], distribuicaoPorTipo: [], evolucao7Dias: [], taxaConversaoLeads: 0 };
                var casos = res.data || [];
                var hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                var seteDiasAtras = new Date(hoje);
                seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

                // Distribuição por categoria (para gráfico de barras)
                var porCategoria = {};
                casos.forEach(function (c) {
                    var cat = c.categoria || 'Pendente';
                    porCategoria[cat] = (porCategoria[cat] || 0) + 1;
                });
                var distribuicaoPorTipo = Object.keys(porCategoria).map(function (tipo) {
                    return { tipo: tipo, quantidade: porCategoria[tipo] };
                });

                // Evolução últimos 7 dias (por data_recebimento)
                var porDia = {};
                for (var d = 0; d < 7; d++) {
                    var dia = new Date(seteDiasAtras);
                    dia.setDate(dia.getDate() + d);
                    var key = dia.getDate().toString().padStart(2, '0') + '/' + (dia.getMonth() + 1).toString().padStart(2, '0');
                    porDia[key] = 0;
                }
                casos.forEach(function (c) {
                    var dt = new Date(c.data_recebimento);
                    if (dt >= seteDiasAtras && dt <= new Date(hoje.getTime() + 86400000)) {
                        var k = dt.getDate().toString().padStart(2, '0') + '/' + (dt.getMonth() + 1).toString().padStart(2, '0');
                        if (porDia[k] !== undefined) porDia[k]++;
                    }
                });
                var labels7 = [];
                var valores7 = [];
                for (var i = 0; i < 7; i++) {
                    var d = new Date(seteDiasAtras);
                    d.setDate(d.getDate() + i);
                    var lbl = d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');
                    labels7.push(lbl);
                    valores7.push(porDia[lbl] || 0);
                }
                var evolucao7Dias = labels7.map(function (l, i) { return { data: l, quantidade: valores7[i] }; });

                // Taxa de conversão: Contrato Assinado / total (simplificado)
                var total = casos.length;
                var convertidos = casos.filter(function (c) { return (c.status_gestao || '').toLowerCase().indexOf('contrato') >= 0; }).length;
                var taxaConversaoLeads = total > 0 ? Math.round((convertidos / total) * 100) : 0;

                return {
                    casos: casos,
                    distribuicaoPorTipo: distribuicaoPorTipo,
                    evolucao7Dias: evolucao7Dias,
                    taxaConversaoLeads: taxaConversaoLeads
                };
            });
    }

    global.inserirRelatoCliente = inserirRelatoCliente;
    global.buscarDadosParaDashboard = buscarDadosParaDashboard;
    global.supabaseClient = client;
})(typeof window !== 'undefined' ? window : global);
