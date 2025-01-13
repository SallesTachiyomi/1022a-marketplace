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
        const result = await banco.consultar("select * from produtos")
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
        const result = await banco.consultar("INSERT INTO produtos VALUES (?,?,?,?,?)",[id,nome,descricao,preco,imagem])
        await banco.finalizarConexao()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//DELETAR
app.delete("/produtos/:id",async(req,res)=>{
    console.log(req.params.id)
    const query = "DELETE FROM produtos WHERE id = ?"
    const parametros = [req.params.id]

    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.consultar(query,parametros)
    await banco.finalizarConexao()
    res.send("Produto excluido com sucesso id: "+req.params.id)
})

//ALTERAR
app.put("/produtos/:id",(req,res)=>{
    console.log(req.params.id)
    
})

app.listen(8000, () => {
    console.log("Iniciei o servidor")
})
