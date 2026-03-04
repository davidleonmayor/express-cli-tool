import fs from "fs"

import { dotEnvTemplate } from "../templates/configs/env/index.js"
import loaderTemplate from "../templates/configs/env/loader-template.js"

export function configureVarEnvironment(database, projecName) {
  // if .env don't exist create and write env vars
  const envPath = '.env';
  if (!fs.existsSync(envPath)) fs.writeFileSync(envPath, dotEnvTemplate)

  // load loader
  const loaderPath = 'src/configs/env.config.ts'
  //if (!fs.existsSync(loaderPath)) fs.writeFileSync(loaderPath, loaderTemplate());
}
