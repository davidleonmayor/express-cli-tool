#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { projectConfig } from "../commands/initProject.js";
console.log(chalk.yellow(figlet.textSync("Express CLI", { horizontalLayout: "full" })));
const program = new Command();
program.version("1.0.0");
// init project config
program
    .command("new <project-name>")
    .description("Create a new Express project")
    .action(projectConfig);
program.parse(process.argv);
//# sourceMappingURL=index.js.map