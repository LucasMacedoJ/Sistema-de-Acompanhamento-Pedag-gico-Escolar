// controllers/fotoController.js
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');

// =============================
// 🧩 Função genérica de storage
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

    // 🔒 Filtro de tipos de arquivo permitidos
    const fileFilter = (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png|gif/;
        const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
        const mimetype = tiposPermitidos.test(file.mimetype);

        if (extname && mimetype) return cb(null, true);
        cb(new Error('Apenas imagens são permitidas (jpg, jpeg, png, gif).'));
    };

    return multer({ storage, fileFilter });
}

// =============================
// 🖼️ Processar foto (redimensionar)
// =============================
async function processarFoto(file, pasta = 'alunos', size = 300) {
    try {
        if (!file) return null;

        const uploadsDir = path.join(__dirname, '../public/uploads', pasta);
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const resizedFilename = `resized-${file.filename}`;
        const outputPath = path.normalize(path.join(uploadsDir, resizedFilename));

        // Redimensiona mantendo proporção (modo cover = corta o excesso)
        await sharp(file.path)
            .resize(size, size, { fit: 'cover' })
            .toFile(outputPath);

        // Remove o arquivo original após redimensionar
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

        // Retorna o caminho relativo compatível entre sistemas
        return `/uploads/${pasta}/${resizedFilename}`.replace(/\\/g, '/');
    } catch (err) {
        console.error('[fotoController] Erro ao processar foto:', err.message);
        return null;
    }
}

// =============================
// 🗑️ Remover foto do servidor
// =============================
function removerFoto(caminhoRelativo) {
    if (!caminhoRelativo) return;

    const fullPath = path.normalize(path.join(__dirname, '../public', caminhoRelativo));
    try {
        fs.accessSync(fullPath); // Verifica se o arquivo existe
        fs.unlinkSync(fullPath);
    } catch {
        console.warn(`[fotoController] Arquivo não encontrado ou já removido: ${caminhoRelativo}`);
    }
}

// =============================
// 📦 Exportação dos uploads e funções
// =============================
module.exports = {
    uploadAlunos: criarUpload('alunos'),
    uploadUsuario: criarUpload('usuario'),
    processarFoto,
    removerFoto
};
