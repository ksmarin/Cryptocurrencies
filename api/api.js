require("./config/config");
require("./config/db");

const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(require("./routes/indexRoutes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
