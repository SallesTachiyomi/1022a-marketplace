import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import BancoMysql from './db/banco-mysql'

const app = express()
app.use(express.json())
app.use(cors())


app.get("/produtos", async (req, res) => {
    try {
        const banco = new BancoMysql()
        await banco.criarConexao()
        const result = await banco.listar()
        await banco.finalizarConexao()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send("Server ERROR")
    }
})
app.post("/produtos", async (req, res) => {
    try {
        const {id,nome,descricao,preco,imagem} = req.body
        const banco = new BancoMysql()
        await banco.criarConexao()
        const produto = {id,nome,descricao,preco,imagem}
        const result = await banco.inserir(produto)
        await banco.finalizarConexao()
        res.send(result) 
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//DELETAR
app.delete("/produtos/:id",async(req,res)=>{
    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.excluir(req.params.id)
    await banco.finalizarConexao()
    res.send("Produto excluido com sucesso id: "+req.params.id)
})

//ALTERAR
app.put("/produtos/:id",async(req,res)=>{
    const {id,nome,descricao,preco,imagem} = req.body
    const produto = {nome,descricao,preco,imagem}
    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.alterar(req.params.id,produto)
    await banco.finalizarConexao()
    res.send("Produto alterado com sucesso id: "+req.params.id)
})

app.listen(8000, () => {
    console.log("Iniciei o servidor")
})
