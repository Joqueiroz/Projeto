const connect = require("../db/connect");
const moment = require("moment-timezone"); // Importa o moment-timezone

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
    const duracao = new Date(fim) - new Date(inicio);
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
      (data_inicio < ? AND data_fim > ?)   -- Verifica se a nova reserva começa antes e termina depois de uma reserva existente
      OR 
      (data_inicio >= ? AND data_inicio < ?)  -- Verifica se a nova reserva começa dentro de uma reserva existente
    )`;

    const valoresConflicto = [
      id_sala,
      fim,
      inicio,
      inicio,
      fim,
    ];//Valores que serão inseridos na '?' para a query

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
        const valoresInsert = [inicio, fim, id_usuario, id_sala];

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
  
        // Converte os horários para o fuso horário de Brasília
        const reservas = results.map((reserva) => {
          return {
            ...reserva,
            data_inicio: moment(reserva.data_inicio).tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
            data_fim: moment(reserva.data_fim).tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
          };
        });
  
        return res
          .status(200)
          .json({ message: "Lista de reservas", reservas });
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
    if (duracao !== 60 * 60 * 1000) { // Transformando 1 hora em milissegundos
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
      AND id_reserva != ? 
      AND (
        (data_inicio < ? AND data_fim > ?) OR 
        (data_inicio >= ? AND data_inicio < ?)
      )`;
  
    const valoresConflicto = [
      id_sala,
      id_reserva,
      data_fim,
      data_inicio,
      data_inicio,
      data_fim,
    ];
  
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
  
        // Caso não haja conflito, atualiza a reserva
        const queryUpdate = `UPDATE reserva SET data_inicio=?, data_fim=?, id_usuario=?, id_sala=? WHERE id_reserva=?`;
        const valoresUpdate = [data_inicio, data_fim, id_usuario, id_sala, id_reserva];
  
        connect.query(queryUpdate, valoresUpdate, (err, results) => {
          if (err) {
            console.error("Erro ao atualizar reserva:", err);
            return res.status(500).json({ error: "Erro ao atualizar a reserva" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Reserva não encontrada" });
          }
          return res
            .status(200)
            .json({ message: "Reserva atualizada com sucesso" });
        });
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
