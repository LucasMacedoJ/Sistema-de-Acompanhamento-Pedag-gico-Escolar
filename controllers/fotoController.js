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
async function processarFoto(file, pasta = 'alunos') {
    try {
        if (!file) return null;

        const uploadsDir = path.join(__dirname, '../public/uploads', pasta);
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const resizedFilename = `resized-${file.filename}`;
        const outputPath = path.join(uploadsDir, resizedFilename).replace(/\\/g, '/');

        // Redimensiona a imagem
        await sharp(file.path)
            .resize(300, 300)
            .toFile(outputPath);

        // Remove o arquivo original
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

        // Retorna o caminho relativo para o uso no front-end
        return `/uploads/${pasta}/${resizedFilename}`;
    } catch (err) {
        console.error('Erro ao processar foto:', err);
        return null;
    }
}

// =============================
// Função para remover foto
// =============================
function removerFoto(caminhoRelativo) {
    if (!caminhoRelativo) return;
    const fullPath = path.join(__dirname, '../public', caminhoRelativo);
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
