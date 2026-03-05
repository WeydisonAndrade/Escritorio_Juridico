/**
 * Escritório Advocacia Trabalhista - Scripts da Landing Page (Versão REST API)
 */

document.addEventListener('DOMContentLoaded', function () {
    initMenuMobile();
    initFormularioContato();
    initMascaraWhatsApp();
});

/**
 * Toggle do menu mobile
 */
function initMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * Envio do formulário de contato via REST API
 */
function initFormularioContato() {
    const form = document.getElementById('form-contato');
    const mensagemDiv = document.getElementById('form-mensagem');
    const btnEnviar = document.getElementById('btn-enviar');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const caso = document.getElementById('caso').value.trim();

        // Validação básica
        if (!nome || !whatsapp || !caso) {
            exibirMensagem('Preencha todos os campos.', 'erro', mensagemDiv);
            return;
        }

        // Preparar interface para o envio
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        mensagemDiv.classList.add('hidden');

        // Organizar os dados em formato de Objeto para a API
        const dadosParaEnviar = {
            nome: nome,
            whatsapp: whatsapp,
            caso: caso
        };

        try {
            // Chamada para a API Flask rodando na porta 5000
            const response = await fetch('http://127.0.0.1:5000/api/contato', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Informamos que estamos enviando JSON
                },
                body: JSON.stringify(dadosParaEnviar) // Converte o objeto em texto JSON
            });

            const data = await response.json();

            if (response.ok) {
                exibirMensagem('Mensagem enviada com sucesso! Retornaremos em breve.', 'sucesso', mensagemDiv);
                form.reset();
            } else {
                exibirMensagem(data.mensagem || 'Erro ao enviar. Tente novamente.', 'erro', mensagemDiv);
            }
        } catch (erro) {
            console.error('Erro de conexão:', erro);
            exibirMensagem('O servidor está desligado. Ligue o app.py.', 'erro', mensagemDiv);
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar';
        }
    });
}

/**
 * Exibe mensagem de feedback no formulário
 */
function exibirMensagem(texto, tipo, elemento) {
    if (!elemento) return;
    elemento.textContent = texto;
    // Remove classes anteriores
    elemento.classList.remove('hidden', 'text-red-500', 'text-green-500'); 
    // Adiciona a cor correta (Red para erro, Green para sucesso)
    elemento.classList.add(tipo === 'sucesso' ? 'text-green-500' : 'text-red-500');
    elemento.classList.remove('hidden');
}

/**
 * Máscara para o campo WhatsApp
 */
function initMascaraWhatsApp() {
    const input = document.getElementById('whatsapp');
    if (!input) return;

    input.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 2) {
            valor = valor.replace(/^(\d{0,2})/, '($1');
        } else if (valor.length <= 7) {
            valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        e.target.value = valor;
    });
}