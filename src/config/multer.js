import multer from 'multer'
import crypto from 'crypto'
import { resolve, extname } from 'path'

/**
 * Normalmente em uma aplicação em produção, os storages utilizados são algum
 * CDN como o Amazon S3 ou o Digital Ocean Spaces
 **/

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err)
        return cb(null, res.toString('hex') + '_' + new Date().getTime() + extname(file.originalname)) // Não é recomendável salvar também o nome do arquivo que o
      })                                                                  // usuário inseriu pois pode ter caracteres malucos de outros países, etc.
    }
  })
}
