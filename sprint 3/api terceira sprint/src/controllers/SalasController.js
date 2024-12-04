const connect = require("../db/connect");

module.exports = class SalasController {
  // Criar nova sala
  static async salascreate(req, res) {
    const { descricao, nome, status_sala, capacidade } = req.body;
   //valores do corpo da requisicao
    if (!descricao || !nome || !status_sala || !capacidade) {
      //que verifica se algum dos campos obrigatórios está ausente
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    try {
      // Verificar se o nome da sala já existe
      const checkQuery = `SELECT * FROM sala WHERE nome = ?`;
      const checknome = [nome];
      
      connect.query(checkQuery, checknome, (err, results) => {
      //executar a consulta SQL, recebe a consulta, valores e execulta no banco de dados
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Erro interno ao verificar disponibilidade do nome" });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "O nome da sala já está em uso" });
        }

        // Inserir nova sala
        const query = `INSERT INTO sala(descricao, nome, status_sala, capacidade) VALUES (?, ?, ?, ?)`;
        const values = [descricao, nome, status_sala, capacidade];

        connect.query(query, values, (err) => {

          return res
            .status(201)
            .json({ message: "Sala criada com sucesso" });
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Obter todas as salas
  static async getAllSalas(req, res) {
    const query = `SELECT * FROM sala`;

    connect.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar salas" });
      }

      return res
        .status(200)
        .json({ message: "Lista de salas", salas: results });
    });
  }

  // Atualizar sala
  static async updateSala(req, res) {
    const { descricao, nome, status_sala, capacidade, id_sala } = req.body;

    if (!descricao || !nome || !status_sala || !capacidade || !id_sala) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE sala SET descricao = ?, nome = ?, status_sala = ?, capacidade = ? WHERE id_sala = ?`;
    const values = [descricao, nome, status_sala, capacidade, id_sala];

    connect.query(query, values, (err, results) => {
      if (err) {
        console.error("Erro ao executar consulta:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }

      return res
        .status(200)
        .json({ message: "Sala atualizada com sucesso" });
    });
  }catch (error) {
    console.error("Erro ao executar consulta:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  } 

  // Deletar sala
    static async deleteSala(req, res) {
    const salaId = req.params.id_sala;
    const query = `DELETE FROM sala WHERE id_sala = ?`;
    const values = [salaId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir sala" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }
        return res
          .status(200)
          .json({ message: "Sala excluída com sucesso" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
