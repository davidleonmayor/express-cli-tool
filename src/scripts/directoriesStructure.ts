import path from "path";
import fs from "fs";

import { runCommandWithBuilder } from "../utils/runCommandWithBuilder";

import serverTemplate from "../templates/server/server";
import indexTemplate from "../templates/server/index";
import type { ProjectDetails } from "../types/prompt";

const directoriesStructure = async (details: ProjectDetails): Promise<void> => {
  const folders = new Set(["configs", "__tests__"]);

  await runCommandWithBuilder(() => {
    // create src folder if do not exist and basic folders
    const srcPath = "src";
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath);
    }
    folders.forEach((folder) => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    });

    // create each forlder be arquitecure selected
    // commonFolders.forEach((folder) => {
    //   const folderPath = path.join(srcPath, folder);
    //   if (!fs.existsSync(folderPath)) {
    //     fs.mkdirSync(folderPath);
    //   }
    // });

    const indexFilePath = path.join(srcPath, "index.ts");
    const serverFilePath = path.join(srcPath, "server.ts");

    const serverContent = serverTemplate();
    const appContent = indexTemplate();

    if (!fs.existsSync(indexFilePath && serverFilePath)) {
      fs.writeFileSync(serverFilePath, serverContent);
      fs.writeFileSync(indexFilePath, appContent);
    }
  });
};

export { directoriesStructure };
