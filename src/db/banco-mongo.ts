import {MongoClient} from 'mongodb'
class BancoMongo{
    connection:MongoClient|null = null
    async criarConexao(){
        const url = 'mongodb://localhost:27017';
        const client = new MongoClient(url);
        this.connection = await client.connect();
    }
    async finalizarConexao(){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        await this.connection.close()
    }
    async listar(){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const db = this.connection.db("banco1022a");
        const result = db.collection('produtos').find().toArray()
        return result
    }
    async inserir(produto:{id:string,nome:string,descricao:string,preco:string,imagem:string}){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const db = this.connection.db("banco1022a");
        const result = db.collection('produtos').insertOne(produto)
        return result
    }
    async excluir(id:string){
        const idNumber = parseInt(id)
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const db = this.connection.db("banco1022a");
        const result = db.collection('produtos').deleteOne({idNumber})
        return result
    }
    async alterar(id:string,produto:{id?:string,nome:string,descricao:string,preco:string,imagem:string}){
        const idNumber = parseInt(id)
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const db = this.connection.db("banco1022a");
        const result = db.collection('produtos').updateOne({idNumber},{$set:produto})
        return result
    }
}

export default BancoMongo