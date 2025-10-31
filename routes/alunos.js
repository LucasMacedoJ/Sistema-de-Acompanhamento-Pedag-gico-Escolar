const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosControllers');
const { uploadAlunos } = require('../controllers/fotoController'); // ✅ upload específico para alunos

// =============================
// 📋 FORMULÁRIOS
// =============================
router.get('/formulario', alunosController.formulario);
router.get('/editar/:id', alunosController.editarForm);

// =============================
// 🧾 CADASTRO E EDIÇÃO
// =============================
router.post('/cadastrar', uploadAlunos.single('foto'), alunosController.cadastrar);
router.post('/editar/:id', uploadAlunos.single('foto'), alunosController.editar);

// =============================
// 📋 LISTAGENS
// =============================
router.get('/', alunosController.lista);
router.get('/inativo', alunosController.inativo);

// =============================
// 🔍 BUSCAS
// =============================
router.get('/search', alunosController.search);
router.get('/searchInativos', alunosController.searchInativos);

// =============================
// 🔄 ATIVAÇÃO / DETALHES
// =============================
router.get('/toggle-ativo/:id', alunosController.toggleAtivo);
router.get('/detalhes/:id', alunosController.detalhes);

module.exports = router;
