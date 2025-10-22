const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  perfil: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  foto: { type: String, default: null }
});

// Evita o OverwriteModelError
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
