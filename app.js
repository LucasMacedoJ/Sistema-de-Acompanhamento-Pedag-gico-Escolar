const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Fazendo a conexão com o banco MongoDB
mongoose.connect('mongodb://localhost/sapebd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB conectado");
})
.catch((err) => {
  console.log("Erro ao conectar: " + err);
});

// Middleware do Express para ler os dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurando o diretório onde estão os templates (views)
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Definindo o template engine como Pug
app.set('view engine', 'pug');

// Importando as rotas 
const loginRoutes = require('./routes/login');
const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const turmasRoutes = require('./routes/turmas');
const apoiaRoutes = require('./routes/apoia'); // Adicionado

// Dizendo ao Express: qual rota usar
app.use('/login', loginRoutes);
app.use('/alunos', alunosRoutes);
app.use('/ocorrencias', ocorrenciasRoutes);
app.use('/turmas', turmasRoutes);
app.use('/apoia', apoiaRoutes); // Adicionado

// Rota inicial (opcional, apenas para redirecionar direto pro formulário)
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});