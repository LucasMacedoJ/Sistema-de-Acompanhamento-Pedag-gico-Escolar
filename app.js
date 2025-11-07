// ============================================
// 🌐 SAPE — Servidor Principal
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();

// ============================================
// 🔗 Conexão com o MongoDB
// ============================================
mongoose.connect('mongodb://localhost/sapebd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// ============================================
// 🧩 Middlewares base
// ============================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================
// 🔒 Sessão
// ============================================
app.use(session({
  secret: 'chave-super-secreta-aqjoeqdkhaiudahdkbakgsdliavktsdofp8qgilvdkgacfoszdigbv1o6208e9p81024-2rqsa',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: null } // sessão durará enquanto o navegador estiver aberto
}));

// ============================================
// 📁 Views e Arquivos Estáticos
// ============================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// PASTA PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// Uploads (caso acessados diretamente)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ============================================
// 👤 Middleware global: informações do usuário + normalização de foto
// ============================================
app.use((req, res, next) => {
  const sessionUsuario = req.session?.usuario || null;

  if (sessionUsuario) {
    // normaliza e padroniza foto para começar com '/'
    let foto = sessionUsuario.foto ? String(sessionUsuario.foto).trim() : null;
    if (foto) {
      if (!foto.startsWith('/')) {
        if (foto.includes('uploads')) {
          foto = '/' + foto.replace(/^\/+/, '');
        } else {
          foto = '/uploads/' + foto.replace(/^\/+/, '');
        }
      }
    }

    // expõe objeto simplificado para views
    res.locals.usuario = {
      _id: sessionUsuario._id,
      nome: sessionUsuario.nome,
      email: sessionUsuario.email,
      perfil: sessionUsuario.perfil,
      role: sessionUsuario.perfil, // compatibilidade com código que usa 'role'
      foto: foto || null,
      avatar: sessionUsuario.avatar || null
    };

    // mantém a sessão coerente
    req.session.usuario.foto = res.locals.usuario.foto;

    res.locals.isAdmin = sessionUsuario.perfil === 'admin';
  } else {
    res.locals.usuario = null;
    res.locals.isAdmin = false;
  }

  next();
});

// ============================================
// 🧭 Importação das Rotas
// ============================================
const loginRoutes = require('./routes/login');
const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const turmasRoutes = require('./routes/turmas');
const apoiaRoutes = require('./routes/apoia');
const nepreRoutes = require('./routes/nepre');
const usuarioRoutes = require('./routes/usuario');
const testeRoutes = require('./routes/teste');
const erroRoutes = require('./routes/erro');

// ============================================
// 🔐 Middlewares de proteção
// ============================================
function requireLogin(req, res, next) {
  if (!req.session?.usuario) return res.redirect('/login');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session?.usuario || req.session.usuario.perfil !== 'admin') {
    return res.redirect('/erro');
  }
  next();
}

// ============================================
// 🌍 Rotas Públicas
// ============================================
app.use('/login', loginRoutes);
app.use('/erro', erroRoutes);
app.use('/teste', testeRoutes);

// ============================================
// 👤 Rotas de Usuário (controle interno no próprio router)
// ============================================
app.use('/usuario', usuarioRoutes);

// ============================================
// 🔐 Rotas Protegidas
// ============================================
app.use('/alunos', requireLogin, alunosRoutes);
app.use('/ocorrencias', requireLogin, ocorrenciasRoutes);
app.use('/turmas', requireLogin, turmasRoutes);
app.use('/apoia', requireLogin, apoiaRoutes);
app.use('/nepre', requireLogin, nepreRoutes);

// ============================================
// 🏠 Rota Inicial
// ============================================
app.get('/', (req, res) => res.redirect('/login'));

// ============================================
// 🚀 Inicialização do Servidor
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});