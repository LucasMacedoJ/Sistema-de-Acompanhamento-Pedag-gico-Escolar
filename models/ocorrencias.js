const mongoose = require('mongoose');   

const OcorrenciaSchema = new mongoose.Schema({
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Aluno', required: true }, // chave estrangeira
    descricao: { type: String, required: true },
    data: { type: Date, required: true }
});
module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema);