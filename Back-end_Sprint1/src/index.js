const express = require("express"); //Importa o módulo Express

//Define uma classe para organizar a lógica da aplicação
class AppController {
  constructor() {
    // Cria uma nova instância do Express dentro da classe
    this.express = express();
    //Chama o método middlewares para configurar os middlewares
    this.middlewares();
    //Chama o método routes para definir as rotas da API
    this.routes();
  }
  middlewares() {
    //Permitir que a aplicação receba dados em formato JSON nas requisições
    this.express.use(express.json());
  }
  //Define as rotas da nossa API
  routes() {
    const apiRoutes = require('./routes/apiRoutes');
    this.express.use('/Agendamento-sala-senai', apiRoutes);
    // Define uma rota GET para o caminho health
    this.express.get("/Agendamento-sala-senai/health/", (req, res) => {
      res.send({ status: "OK" });
    });//Essa rota é usada para verificar se a API está OK
  }
}

//Exportando a instância de Express configurada, para que seja acessada em outros arquivos
module.exports = new AppController().express;
