const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();

// Conexão com o MongoDB
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

// Middleware para ler dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: 'seuSegredoAqui', // Troque por um segredo forte em produção!
  resave: false,
  saveUninitialized: false
}));

// Diretório das views
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.set('view engine', 'pug');

// Importando as rotas
const loginRoutes = require('./routes/login');
const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const turmasRoutes = require('./routes/turmas');
const apoiaRoutes = require('./routes/apoia');
const usuariosRoutes = require('./routes/usuarios');
const testeRoutes = require('./routes/teste');

// Middleware para proteger rotas
function requireLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// Middleware para proteger rotas de admin
function requireAdmin(req, res, next) {
  if (!req.session.usuario || req.session.usuario.perfil !== 'admin') {
    return res.status(403).send('Acesso restrito ao administrador.');
  }
  next();
}

// Rotas públicas
app.use('/login', loginRoutes);
app.use('/teste', testeRoutes); // Cadastro de usuário de teste sem login

// Rotas de usuários (apenas admin pode acessar)
app.use('/usuarios', requireLogin, requireAdmin, usuariosRoutes);

// Rotas protegidas para usuários autenticados
app.use('/alunos', requireLogin, alunosRoutes);
app.use('/ocorrencias', requireLogin, ocorrenciasRoutes);
app.use('/turmas', requireLogin, turmasRoutes);
app.use('/apoia', requireLogin, apoiaRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});