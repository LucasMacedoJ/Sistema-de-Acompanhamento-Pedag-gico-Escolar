const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

router.get('/', loginController.loginForm);
router.post('/', loginController.login);

module.exports = router;