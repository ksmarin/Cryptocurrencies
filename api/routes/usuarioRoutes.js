const express = require("express");
const usuarioController = require("./../controller/usuarioController");

const { auth } = require("./../middleware/autenticacion");

var router = express.Router();

router.post("/login", usuarioController.login);

router.get("/usuario", auth, usuarioController.index);
router.post("/usuario", usuarioController.guardar);
router.get("/usuario/:id", auth, usuarioController.ver);
router.put("/usuario/:id", auth, usuarioController.modificar);
router.delete("/usuario/:id/:estado", auth, usuarioController.eliminar);

module.exports = router;
