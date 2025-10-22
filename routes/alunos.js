const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosControllers');
const { uploadAlunos } = require('../controllers/fotoController'); // ✅ upload específico para alunos

// Formulário de cadastro
router.get('/formulario', alunosController.formulario);

// Cadastro com upload de foto
router.post('/cadastrar', uploadAlunos.single('foto'), alunosController.cadastrar);

// Edição com upload
router.post('/:id/editar', uploadAlunos.single('foto'), alunosController.editar);

// Listagens
router.get('/', alunosController.lista);
router.get('/inativo', alunosController.inativo);
router.get('/editar/:id', alunosController.editarForm);
router.post('/editar/:id', alunosController.editar);
router.get('/toggle-ativo/:id', alunosController.toggleAtivo);
router.get('/search', alunosController.search);
router.get('/searchInativos', alunosController.searchInativos);
router.get('/detalhes/:id', alunosController.detalhes);

module.exports = router;
