const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turmasController');

// 📝 Formulário para cadastrar nova turma
router.get('/formulario', turmasController.formularioTurma);

// ➕ Cadastrar nova turma
router.post('/cadastrar', turmasController.cadastrar);

// 📋 Listar todas as turmas
router.get('/lista', turmasController.lista);

// 🔍 Detalhes de uma turma (mostra alunos vinculados)
router.get('/detalhes/:id', turmasController.detalhesTurma);

// ✏️ Formulário para editar turma
router.get('/:id/editar', turmasController.editarFormulario);

// 💾 Atualizar turma (envio do formulário de edição)
router.post('/:id/editar', turmasController.editar);

// ❌ Deletar turma
router.post('/:id/deletar', turmasController.deletar);

module.exports = router;
