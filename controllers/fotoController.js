// controllers/fotoController.js
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');

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
            const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
            cb(null, uniqueName);
        }
    });

    return multer({ storage });
}

// =============================
// Processar foto (redimensionar)
// =============================
async function processarFoto(file, pasta = 'alunos') {
    try {
        if (!file) return null;

        const uploadsDir = path.join(__dirname, '../public/uploads', pasta);
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const resizedFilename = `resized-${file.filename}`;
        const outputPath = path.normalize(path.join(uploadsDir, resizedFilename));

        // Redimensiona a imagem mantendo proporção e cobrindo 300x300
        await sharp(file.path)
            .resize(300, 300, { fit: 'cover' })
            .toFile(outputPath);

        // Remove arquivo original
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

        // Retorna caminho relativo para o front-end
        return `/uploads/${pasta}/${resizedFilename}`;
    } catch (err) {
        console.error('Erro ao processar foto:', err);
        return null;
    }
}

// =============================
// Remover foto do servidor
// =============================
function removerFoto(caminhoRelativo) {
    if (!caminhoRelativo) return;

    const fullPath = path.normalize(path.join(__dirname, '../public', caminhoRelativo));
    try {
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (err) {
        console.error('Erro ao remover foto:', err);
    }
}

module.exports = {
    uploadAlunos: criarUpload('alunos'),
    uploadUsuario: criarUpload('usuario'),
    processarFoto,
    removerFoto
};
