const connect = require("../db/connect");

module.exports = class ReservaController {

  static async reservacreate(req, res) {
    const { data_inicio, data_fim, id_usuario, id_sala } = req.body;

    // Validação de campos obrigatórios
    if (!data_inicio || !data_fim || !id_usuario || !id_sala) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Convertendo as datas para objetos Date (assumindo que estão no formato 'YYYY-MM-DD HH:MM:SS')
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);

    // 1. Verificar se data_fim não é antes de data_inicio
    if (fim <= inicio) {
      return res
        .status(400)
        .json({ error: "A data de fim não pode ser anterior ou igual à data de início" });
    }

    // 2. Verificar se a duração é de 1 hora 
    const duracao = fim - inicio;
    if (duracao !== 60 * 60 * 1000) { //Transformando 1 hora em milissegundos
      return res
        .status(400)
        .json({ error: "A reserva deve ter exatamente 1 hora de duração" });
    }

    // 3. Verificar se data_inicio e data_fim não são iguais
    if (data_inicio === data_fim) {
      return res
        .status(400)
        .json({ error: "A data de início e a data de fim não podem ser iguais" });
    }

    // Query para verificar se já existe uma reserva no horário solicitado
    const query = `
    SELECT * FROM reserva 
    WHERE id_sala = ?  
    AND (
      (data_inicio < ? AND data_fim > ?)  // Verifica se a nova reserva começa antes e termina depois de uma reserva existente
      OR 
      (data_inicio >= ? AND data_inicio < ?)  // Verifica se a nova reserva começa dentro de uma reserva existente
    )`;
  

    const valoresConflicto = [
      id_sala,
      data_fim,
      data_inicio,
      data_inicio,
      data_fim,
    ];//Valores que serão inseridos na '?'

    try {
      connect.query(query, valoresConflicto, (err, results) => {
         // Verifica se ocorreu algum erro durante a execução da query
        if (err) {
          console.error("Erro ao verificar conflito de reserva:", err);
          return res
            .status(500)
            .json({ error: "Erro ao verificar disponibilidade da sala" });
        }

        // Se encontrar algum conflito, retorna erro
        if (results.length > 0) {
          return res
            .status(400)
            .json({
              error: "Já existe uma reserva neste horário para esta sala",
            });
        }

        // Caso não haja conflito, cria a reserva
        const queryInsert = `INSERT INTO reserva(data_inicio, data_fim, id_usuario, id_sala) VALUES(?, ?, ?, ?)`;
        const valoresInsert = [data_inicio, data_fim, id_usuario, id_sala];

        connect.query(queryInsert, valoresInsert, (err) => {
          if (err) {
            console.error("Erro ao criar reserva:", err);
            return res.status(500).json({ error: "Erro ao criar a reserva" });
          }
          return res
            .status(201)
            .json({ message: "Reserva criada com sucesso" });
        });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter todas as reservas (já estava correto)
  static async getAllreserva(req, res) {
    const query = `SELECT * FROM reserva`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar reservas" });
        }
        return res
          .status(200)
          .json({ message: "Lista de reservas", reservas: results });
      });
    } catch (error) {
      console.error("Erro ao executar a query:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para atualizar reserva (já estava correto)
  static async updatereserva(req, res) {
    const { id_reserva, data_inicio, data_fim, id_usuario, id_sala } = req.body;

    // Validação de campos obrigatórios
    if (!id_reserva || !data_inicio || !data_fim || !id_usuario || !id_sala) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE reserva SET data_inicio=?, data_fim=?, id_usuario=?, id_sala=? WHERE id_reserva=?`;
    const values = [data_inicio, data_fim, id_usuario, id_sala, id_reserva];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res
          .status(200)
          .json({ message: "Reserva atualizada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para excluir reserva (já estava correto)
  static async deletereserva(req, res) {
    const reservaId = req.params.id_reserva;
    const query = `DELETE FROM reserva WHERE id_reserva = ?`;
    const values = [reservaId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir reserva" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res
          .status(200)
          .json({ message: "Reserva excluída com sucesso" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
