import mysql, { Connection, RowDataPacket } from 'mysql2/promise';

class BancoMysql {
    // Atributos de uma classe
    connection: Connection | null = null;

    // Métodos
    async criarConexao() {
        this.connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "localhost",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 3306
        });
    }

    async consultar(query: string, params?: any[]) {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query(query, params);
        return result;
    }

    async finalizarConexao() {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        await this.connection.end();
    }

    // Listar todos os produtos
    async listar() {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query("SELECT * FROM produtos");
        return result;
    }

    // Inserir um novo produto, incluindo categoria e faixa_etaria
    async inserir(produto: {
        id: number;
        nome: string;
        descricao: string;
        preco: string;
        imagem: string;
        categoria: string; // Novo atributo
        faixa_etaria: string; // Novo atributo
    }) {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query(
            "INSERT INTO produtos (id, nome, descricao, preco, imagem, categoria, faixa_etaria) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [produto.id, produto.nome, produto.descricao, produto.preco, produto.imagem, produto.categoria, produto.faixa_etaria]
        );
        return result;
    }

    // Excluir um produto
    async excluir(id: string) {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query("DELETE FROM produtos WHERE id = ?", [id]);
        return result;
    }

    // Alterar um produto, incluindo categoria e faixa_etaria
    async alterar(id: string, produto: {
        id?: string;
        nome: string;
        descricao: string;
        preco: string;
        imagem: string;
        categoria: string; // Novo atributo
        faixa_etaria: string; // Novo atributo
    }) {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query(
            "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ?, categoria = ?, faixa_etaria = ? WHERE id = ?",
            [produto.nome, produto.descricao, produto.preco, produto.imagem, produto.categoria, produto.faixa_etaria, id]
        );
        return result;
    }

    // Listar produto por ID
    async listarPorId(id: string) {
        if (!this.connection) throw new Error("Erro de conexão com o banco de dados.");
        const [result, fields] = await this.connection.query("SELECT * FROM produtos WHERE id = ?", [id]) as RowDataPacket[];
        return result[0];
    }
}

export default BancoMysql;
