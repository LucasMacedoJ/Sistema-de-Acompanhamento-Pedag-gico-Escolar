const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();

// =============================
// 🔗 Conexão com o MongoDB
// =============================
mongoose.connect('mongodb://localhost/sapebd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// =============================
// 🧩 Middlewares base
// =============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =============================
// 💾 Sessão
// =============================
app.use(session({
  secret: 'chave-super-secreta-aqjoeqdkhaiudahdkbakgsdliavktsdofp8qgilvdkgacfoszdigbv1o6208e9p81024-2rqsa',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: null } // expira ao fechar navegador
}));

// =============================
// 📁 Arquivos estáticos e views
// =============================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Servir a pasta /public corretamente
app.use(express.static(path.join(__dirname, 'public')));

// Também serve /uploads direto (caso queira salvar fora de /public)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// =============================
// 👤 Middleware: disponibiliza usuário logado para todas as views
// =============================
app.use((req, res, next) => {
  const usuario = req.session?.usuario || null;

  if (usuario) {
    // Normaliza os campos de usuário para todas as views
    res.locals.usuario = {
      ...usuario,
      role: usuario.role || usuario.perfil || 'user',
      foto: usuario.foto || usuario.avatar || null
    };

    // Define se é admin
    res.locals.isAdmin =
      usuario.perfil === 'admin' || usuario.role === 'admin';
  } else {
    res.locals.usuario = null;
    res.locals.isAdmin = false;
  }

  next();
});

// =============================
// 🧭 Importação das rotas
// =============================
const loginRoutes = require('./routes/login');
const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const turmasRoutes = require('./routes/turmas');
const apoiaRoutes = require('./routes/apoia');
const nepreRoutes = require('./routes/nepre');
const usuarioRouter = require('./routes/usuario');
const testeRoutes = require('./routes/teste');
const erroRoutes = require('./routes/erro');

// =============================
// 🔐 Middlewares de proteção
// =============================
function requireLogin(req, res, next) {
  if (!req.session?.usuario) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session?.usuario || req.session.usuario.perfil !== 'admin') {
    return res.redirect('/erro');
  }
  next();
}

// =============================
// 🌐 Rotas
// =============================

// Rotas públicas
app.use('/erro', erroRoutes);
app.use('/login', loginRoutes);
app.use('/teste', testeRoutes); // rota de teste

// Rotas de usuários (com controle interno)
app.use('/usuario', usuarioRouter);

// Rotas protegidas
app.use('/alunos', requireLogin, alunosRoutes);
app.use('/ocorrencias', requireLogin, ocorrenciasRoutes);
app.use('/turmas', requireLogin, turmasRoutes);
app.use('/apoia', requireLogin, apoiaRoutes);
app.use('/nepre', requireLogin, nepreRoutes);

// Rota inicial
app.get('/', (req, res) => res.redirect('/login'));

// =============================
// 🚀 Inicialização
// =============================
app.listen(3000, () => {
  console.log("✅ Servidor rodando na porta 3000");
});
