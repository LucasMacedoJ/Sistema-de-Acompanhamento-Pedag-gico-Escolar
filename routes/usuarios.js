const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar_${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Proteções locais (uso no router para permitir controle fino)
function requireLogin(req, res, next) {
    if (!req.session || !req.session.usuario) return res.redirect('/login');
    next();
}
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.usuario || req.session.usuario.perfil !== 'admin') {
        return res.redirect('/erro');
    }
    next();
}

// Aplica requireLogin a todas as rotas deste router
router.use(requireLogin);

// Rotas acessíveis apenas por admin
router.get('/lista', requireAdmin, usuarioController.listarUsuarios);
router.get('/novo', requireAdmin, usuarioController.formNovoUsuario);
router.post('/novo', requireAdmin, upload.single('avatar'), usuarioController.cadastrarUsuario);
router.post('/excluir/:id', requireAdmin, usuarioController.excluirUsuario);

// Rotas edit/update — controller já valida admin ou próprio usuário
router.get('/editar/:id', usuarioController.formEditarUsuario);
router.post('/editar/:id', upload.single('avatar'), usuarioController.atualizarUsuario);

// Perfil do usuário (qualquer usuário logado)
router.get('/perfil', usuarioController.mostrarPerfil);
router.post('/perfil/upload', upload.single('avatar'), usuarioController.uploadAvatar);
router.post('/perfil/remover', usuarioController.removerAvatar);

module.exports = router;