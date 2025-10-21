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
  secret: 'aqjoeqdkhaiudahdkbakgsdliavktsdofp8qgilvdkgacfoszdigbv1o6208e9p81024-2rqsa',
  resave: false,
  saveUninitialized: false,
  cookie: {} // sessão expira ao fechar o navegador
}));

// Diretório das views
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.set('view engine', 'ejs');

// Middleware: disponibiliza o usuário da sessão para as views
// e normaliza o campo `role` para compatibilidade com os templates.
app.use((req, res, next) => {
  const sessUser = req.session && req.session.usuario ? req.session.usuario : null;
  if (sessUser) {
    // copia os dados da sessão e garante que exista `role` usado nos templates
    res.locals.user = Object.assign({}, sessUser, { role: sessUser.perfil || sessUser.role });
    res.locals.isAdmin = (sessUser.perfil === 'admin' || sessUser.role === 'admin');
  } else {
    res.locals.user = null;
    res.locals.isAdmin = false;
  }
  next();
});

// Importando as rotas
const loginRoutes = require('./routes/login');
const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const turmasRoutes = require('./routes/turmas');
const apoiaRoutes = require('./routes/apoia');
const nepreRoutes = require('./routes/nepre');
const usuariosRoutes = require('./routes/usuarios');
const testeRoutes = require('./routes/teste');
const erroRoutes = require('./routes/erro');

// Middleware para proteger rotas
function requireLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// Middleware para proteger rotas de admin
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.usuario || req.session.usuario.perfil !== 'admin') {
    return res.redirect('/erro');
  }
  next();
}

// Rotas públicas
app.use('/erro', erroRoutes);
app.use('/login', loginRoutes);
app.use('/teste', testeRoutes); // Cadastro de usuário de teste sem login

// Monta /usuarios — routes/usuarios.js aplica requireLogin/requireAdmin conforme necessário
app.use('/usuarios', usuariosRoutes);

// Rotas protegidas para usuários autenticados
app.use('/alunos', requireLogin, alunosRoutes);
app.use('/ocorrencias', requireLogin, ocorrenciasRoutes);
app.use('/turmas', requireLogin, turmasRoutes);
app.use('/apoia', requireLogin, apoiaRoutes);
app.use('/nepre', requireLogin, nepreRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});