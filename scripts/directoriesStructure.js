import path from 'path';
import fs from "fs";

import { runCommandWithBuilder } from '../utils/runCommandWithBuilder.js';

async function directoriesStructure(details) {
  const commonFolders = [
    'config',
    '__test__',
    'common'
  ],
  arquitectureFolders = {
    'clean' : [ 'clen', 'arquitecture' ],
    'exagonal': [ 'exagonal', 'arquitecture' ],
    'capas': [ 'model', 'controller', 'route', 'schema', 'service' ]
  }

  if (details.language === 'typescript') {
    commonFolders.add('types');
    // folders.add('interfaces');
  }

  await runCommandWithBuilder(() => {
    const srcPath = 'src';
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath);
    }

    commonFolders.forEach((folder) => {
      const folderPath = path.join(srcPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
    });

    const arquitecture = arquitectureFolders[`${details.arquitecture}`]
    for (let i=0; i< arquitecture.lenght; i++) {
      const folderPath = path.join(srcPath, arquitecture[i]);
      if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(arquitecture[i])
      }
    }

    const extension = details.language === 'typescript' ? 'ts' : 'js';
    const appFilePath = path.join(srcPath, `app.${extension}`);
    const serverFilePath = path.join(srcPath, `server.${extension}`);

    //const serverContent =
    //  language === 'typescript'
    //    ? templateCodeServerTS()
    //    : templateCodeServerJS();
    //
    //const appContent =
    //  language === 'typescript'
    //    ? templateCodeMainAppTS()
    //    : templateCodeMainAppJS();
    //
    //if (!fs.existsSync(appFilePath && serverFilePath)) {
    //  fs.writeFileSync(serverFilePath, serverContent);
    //  fs.writeFileSync(appFilePath, appContent);
    //}
  });
}

export { directoriesStructure }
