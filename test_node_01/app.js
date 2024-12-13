const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/pedidos", (req, res) => {
  res.send("Bienvenido a los pedidos.");
  //DFSA
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
