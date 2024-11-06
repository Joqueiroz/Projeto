const router = require("express").Router();

const userController = require("../controllers/userController");
const ReservaController = require("../controllers/ReservaController");


router.post("/users/", userController.createUser);
router.get("/users/", userController.getAllUsers);
router.put("/users/", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/login", userController.loginUser)

router.post("/reserva/", ReservaController.reservacreate);
router.get("/reserva/", ReservaController.getAllreserva);
router.put("/reserva/", ReservaController.updatereserva);
router.delete("/reserva/:id_reserva", ReservaController.deletereserva);



module.exports = router;
