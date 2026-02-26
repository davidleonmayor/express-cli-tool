import fs from "fs";
import path from "path"

import templateCodeExpressConfigTS from '../templates/configs/express-config/ts/index.js';

/*
 * Used to create express configuration
*/
export async function configureExpressConfig(details) {
  // check if exist or create
  const configDir = path.resolve('src/configs');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(
    path.join(configDir, 'express.config.ts'),
    templateCodeExpressConfigTS()
  )
}
