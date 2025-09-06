const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(403).render('erro', { 
    mensagem: 'Acesso negado!',
    logado: !!req.session.usuario // true se usuário existe
  });
});


module.exports = router;
