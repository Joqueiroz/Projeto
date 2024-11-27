const router = require("express").Router();

const userController = require("../controllers/userController");
const ReservaController = require("../controllers/ReservaController");
const SalasController = require("../controllers/SalasController");


router.post("/users/", userController.createUser);
router.get("/users/", userController.getAllUsers);
router.put("/users/", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/login", userController.loginUser)

router.post("/reserva/", ReservaController.reservacreate);
router.get("/reserva/", ReservaController.getAllreserva);
router.put("/reserva/", ReservaController.updatereserva);
router.delete("/reserva/:id_reserva", ReservaController.deletereserva);

router.post("/salas/", SalasController.salascreate);
router.get("/salas/", SalasController.getAllSalas);
router.put("/salas/", SalasController.updateSala);
router.delete("/salas/:id_sala", SalasController.deleteSala);


module.exports = router;
