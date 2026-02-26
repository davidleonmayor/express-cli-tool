import fs from "fs"
import chalk from "chalk"
import { select} from '@inquirer/prompts';
import ora from "ora";
import shell from "shelljs";

import { dependencies, devDependencies } from "../constants/jsonConfig.js"
import { runCommandWithBuilder } from "../utils/runCommandWithBuilder.js"
import { directoriesStructure } from "../scripts/directoriesStructure.js"
import templateCodePackageJSON from "../templates/config/packageJSON.js"

import { configureLanguage } from "../scripts/language.js"
import { configureExpressConfig } from "../scripts/express.js"

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const PROGRAMIN_LANGUAGE = 'TypeScript';

async function askProjectDetails() {
  try {
    const packageManager = await select({
        type: 'list',
        name: 'packageManager',
        message: 'Select package manager:',
        // choices: ['npm', 'pnpm', 'yarn'],
        choices: ['npm']
      })
    // TODO: add all features
    const arquitecture = await select({
        type: 'list',
        name: 'arquitecture',
        message: 'Choice an arquitecture',
        //choices: ['clean', 'exagonal', 'capas']
        choices: ['exagonal']
      })
    // const importAlias = await confirm({
    //   description: 'Would you use @/<module> alias?',
    //   //default: true
    // })
  
    // External
    // const database = await select({
    //   type: 'list',
    //   name: 'database',
    //   message: 'Choise a database',
    //   choices: ['MySQL', 'PostgreSQL']
    // })
    // const testing = await select({
    //   type: 'list',
    //   name: 'testing',
    //   message: 'Choise testing tool',
    //   choices: ['Jest', 'Mocha']
    // })
  
    //TODO: multi selector, for patherns
    // const desingPatherns = await

    console.log("Selection ends")
    return { packageManager, arquitecture }
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
  process.stdout.write("\n");
  const spinner = ora(`Installation in progress... ☕`).start();
  // spiner time
  // const spinner = ora(`Setting up project...`).start();
  // setTimeout(() => {
  //   spinner.succeed(chalk.green("Project setup complete! 🚀"));
  // }, 3000);
  //

  // project creation
  try {
    shell.mkdir(projectName);
    shell.cd(projectName);

    // TODO: general command
    // init package.json with
    //await runCommandWithBuilder(`${details.packageManager} init -y`)
    await runCommandWithBuilder('npm init -y')

    // basic package.json config
    const packageJsonPath = 'package.json';
    //console.log("JSON template:", templateCodePackageJSON()) // TODO: set template
    //shell.echo(templateCodePackageJSON()).to("package.json")
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    packageJson.description = `This is a ${projectName} project`;
    packageJson.language = PROGRAMIN_LANGUAGE;
    // packageJson.testing = details.testing; // TODO -> testing tools I use ->  jsut jest & superset
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // install dependencies
    // TODO: install with selected p. Manager
    await runCommandWithBuilder(`npm i -E ${dependencies.join(' ')}`)
    await runCommandWithBuilder(`npm i -E -D ${devDependencies.join(' ')}`)
    //await configureEnvironment(details.database, projectName, details.language);
    // -----------
    // add dependecies to package.json
    // 1. tomar .json, 2. pegar de las constantes
    
    // -----------


    //await configureGitIgnore();
    await configureLanguage(details); // TODO: config TS.
    //await configureDatabase(details.database, details.language);
    //await configureLogger(details.language);
    //await configureTesting(details.language, details.testing);
    //await configureMiddlewares(details.language);
    await configureExpressConfig(details);
    // setup prisma
    //await runCommandWithBuilder("npm i -E @prisma/client")

    // TODO: remove triling props "datails.languaje" etc. It must be more easy and global
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
