import fs from 'fs'
import { runCommandWithBuilder } from '../utils/runCommandWithBuilder.js'

/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
export async function configureLanguage(details) {
  const packageJsonPath = 'package.json';
  const packageJson= JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // configure enpoint app
  console.log("before: ", packageJson);

  packageJson.main = 'src/app.ts';
  packageJson.type = 'module';
  packageJson.scripts = {
    dev: "nodemon --exec 'tsx src/app.ts'",
    start: 'node dist/index.ts',
    build: 'rm -rf dist && tsc',
    format: 'pettier --write .',
    lint: 'eslint "src/**/*.ts --fix'
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
 
  // Setup ts config
  await runCommandWithBuilder('npm install --save-dev typescript @types/node');
  await runCommandWithBuilder('npx tsc --init');

  const tsConfigPath = 'tsconfig.json';
  let customTsConfig = {
    compilerOptions: {
        target: 'ESNext',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        allowImportingTsExtensions: true,
        noEmit: true,
        outDir: './dist',
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
      },
    include: ['src/**/*'],
  }

  // TODO: add alias depending of arquitecture
  // Setup global default alias @
  if (!details.useImportAlias) {
    customTsConfig.compilerOptions.baseUrl = './src';
    customTsConfig.compilerOptions.paths = {
      '@configs/*': ['./configs/*'],
      '@controllers/*': ['./controllers/*'],
      '@interfaces/*': ['./interfaces/*'],
      '@middlewares/*': ['./middlewares/*'],
      '@models/*': ['./models/*'],
      '@repositories/*': ['./repositories/*'],
      '@routes/*': ['./routes/*'],
      '@services/*': ['./services/*'],
      '@types/*': ['./types/*'],
      '@utils/*': ['./utils/*'],
      '@enums/*': ['./enums/*'],
    };
  }
  fs.writeFileSync(tsConfigPath, JSON.stringify(customTsConfig, null, 2));
  // console.log("after: ", JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')))
  // packageJsonPath
  
}

