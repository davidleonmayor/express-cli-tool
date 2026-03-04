import fs from "fs";
import path from "path";

// import templateCodeExpressConfigTS from '../templates/configs/express-config/index.js';
import serverTemplate from "../templates/server/server.js";
import indexTemplate from "../templates/server/index.js";

/*
 * Used to create express configuration
*/
export async function configureExpressConfig(details) {
  // check if exist or create
  //const configDir = path.resolve('src/configs');
  //if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  // fs.writeFileSync(
  //   path.join(configDir, 'express.config.ts'),
  //   templateCodeExpressConfigTS()
  // )
  
  // Check entry point exist
  const srcDir = "src";
  const indexPath = path.join(srcDir, "index.ts");
  const serverPath = path.join(srcDir, "server.ts");

  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexTemplate(), "utf8");
  }

  if (!fs.existsSync(serverPath)) {
    fs.writeFileSync(serverPath, serverTemplate(), "utf8");
  }
}
