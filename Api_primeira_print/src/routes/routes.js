const router = require("express").Router();

const userController = require("../controllers/userController");

router.post("/users/", userController.createUser);
router.get("/users/", userController.getAllUsers);
router.put("/users/", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
