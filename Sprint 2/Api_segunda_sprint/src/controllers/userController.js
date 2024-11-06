const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario(name, cpf, email, password) VALUES ('${name}', '${cpf}', '${email}', '${password}');`;

      // Executando a query INSERT
      try {
        connect.query(query, function (err) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O email já está vinculado a outro usuário" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro Interno Do Servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Usuarios", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "um erro foi encontrado" });
    }
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, email, password, name, id } = req.body;
    //Validar se todos os campos foram preenchidos
    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET cpf=?,email=?,password=?,name=? WHERE id_Usuario = ?`;
    const values = [name, email, password, cpf, id];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              error: "Email ja esta cadastrado por outro Usuario",
            });
          } else {
            console.error(err);
            return res.status(500).json({
              error: "erro interno do servidor",
            });
          }
        }
        if (results.affctedRows === 0) {
          return res.status(404).json({
            error: "Usuario não encontrado",
          });
        }
        return res.status(200).json({
          message: "Usuario foi atualizado com sucesso",
        });
      });
    } catch (error) {
      console.error("erro ao executar a consulta", error);
    }
    error: "erro interno do servidor";
  }

  static async deleteUser(req, res) {
    //Obtem o parametro Id da requisição, que é o cpf do user a ser deletado
    const UsuarioId = req.params.id;
    const query = `DELETE FROM Usuario WHERE id_Usuario = ?`;
    const values = [UsuarioId];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do sistema" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuario excluido com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async loginUser(req, res) {
    const { email, password } = req.body;
  
    // Verifica se ambos os campos foram preenchidos
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
  
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }
  
    // Query para buscar o usuário com o email e senha fornecidos
    const query = `SELECT * FROM usuario 
     WHERE email = '${email}'
     AND password = '${password}'`;
  
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
  
        if (results.length === 0) {
        
          return res.status(401).json({ error: "Email e Senha não encontrado" });
        }
  
        // Login bem-sucedido
        return res.status(200).json({ message: "Login bem-sucedido" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }  
};
