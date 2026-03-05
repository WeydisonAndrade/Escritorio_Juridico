import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS

app = Flask(__name__, template_folder='.')
app.secret_key = os.environ.get('SECRET_KEY', 'chave-secreta-desenvolvimento-justica-trabalhista')
# O CORS permite que seu index.html (mesmo aberto fora do servidor) acesse a API
CORS(app)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """GET: exibe a página de login. POST: valida credenciais e redireciona para o dashboard."""
    if session.get('logado'):
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        usuario = request.form.get('usuario', '').strip()
        senha = request.form.get('senha', '')
        if usuario and senha:
            session['logado'] = True
            session['usuario'] = usuario
            return redirect(url_for('dashboard'))
        return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    """Encerra a sessão e redireciona para o login."""
    session.clear()
    return redirect(url_for('login_page'))


@app.route('/dashboard')
def dashboard():
    """Painel do profissional: exibe mensagens/contatos recebidos."""
    if not session.get('logado'):
        return redirect(url_for('login_page'))
    contatos = []
    if os.path.exists('contatos.json'):
        with open('contatos.json', 'r', encoding='utf-8') as f:
            contatos = json.load(f)
    return render_template('dashboard.html', contatos=contatos)


@app.route('/api/contato', methods=['POST'])
def receber_contato():
    try:
        dados = request.json  # A API espera receber um JSON
        
        novo_contato = {
            "data": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "nome": dados.get('nome'),
            "whatsapp": dados.get('whatsapp'),
            "caso": dados.get('caso')
        }
        
        contatos = []
        if os.path.exists('contatos.json'):
            with open('contatos.json', 'r', encoding='utf-8') as f:
                contatos = json.load(f)
                
        contatos.append(novo_contato)
        
        with open('contatos.json', 'w', encoding='utf-8') as f:
            json.dump(contatos, f, indent=4, ensure_ascii=False)
        
        return jsonify({"status": "sucesso", "mensagem": "Dados salvos!"}), 201
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 400

if __name__ == '__main__':
    # Rodando na porta 5000 para ser sua API oficial
    app.run(debug=True, port=5000)