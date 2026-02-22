import fs from 'fs'
import { runCommandWithBuilder } from '../utils/runCommandWithBuilder.js'

function configureLanguage(details) {
  const packageJsonPath = 'package.json';
  const packageJson= JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // configure enpoint app
  console.log("before: ", packageJson);

  packageJson.main = 'src/index.js';
  packageJson.type = 'module';
  packageJson.scripts = {
    dev: "nodemon --exec 'tsx src/index.js'",
    start: 'node dist/index.ts',
    // build: 'rm -rf dist && tsc',
    format: 'pettier --write .',
    lint: 'eslint "src/**/*.ts --fix'
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log("after: ", JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')))
  // packageJsonPath
  
}

export { configureLanguage };
