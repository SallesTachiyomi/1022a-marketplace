import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import BancoMysql from './db/banco-mysql';
import BancoMongo from './db/banco-mongo';

const app = express();
app.use(express.json());
app.use(cors());

// Listar todos os produtos
app.get("/produtos", async (req, res) => {
    try {
        const banco = new BancoMysql();
        await banco.criarConexao();
        const result = await banco.listar();
        await banco.finalizarConexao();
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server ERROR");
    }
});

// Listar produto por ID
app.get("/produtos/:id", async (req, res) => {
    try {
        const banco = new BancoMysql();
        await banco.criarConexao();
        const result = await banco.listarPorId(req.params.id);
        await banco.finalizarConexao();
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server ERROR");
    }
});

// Adicionar um novo produto (incluindo categoria e faixa_etaria)
app.post("/produtos", async (req, res) => {
    try {
        const { id, nome, descricao, preco, imagem, categoria, faixa_etaria } = req.body;
        
        // Verificar se todos os campos obrigatórios foram enviados
        if (!id || !nome || !descricao || !preco || !imagem || !categoria || !faixa_etaria) {
            return res.status(400).send("Todos os campos são obrigatórios");
        }

        const banco = new BancoMysql();
        await banco.criarConexao();
        const produto = { 
            id: parseInt(id), 
            nome, 
            descricao, 
            preco, 
            imagem, 
            categoria, // Novo atributo
            faixa_etaria // Novo atributo
        };
        const result = await banco.inserir(produto);
        await banco.finalizarConexao();
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// Deletar um produto
app.delete("/produtos/:id", async (req, res) => {
    try {
        const banco = new BancoMysql();
        await banco.criarConexao();
        const result = await banco.excluir(req.params.id);
        await banco.finalizarConexao();
        res.status(200).send("Produto excluído com sucesso id: " + req.params.id);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao excluir");
    }
});

// Alterar um produto (incluindo categoria e faixa_etaria)
app.put("/produtos/:id", async (req, res) => {
    try {
        const { nome, descricao, preco, imagem, categoria, faixa_etaria } = req.body;

        // Verificar se todos os campos obrigatórios foram enviados
        if (!nome || !descricao || !preco || !imagem || !categoria || !faixa_etaria) {
            return res.status(400).send("Todos os campos são obrigatórios");
        }

        const produto = { nome, descricao, preco, imagem, categoria, faixa_etaria };
        const banco = new BancoMysql();
        await banco.criarConexao();
        const result = await banco.alterar(req.params.id, produto);
        await banco.finalizarConexao();
        res.status(200).send("Produto alterado com sucesso id: " + req.params.id);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro ao alterar produto");
    }
});

app.listen(8000, () => {
    console.log("Iniciei o servidor");
});
