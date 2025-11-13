const express = require("express");
const path = require("path");
const jsonServer = require("json-server");
const cors = require("cors");

const app = express();

const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(cors());
app.use(express.json());

app.use("/api", middlewares, router);

const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em: http://localhost:${PORT}/api`);
  console.log(`💻 Frontend disponível em: http://localhost:${PORT}`);
  console.log("=========================================");
});
