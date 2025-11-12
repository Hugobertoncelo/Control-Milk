const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Rotas da API
app.use('/api', middlewares, router);

// Serve o React build
app.use(express.static(path.join(__dirname, 'build')));

// Para qualquer outra rota, retorna index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
