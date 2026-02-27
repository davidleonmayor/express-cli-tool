import path from 'path';
import fs from "fs";

import { runCommandWithBuilder } from '../utils/runCommandWithBuilder.js';

import templateCodeServerTS from '../templates/server/ts/index.js';
import templateCodeMainAppTS from '../templates/main-app/ts/indes.js';

const directoriesStructure = async (details) => {
  const folders = new Set([
    //'configs',
    '__tests__',
    //'common',
  ]);

  await runCommandWithBuilder(() => {
    // create src folder if do not exist and basic folders
    const srcPath = 'src';
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath);
    }
    folders.forEach((folder) => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    })

    // create each forlder be arquitecure selected
    // commonFolders.forEach((folder) => {
    //   const folderPath = path.join(srcPath, folder);
    //   if (!fs.existsSync(folderPath)) {
    //     fs.mkdirSync(folderPath);
    //   }
    // });

    const appFilePath = path.join(srcPath, `app.ts`);
    const serverFilePath = path.join(srcPath, `server.ts`);

    const serverContent = templateCodeServerTS();
    const appContent = templateCodeMainAppTS();

     if (!fs.existsSync(appFilePath && serverFilePath)) {
      fs.writeFileSync(serverFilePath, serverContent);
      fs.writeFileSync(appFilePath, appContent);
    }
  });
}

export { directoriesStructure }
