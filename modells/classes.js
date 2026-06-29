const mysql = require('mysql2/promise');

// 1. Configuração da conexão com o banco de dados (Mantendo suas credenciais)
const dbConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "alunolab",
    database: "cidadao_seguro" 
};

// 2. Classe Base de Conexão (Singleton/Factory pattern para gerenciar a pool)
class Database {
    static async query(sql, params) {
        const connection = await mysql.createConnection(dbConfig);
        try {
            const [results] = await connection.execute(sql, params);
            return results;
        } catch (error) {
            console.error(`[DB Error]: ${error.message}`);
            throw error;
        } finally {
            await connection.end();
        }
    }
}

// 3. Classe Cidadão
class Cidadao {
    constructor(nome, cpf, data_nascimento, email, telefone, endereco) {
        this.nome = nome;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    async salvar() {
        const sql = `
            INSERT INTO cidadao (nome, cpf, data_nascimento, email, telefone, endereco) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [this.nome, this.cpf, this.data_nascimento, this.email, this.telefone, this.endereco];
        return await Database.query(sql, params);
    }

    static async listarTodos() {
        return await Database.query('SELECT * FROM cidadao');
    }
}

// 4. Classe Agente
class Agente {
    constructor(nome, cpf, matricula, email, telefone, cargo, turno) {
        this.nome = nome;
        this.cpf = cpf;
        this.matricula = matricula;
        this.email = email;
        this.telefone = telefone;
        this.cargo = cargo;
        this.turno = turno;
    }

    async salvar() {
        const sql = `
            INSERT INTO agente (nome, cpf, matricula, email, telefone, cargo, turno) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [this.nome, this.cpf, this.matricula, this.email, this.telefone, this.cargo, this.turno];
        return await Database.query(sql, params);
    }

    static async listarTodos() {
        return await Database.query('SELECT * FROM agente');
    }
}

// 5. Classe Bairro
class Bairro {
    constructor(nome_bairro, zona, populacao_estimada, observacoes) {
        this.nome_bairro = nome_bairro;
        this.zona = zona;
        this.populacao_estimada = populacao_estimada;
        this.observacoes = observacoes;
    }

    async salvar() {
        const sql = `
            INSERT INTO bairro (nome_bairro, zona, populacao_estimada, observacoes) 
            VALUES (?, ?, ?, ?)
        `;
        const params = [this.nome_bairro, this.zona, this.populacao_estimada, this.observacoes];
        return await Database.query(sql, params);
    }

    static async listarTodos() {
        return await Database.query('SELECT * FROM bairro');
    }
}

// 6. Classe Ocorrência
class Ocorrencia {
    constructor(id_cidadao, id_agente, id_bairro, tipo_ocorrencia, status, data_hora, descricao) {
        this.id_cidadao = id_cidadao;
        this.id_agente = id_agente;
        this.id_bairro = id_bairro;
        this.tipo_ocorrencia = tipo_ocorrencia;
        this.status = status || 'Aberta';
        this.data_hora = data_hora;
        this.descricao = descricao;
    }

    async salvar() {
        const sql = `
            INSERT INTO ocorrencia (id_cidadao, id_agente, id_bairro, tipo_ocorrencia, status, data_hora, descricao) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [this.id_cidadao, this.id_agente, this.id_bairro, this.tipo_ocorrencia, this.status, this.data_hora, this.descricao];
        return await Database.query(sql, params);
    }

    static async listarRelatorioCompleto() {
        const sql = `
            SELECT 
                o.id_ocorrencia, o.tipo_ocorrencia, o.status, o.data_hora, o.descricao,
                c.nome AS cidadao_nome,
                a.nome AS agente_nome, a.matricula AS agente_matricula,
                b.nome_bairro, b.zona
            FROM ocorrencia o
            INNER JOIN cidadao c ON o.id_cidadao = c.id_cidadao
            INNER JOIN agente a ON o.id_agente = a.id_agente
            INNER JOIN bairro b ON o.id_bairro = b.id_bairro
            ORDER BY o.data_hora DESC
        `;
        return await Database.query(sql);
    }
}

// Exportando as classes para o seu servidor (Express / Router)
module.exports = { Cidadao, Agente, Bairro, Ocorrencia };