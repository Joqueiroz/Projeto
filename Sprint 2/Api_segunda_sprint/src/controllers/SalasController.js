const connect = require("../db/connect");

module.exports = class SalasController {
  static async salascreate(req, res) {
    const { id_sala, descricao, name, status_sala, capacidade } = req.body;

    if (!id_sala || !descricao || !name || !status_sala || !capacidade) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
}
}
};
