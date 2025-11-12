const express = require("express");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Rotas da API (Ex: /api/milks, /api/diapers)
app.use("/api", middlewares, router);

// Servir o React build
app.use(express.static(path.join(__dirname, "build")));

// Qualquer rota desconhecida → React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
