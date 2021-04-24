const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Bienvenidos a WChallenge!");
});

app.use("/api", require("./usuarioRoutes"));
app.use("/api", require("./criptomonedaRoutes"));

module.exports = app;
