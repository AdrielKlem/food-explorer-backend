const fs = require("fs")
const path = require("path")
const uploadConfig = require("../configs/upload")

class DiskStorage {
    async saveFile(file) {
        const sourcePath = path.resolve(uploadConfig.TMP_FOLDER, file);
        const targetPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            await fs.promises.access(sourcePath);
        } catch (error) {
            // O arquivo não existe, você pode lidar com isso aqui
            console.error(`Arquivo não encontrado: ${sourcePath}`);
            return null; // Retorna null ou lança um erro, dependendo da sua lógica
        }

        await fs.promises.rename(sourcePath, targetPath);

        return file;
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

        try {
            await fs.promises.stat(filePath)
        } catch {
            return
        }
        await fs.promises.unlink(filePath)
    }
}

module.exports = DiskStorage