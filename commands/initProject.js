import fs from "fs"
import chalk from "chalk"
import { select } from '@inquirer/prompts';
import ora from "ora";
import shell from "shelljs";

import { dependencies, devDependencies } from "../constants/jsonConfig.js"

import { runCommandWithBuilder } from "../utils/runCommandWithBuilder.js"

import { directoriesStructure } from "../scripts/directoriesStructure.js"

import templateCodePackageJSON from "../templates/config/packageJSON.js"

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

async function askProjectDetails() {
  try {
    const programingLenguage = await select(
      {
        type: 'list',
        name: 'language',
        message: 'Select language:',
        choices: ['javascript', 'typescript'],
      })
      const packageManager = await select(
      {
        type: 'list',
        name: 'packageManager',
        message: 'Select package manager:',
        choices: ['npm', 'pnpm', 'yarn'],
      })
    // TODO: add all features
    const arquitecture = await select(
      {
        type: 'list',
        name: 'arquitecture',
        message: 'Choice an arquitecture',
        choices: ['clean', 'exagonal', 'capas']
      })
    //TODO: multi selector, for patherns
    // const desingPatherns = await 

    return { programingLenguage, packageManager, arquitecture }
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
  // Project don't exist
  if (fs.existsSync(projectName)) {
    process.stdout.write(chalk.red('✖ ERROR : Project already exists') + `\n`);
    process.exit(1); 
  }
  
  // project initial config
  const details = await askProjectDetails()
  process.stdout.write("\n");
  // const spinner = ora(`Installation in progress... ☕`).start();
  // spiner time
  const spinner = ora(`Setting up project...`).start();
  setTimeout(() => {
    spinner.succeed(chalk.green("Project setup complete! 🚀"));
  }, 3000);

  // create project
  try {
    shell.mkdir(projectName);
    shell.cd(projectName);

    // TODO: general command
    // init package.json with
    //await runCommandWithBuilder(`${details.packageManager} init -y`)
  
    // basic config
    const packageJsonPath = 'package.json';
   //console.log("JSON template", templateCodePackageJSON()) TODO: set template
    //shell.echo(templateCodePackageJSON()).to("package.json")
    //const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    //packageJson.name = projectName;
    //packageJson.description = `This is a ${projectName} project`;
    //packageJson.language = details.language;
    // packageJson.testing = details.testing; //TODO: just jest & superset
    //fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    // isntall basic develop dependencies
    //runCommandWithBuilder(`${details.packageManager} `) // TODO: end the pack..
    //await runCommandWithBuilder(`npm i -E ${dependencies.join(' ')}`)
    //await runCommandWithBuilder(`npm i -E -D ${devDependencies.join(' ')}`)
    // setup prisma
    //await runCommandWithBuilder("npm i -E @prisma/client")

    // TODO: remove triling props "datails.languaje" etc. It must be more easy and global
    await directoriesStructure(details)
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }
}

export { projectConfig };
