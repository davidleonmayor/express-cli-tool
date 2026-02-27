import fs from "fs"
import chalk from "chalk"
import { select, confirm } from '@inquirer/prompts';
import ora from "ora";
import shell from "shelljs";

import { dependencies, devDependencies } from "../constants/jsonConfig.js"
import { runCommandWithBuilder } from "../utils/runCommandWithBuilder.js"
import { directoriesStructure } from "../scripts/directoriesStructure.js"
import templateCodePackageJSON from "../templates/config/packageJSON.js"

import { configureLanguage } from "../scripts/language.js"
import { configureExpressConfig } from "../scripts/express.js"
import { configureTesting } from "../scripts/test.js"
import { configureVarEnvironment } from "../scripts/varEnv.js" 

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const PROGRAMIN_LANGUAGE = 'TypeScript';

async function askProjectDetails() {
  console.log("init input config")
  try {
    // TODO: add all features
    const arquitecture = await select({
        type: 'list',
        name: 'arquitecture',
        message: 'Choice an arquitecture',
        //choices: ['clean', 'exagonal', 'capas']
        choices: ['exagonal']
      })
    const importAlias = await confirm({
      message: 'Would you use @/<module> alias?',
      default: true
    })
  
    // External
    // const useDocker = await confirm({
    //   message: "Would you use Docker?",
    //   default: true
    // })
    const database = await select({
      type: 'list',
      name: 'database',
      message: 'Choise a database',
      choices: ['MySQL', 'PostgreSQL']
    })
    const testing = await select({
      type: 'list',
      name: 'testing',
      message: 'Choise testing tool',
      //choices: ['Jest & supertest', 'Mocha']
      choices: ['Jest', 'Mocha']
    })
  
    //TODO: multi selector, for patherns
    // const desingPatherns = await

    console.log("Selection ends")
    return { packageManager, arquitecture, importAlias, testing, database };
  } catch (error) {
    if (error.isTtyError) {
      process.stdout.write('Prompt cannot be displayed on this terminal.');
    } else {
      process.stdout.write('\nProgram is stopped by user\n');
      console.log(error)
    }
    process.exit(0);
  }
}

async function projectConfig(projectName) {
  console.log("init config project")
  // Project folder already exists
  if (fs.existsSync(projectName)) {
    process.stdout.write(chalk.red('✖ ERROR : Project already exists') + `\n`);
    process.exit(1); 
  }

  // initial config project
  const details = await askProjectDetails()
  //process.stdout.write("\n");
  const spinner = ora(`\nInstallation in progress... ☕`).start();

  // project creation
  try {
    shell.mkdir(projectName);
    shell.cd(projectName);

    await runCommandWithBuilder('npm init -y')

    // basic package.json config
    const packageJsonPath = 'package.json';
    //console.log("JSON template:", templateCodePackageJSON())
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    packageJson.description = `This is a ${projectName} project`;
    packageJson.language = PROGRAMIN_LANGUAGE;
    packageJson.testing = details.testing;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // install dependencies
    //await runCommandWithBuilder(`npm i -E ${dependencies.join(' ')}`)
    //await runCommandWithBuilder(`npm i -E -D ${devDependencies.join(' ')}`)
    await configureVarEnvironment(details.database, projectName);

    //await configureGitIgnore();
    await configureLanguage(details);
    //await configureDatabase(details.database, details.language);
    //await configureLogger(details.language);
    //await configureTesting(details.testing);
    //await configureMiddlewares(details.language);
    await configureExpressConfig(details);

    // setup prismaORM
    //await runCommandWithBuilder("npm i -E @prisma/client")

    await directoriesStructure(details);
    
    spinner.succeed(chalk.green(`Project ${projectName} have been created 🎉 `));
    console.log(`
  \nNext steps\n
  cd ${projectName}
  npm i
    `);
  } catch (error) {
    spinner.fail(`Failed to create project: \n ${error}`);
    console.log(chalk.red(error));
    process.exit(1);
  }
}

export { projectConfig };
