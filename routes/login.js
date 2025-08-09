const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

// Corrigido: especifique o método do controller, por exemplo 'index' ou 'login'
router.get('/', loginController.login);

module.exports = router;