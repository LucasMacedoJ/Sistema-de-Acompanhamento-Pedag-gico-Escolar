const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');

// =============================
// Função genérica de storage
// =============================
function criarUpload(pasta) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, '../public/uploads', pasta);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${file.fieldname}${ext}`);
        }
    });
    return multer({ storage });
}

// =============================
// Função helper para processar foto
// =============================
async function processarFoto(file, pasta) {
    if (!file) return null;

    const outputPath = path.join(pasta, `resized-${file.filename}`).replace(/\\/g, '/');

    await sharp(file.path)
        .resize(300, 300)
        .toFile(path.join(__dirname, '../public/uploads', pasta, `resized-${file.filename}`));

    fs.unlinkSync(file.path); // remove o original
    return outputPath;
}

// =============================
// Função para remover foto
// =============================
function removerFoto(caminhoRelativo) {
    if (!caminhoRelativo) return;
    const fullPath = path.join(__dirname, '../public/uploads', caminhoRelativo);
    try {
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (err) {
        console.error('Erro ao remover foto:', err);
    }
}

module.exports = {
    uploadAlunos: criarUpload('alunos'),
    uploadUsuarios: criarUpload('usuarios'),
    processarFoto,
    removerFoto
};
