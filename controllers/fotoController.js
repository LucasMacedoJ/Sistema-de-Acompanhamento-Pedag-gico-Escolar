// controllers/fotoController.js

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');


// =======================================================================
// 🔧 FUNÇÃO GENÉRICA PARA CRIAR UPLOAD COM MULTER
// =======================================================================
function criarUpload(pasta) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, '../public/uploads', pasta);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
            cb(null, uniqueName);
        }
    });

    // ✅ Filtro de tipos permitidos
    const fileFilter = (req, file, cb) => {
        const tiposPermitidos = /\.(jpeg|jpg|png|gif)$/i;

        const extOk = tiposPermitidos.test(file.originalname);
        const mimeOk = tiposPermitidos.test(file.mimetype);

        if (extOk && mimeOk) return cb(null, true);
        return cb(new Error('Apenas imagens são permitidas (jpg, jpeg, png, gif).'));
    };

    return multer({ storage, fileFilter });
}


// =======================================================================
// 🖼️ PROCESSAR FOTO (REDIMENSIONAR E OTIMIZAR)
// =======================================================================
async function processarFoto(file, pasta = 'alunos', size = 300) {
    try {
        if (!file) return null;

        const uploadsDir = path.join(__dirname, '../public/uploads', pasta);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const resizedFilename = `resized-${file.filename}`;
        const outputPath = path.normalize(path.join(uploadsDir, resizedFilename));

        await sharp(file.path)
            .resize(size, size, { fit: 'cover' })
            .toFile(outputPath);

        // ✅ Remove arquivo original
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // ✅ Retorna caminho relativo (padrão Web)
        return `/uploads/${pasta}/${resizedFilename}`.replace(/\\/g, '/');

    } catch (err) {
        console.error('[fotoController] Erro ao processar foto:', err.message);
        return null;
    }
}


// =======================================================================
// 🗑️ REMOVER FOTO DO SERVIDOR
// =======================================================================
function removerFoto(caminhoRelativo) {
    if (!caminhoRelativo) return;

    const fullPath = path.normalize(path.join(__dirname, '../public', caminhoRelativo));

    try {
        fs.accessSync(fullPath);
        fs.unlinkSync(fullPath);
    } catch {
        console.warn(`[fotoController] Arquivo não encontrado ou já removido: ${caminhoRelativo}`);
    }
}


// =======================================================================
// 📦 EXPORTAÇÃO
// =======================================================================
module.exports = {
    uploadAlunos: criarUpload('alunos'),
    uploadUsuario: criarUpload('usuario'),
    processarFoto,
    removerFoto
};
