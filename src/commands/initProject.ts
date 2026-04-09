import fs from "fs";
import chalk from "chalk";
import { select, confirm } from "@inquirer/prompts";
import ora from "ora";
import shell from "shelljs";

import { dependencies, devDependencies } from "../constants/jsonConfig";
import { runCommandWithBuilder } from "../utils/runCommandWithBuilder";
import { directoriesStructure } from "../scripts/directoriesStructure";
import templateCodePackageJSON from "../templates/configs/packageJSON";

import { configureLanguage } from "../scripts/language";
import { configureExpressConfig } from "../scripts/express";
import { configureTesting } from "../scripts/test";
import { configureVarEnvironment } from "../scripts/varEnv";
import { configureLogger } from '../scripts/logger'

import type {
  Architecture,
  Database,
  ProjectDetails,
  Testing,
} from "../types/prompt";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
);

const PROGRAMIN_LANGUAGE = "TypeScript";

async function askProjectDetails(): Promise<ProjectDetails> {
  console.log("init input config");
  try {
    // TODO: add all features
    const arquitecture = (await select({
      message: "Choice an arquitecture",
      //choices: ['clean', 'exagonal', 'capas']
      choices: ["exagonal"],
    })) as Architecture;
    const importAlias = await confirm({
      message: "Would you use @/<module> alias?",
      default: true,
    });

    const database = (await select({
      message: "Choise a database",
      choices: ["MySQL", "PostgreSQL"],
    })) as Database;
    const testing = (await select({
      message: "Choise testing tool",
      //choices: ['Jest & supertest', 'Mocha']
      choices: ["Jest", "Mocha"],
    })) as Testing;


    // External
    const useDocker = await confirm({
      message: "Would you use Docker?",
      default: true
    })

    //TODO: multi selector, for patherns
    // const desingPatherns = await

    console.log("Selection ends");
    return { arquitecture, importAlias, testing, database, useDocker };
  } catch (error) {
    const promptError = error as { isTtyError?: boolean };
    if (promptError?.isTtyError) {
      process.stdout.write("Prompt cannot be displayed on this terminal.");
    } else {
      process.stdout.write("\nProgram is stopped by user\n");
      console.log(error);
    }
    process.exit(0);
  }
}

async function projectConfig(projectName: string): Promise<void> {
  console.log("init config project");
  // Project folder already exists
  if (fs.existsSync(projectName)) {
    process.stdout.write(chalk.red("✖ ERROR : Project already exists") + `\n`);
    process.exit(1);
  }

  // initial config project
  const details = await askProjectDetails();
  const spinner = ora(`\nInstallation in progress... ☕`).start();

  // project creation
  try {
    shell.mkdir(projectName);
    shell.cd(projectName);

    await runCommandWithBuilder("npm init -y");

    // basic package.json config
    const packageJsonPath = "package.json";
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = projectName;
    packageJson.description = `This is a ${projectName} project`;
    packageJson.language = PROGRAMIN_LANGUAGE;
    packageJson.testing = details.testing;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // install dependencies
    await runCommandWithBuilder(`npm i -E ${dependencies.join(" ")}`);
    await runCommandWithBuilder(`npm i -E -D ${devDependencies.join(" ")}`);
    // enviroment
    await directoriesStructure(details);
    await configureVarEnvironment(details, projectName);

    //await configureGitIgnore();
    await configureLanguage(details);
    await configureLogger();
    //await configureDatabase(details.database, details.language);
    //await configureTesting(details.testing);
    //await configureMiddlewares(details.language);
    await configureExpressConfig(details);

    // setup prismaORM
    //await runCommandWithBuilder("npm i -E @prisma/client")

    spinner.succeed(chalk.green(`Project ${projectName} have been created 🎉 `));
    console.log(`\n  \nNext steps\n\n  cd ${projectName}\n  npm i\n    `);
  } catch (error) {
    spinner.fail(`Failed to create project: \n ${error}`);
    console.log(chalk.red(String(error)));
    process.exit(1);
  }
}

export { projectConfig };
