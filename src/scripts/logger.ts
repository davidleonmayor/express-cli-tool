import fs from 'fs'

import { loggerTemplate } from '../templates/configs/logger/config'
import { errorHandlerTemplate } from '../templates/middlewares/'

export function configureLogger() {
  // create folders
  fs.mkdirSync('configs', {recursive: true })
  fs.mkdirSync('configs/middleware', {recursive: true })

  // check if folder existe
  const path = 'configs/logger.config.ts'
  if (!fs.existsSync(path)) {
     fs.writeFileSync(path, loggerTemplate)
  }

  const pathErrorHaldler = 'configs/middleware/errorHandler.ts'
  if (!fs.existsSync(pathErrorHaldler)) fs.writeFileSync(pathErrorHaldler, errorHandlerTemplate)
}


