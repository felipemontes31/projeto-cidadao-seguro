-- 1. Criação do Banco de Dados (Schema)
CREATE DATABASE IF NOT EXISTS db_seguranca_publica
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_seguranca_publica;

-- -----------------------------------------------------
-- Tabela: bairro
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS bairro (
    id_bairro INT AUTO_INCREMENT,
    nome_bairro VARCHAR(100) NOT NULL,
    zona ENUM('Norte', 'Sul', 'Leste', 'Oeste', 'Central') NOT NULL,
    populacao_estimada INT NULL,
    observacoes TEXT NULL,
    CONSTRAINT pk_bairro PRIMARY KEY (id_bairro)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: cidadao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cidadao (
    id_cidadao INT AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL, -- Suporta o formato mascarado: 000.000.000-00
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) NULL, -- Suporta o formato mascarado: (00) 00000-0000
    endereco VARCHAR(255) NOT NULL,
    CONSTRAINT pk_cidadao PRIMARY KEY (id_cidadao),
    CONSTRAINT uk_cidadao_cpf UNIQUE (cpf)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: agente
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS agente (
    id_agente INT AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    matricula VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) NULL,
    cargo ENUM('Policial Civil', 'Policial Militar', 'Guarda Civil Municipal', 'Fiscal Municipal', 'Agente de Trânsito') NOT NULL,
    turno ENUM('Matutino', 'Vespertino', 'Noturno', 'Integral') NOT NULL,
    CONSTRAINT pk_agente PRIMARY KEY (id_agente),
    CONSTRAINT uk_agente_cpf UNIQUE (cpf),
    CONSTRAINT uk_agente_matricula UNIQUE (matricula)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: ocorrencia
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT,
    id_cidadao INT NOT NULL,
    id_agente INT NOT NULL,
    id_bairro INT NOT NULL,
    tipo_ocorrencia ENUM('Roubo', 'Furto', 'Vandalismo', 'Perturbação da Ordem', 'Acidente de Trânsito', 'Violência Doméstica', 'Tráfico de Drogas', 'Outros') NOT NULL,
    status ENUM('Aberta', 'Em atendimento', 'Encerrada') NOT NULL DEFAULT 'Aberta',
    data_hora DATETIME NOT NULL,
    descricao TEXT NOT NULL,
    CONSTRAINT pk_ocorrencia PRIMARY KEY (id_ocorrencia),
    
    -- Chaves Estrangeiras (Garantindo a integridade dos dados)
    CONSTRAINT fk_ocorrencia_cidadao FOREIGN KEY (id_cidadao)
        REFERENCES cidadao (id_cidadao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_agente FOREIGN KEY (id_agente)
        REFERENCES agente (id_agente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_bairro FOREIGN KEY (id_bairro)
        REFERENCES bairro (id_bairro)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Indices para otimização de consultas (Performance em buscas com JOIN)
CREATE INDEX idx_ocorrencia_cidadao ON ocorrencia (id_cidadao);
CREATE INDEX idx_ocorrencia_agente ON ocorrencia (id_agente);
CREATE INDEX idx_ocorrencia_bairro ON ocorrencia (id_bairro);