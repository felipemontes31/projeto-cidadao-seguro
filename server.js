const express = require("express");
const path = require("path");

// Importando as novas classes do projeto de Segurança Pública
const { Cidadao, Agente, Bairro, Ocorrencia } = require("./modells/classes");

const app = express();
const porta = 3000; // Porta do servidor Node.js

// Middlewares obrigatórios para ler os dados enviados pelos formulários HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Boa prática: habilita suporte a JSON se for usar AJAX/Fetch futuramente

// Servir os arquivos estáticos (HTML, CSS, JS do frontend) da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------------------------------
// Rota: Cadastro de Cidadão
// -----------------------------------------------------
app.post("/cadastro_cidadao", async (req, res) => {
    try {
        const { nome, cpf, data_nascimento, email, telefone, endereco } = req.body;

        const cidadao = new Cidadao(nome, cpf, data_nascimento, email, telefone, endereco);
        
        // Executa o método assíncrono para salvar no banco
        await cidadao.salvar();

        // Redireciona com parâmetro de sucesso para ativar o Toast no frontend
        res.redirect("/index.html?sucesso=true"); 
    } catch (erro) {
        console.error("Erro ao cadastrar cidadão:", erro);
        res.status(500).send("Erro interno ao cadastrar cidadão.");
    }
});

// -----------------------------------------------------
// Rota: Cadastro de Agente de Segurança
// -----------------------------------------------------
app.post("/cadastro_agente", async (req, res) => {
    try {
        const { nome, cpf, matricula, email, telefone, cargo, turno } = req.body;

        const agente = new Agente(nome, cpf, matricula, email, telefone, cargo, turno);
        
        await agente.salvar();

        res.redirect("/index.html?sucesso=true");
    } catch (erro) {
        console.error("Erro ao cadastrar agente:", erro);
        res.status(500).send("Erro interno ao cadastrar agente.");
    }
});

// -----------------------------------------------------
// Rota: Cadastro de Bairro
// -----------------------------------------------------
app.post("/cadastro_bairro", async (req, res) => {
    try {
        const { nome_bairro, zona, populacao_estimada, observacoes } = req.body;

        // Trata o campo opcional caso venha vazio do formulário
        const populacao = populacao_estimada ? parseInt(populacao_estimada) : null;

        const bairro = new Bairro(nome_bairro, zona, populacao, observacoes);
        
        await bairro.salvar();

        res.redirect("/index.html?sucesso=true");
    } catch (erro) {
        console.error("Erro ao cadastrar bairro:", erro);
        res.status(500).send("Erro interno ao cadastrar bairro.");
    }
});

// -----------------------------------------------------
// Rota: Registro de Ocorrência
// -----------------------------------------------------
app.post("/registro_ocorrencia", async (req, res) => {
    try {
        const { id_cidadao, id_agente, id_bairro, tipo_ocorrencia, status, data_hora, descricao } = req.body;

        const ocorrencia = new Ocorrencia(
            parseInt(id_cidadao), 
            parseInt(id_agente), 
            parseInt(id_bairro), 
            tipo_ocorrencia, 
            status, 
            data_hora, 
            descricao
        );
        
        await ocorrencia.salvar();

        res.redirect("/index.html?sucesso=true");
    } catch (erro) {
        console.error("Erro ao registrar ocorrência:", erro);
        res.status(500).send("Erro interno ao registrar ocorrência.");
    }
});

// Inicialização do Servidor
app.listen(porta, () => {
    console.log(`🛡️  Servidor de Segurança Pública rodando em http://localhost:${porta}`);
});