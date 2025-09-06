// controllers/errorController.js
exports.errorPage = (req, res) => {
  res.status(404).send('Página não encontrada');
};