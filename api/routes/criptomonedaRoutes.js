const express = require("express");
const criptomonedaController = require("../controller/criptomonedaController");

var router = express.Router();
const { auth } = require("./../middleware/autenticacion");

router.get("/criptomoneda", auth, criptomonedaController.index);
router.get("/criptomonedas", auth, criptomonedaController.verTop);
router.post("/criptomoneda", auth, criptomonedaController.guardar);

module.exports = router;
