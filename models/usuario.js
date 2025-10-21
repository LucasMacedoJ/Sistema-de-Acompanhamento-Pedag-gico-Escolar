const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  perfil: String,
  avatar: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

UsuarioSchema.methods.setSenha = async function (plain) {
  const hash = await bcrypt.hash(plain, 10);
  this.senha = hash;
};

// evita re-declarar o modelo se já foi compilado (corrige OverwriteModelError)
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;