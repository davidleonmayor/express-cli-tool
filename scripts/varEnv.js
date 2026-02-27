import fs from "fs"

import { dotEnvTemplate } from "../templates/env/index.js"

export function configureVarEnvironment(database, projecName) {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, dotEnvTemplate)
    
  }
  console.log("file exist");
}
