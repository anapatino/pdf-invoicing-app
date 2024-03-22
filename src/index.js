import express from "express";
import bodyParser from "body-parser";
import index from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(index);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto ${PORT}");
});
