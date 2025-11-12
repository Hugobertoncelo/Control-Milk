const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("✅ Control Milk API está rodando!");
});

// Rotas da API
app.use("/api", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
