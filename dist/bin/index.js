#!/usr/bin/env node

// src/bin/index.ts
import { Command } from "commander";
import chalk2 from "chalk";
import figlet from "figlet";

// src/commands/initProject.ts
import fs6 from "fs";
import chalk from "chalk";
import { select, confirm } from "@inquirer/prompts";
import ora from "ora";
import shell from "shelljs";

// src/constants/jsonConfig.ts
var dependencies = [
  "express",
  "dotenv",
  "cors",
  "cookie-parser",
  "helmet",
  "morgan",
  "express-rate-limit",
  "zod",
  "compression",
  "bcryptjs",
  "http-errors"
];
var devDependencies = [
  "nodemon",
  "typescript",
  "@types/node",
  "tsx",
  "zod",
  "winston"
];

// src/utils/runCommandWithBuilder.ts
import { spawn } from "child_process";
var runCommandWithBuilder = (command) => new Promise((resolve, reject) => {
  if (typeof command === "string") {
    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args, { shell: true, stdio: "pipe" });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Command "${command}" failed with exit code ${code}`)
        );
      }
    });
    child.on("error", reject);
  } else if (typeof command === "function") {
    try {
      const result = command();
      if (result instanceof Promise) {
        result.then(() => resolve()).catch(reject);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  } else {
    reject(
      new Error(
        `Invalid command type: expected string or function, but got ${typeof command}`
      )
    );
  }
});

// src/scripts/directoriesStructure.ts
import path from "path";
import fs from "fs";

// src/templates/server/server.ts
var serverTemplate = () => {
  return `
import path from 'path';

import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';

import {
  envs,
  logger
} from '../configs';


//import {
//  compressionMiddleware,
//   corsMiddleware,
//   errorMiddleware,
//   limiterMiddleware,
//   morganMiddleware,
// } from '../middlewares/index.ts';


export default class Server {
  private app: Application;

  public constructor() {
    this.app = express();

    //app.use(compressionMiddleware);
    //app.use(morganMiddleware);
    this.app.use(helmet());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //app.use(corsMiddleware);
    //app.use(cookieParser());
    //app.use(limiterMiddleware);

    //add your routes in here!!
    //app.use(errorMiddleware);
    
    // Routers
    this.app.get('/test', (req, res) => {
      logger.info('request to /test')
      res.send('OK'))
    }
  }

  public start() {
    this.app.listen(envs.PORT, () => {
      logger.info('\u{1F680} Servidor ejecut\xE1ndose en puerto ' + envs.PORT);
      logger.info('\u{1F30D} Entorno: ' + envs.NODE_ENV);
      logger.info(
        '\u{1F4CA} Logs guard\xE1ndose en: ' + path.join(process.cwd(), "logs")
      );
    });
  }
};
`;
};
var server_default = serverTemplate;

// src/templates/server/index.ts
var indexTemplate = () => {
  return `import Server from "./server";

const server = new Server();

server.start();
`;
};
var server_default2 = indexTemplate;

// src/scripts/directoriesStructure.ts
var directoriesStructure = async (details) => {
  const folders = /* @__PURE__ */ new Set(["configs", "__tests__"]);
  await runCommandWithBuilder(() => {
    const srcPath = "src";
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath);
    }
    folders.forEach((folder) => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    });
    const indexFilePath = path.join(srcPath, "index.ts");
    const serverFilePath = path.join(srcPath, "server.ts");
    const serverContent = server_default();
    const appContent = server_default2();
    if (!fs.existsSync(indexFilePath && serverFilePath)) {
      fs.writeFileSync(serverFilePath, serverContent);
      fs.writeFileSync(indexFilePath, appContent);
    }
  });
};

// src/scripts/language.ts
import fs2 from "fs";
async function configureLanguage(details) {
  console.log(`details: ${details}`);
  const packageJsonPath = "package.json";
  const packageJson2 = JSON.parse(fs2.readFileSync(packageJsonPath, "utf8"));
  console.log("before: ", packageJson2);
  packageJson2.main = "src/index.ts";
  packageJson2.type = "module";
  packageJson2.scripts = {
    dev: "nodemon --exec 'tsx src/index.ts'",
    start: "node dist/index.js",
    build: "rm -rf dist && tsc",
    format: "prettier --write .",
    lint: 'eslint "src/**/*.ts" --fix'
  };
  fs2.writeFileSync(packageJsonPath, JSON.stringify(packageJson2, null, 2));
  await runCommandWithBuilder("npm install --save-dev typescript @types/node");
  await runCommandWithBuilder("npx tsc --init");
  const tsConfigPath = "tsconfig.json";
  const customTsConfig = {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      rootDir: "./src",
      outDir: "./dist",
      allowImportingTsExtensions: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      strict: true,
      noEmitOnError: true,
      declaration: true,
      sourceMap: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true
    },
    include: ["src/**/*"]
  };
  if (details.importAlias) {
    customTsConfig.compilerOptions.baseUrl = "./src";
    customTsConfig.compilerOptions.paths = {
      "@configs/*": ["./configs/*"],
      "@controllers/*": ["./controllers/*"],
      "@interfaces/*": ["./interfaces/*"],
      "@middlewares/*": ["./middlewares/*"],
      "@models/*": ["./models/*"],
      "@repositories/*": ["./repositories/*"],
      "@routes/*": ["./routes/*"],
      "@services/*": ["./services/*"],
      "@types/*": ["./types/*"],
      "@utils/*": ["./utils/*"],
      "@enums/*": ["./enums/*"]
    };
  }
  fs2.writeFileSync(tsConfigPath, JSON.stringify(customTsConfig, null, 2));
}

// src/scripts/express.ts
import fs3 from "fs";
import path2 from "path";
async function configureExpressConfig(details) {
  const srcDir = "src";
  const indexPath = path2.join(srcDir, "index.ts");
  const serverPath = path2.join(srcDir, "server.ts");
  if (!fs3.existsSync(indexPath)) {
    fs3.writeFileSync(indexPath, server_default2(), "utf8");
  }
  if (!fs3.existsSync(serverPath)) {
    fs3.writeFileSync(serverPath, server_default(), "utf8");
  }
}

// src/scripts/varEnv.ts
import fs4 from "fs";

// src/templates/configs/env/loader-template.ts
var loader = `import { z } from "zod";
import "dotenv/config";
import { logger } from "./index";

const envSchema = z.object({
    // Aplication
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.string().regex(/^\\d+$/).transform(Number).default(4000),
    // Database
    DATABASE_URL: z.string(),
    // Auth
    //JWT_SECRET: z.string().min(10, "JWT_SECRET Must be at least 10 characters"),
    // Origin
    //FRONTEND_URL: z.string(),
    // Nodemiler
    //NODEMAILER_HOST: z.string(),
    //NODEMAILER_PORT: z.string().transform(Number),
    //NODEMAILER_USER: z.string(),
    //NODEMAILER_PASS: z.string(),
    // Brevo (reemplaza nodemailer)
    //BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
    //BREVO_SENDER_EMAIL: z.string().email(),
    //BREVO_SENDER_NAME: z.string().default("MoneyUp"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('[Env] error: \\n', parsedEnv.error);
    throw new Error('[Env] error: \\n', parsedEnv.error);
}

console.log("[env] success loaded");

export const envs = parsedEnv.data;
`;
var loader_template_default = loader;

// src/templates/configs/env/index.ts
var dotEnvTemplate = `DATABASE_URL=""
NODE_ENV="development"
PORT=4000
`;

// src/templates/configs/barrel.ts
var barrelTemplate = `export * from './envs.config.ts';
export * from './logger.config.ts';
`;

// src/scripts/varEnv.ts
async function configureVarEnvironment(details, projectName) {
  const envPath = ".env";
  if (!fs4.existsSync(envPath)) fs4.writeFileSync(envPath, dotEnvTemplate);
  const loaderPath = "configs/envs.config.ts";
  fs4.writeFileSync(loaderPath, loader_template_default);
  const barrelPath = "configs/index.ts";
  if (!fs4.existsSync(barrelPath)) fs4.writeFileSync(barrelPath, barrelTemplate);
}

// src/scripts/logger.ts
import fs5 from "fs";

// src/templates/configs/logger/config.ts
var loggerTemplate = `
import winston from "winston";
import path from "path";
import { envs } from "./envs.config";


// Definir niveles de log personalizados
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Definir colores para cada nivel
const logColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

// Agregar colores a winston
winston.addColors(logColors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => '' + info.timestamp + ' ' + info.level + ': ' + info.message
    ),
);

// Crear directorio de logs si no existe
const logDir = path.join(process.cwd(), "logs");

// Configuraci\xF3n de transports
const transports = [
    // Console transport
    new winston.transports.Console({
        format: logFormat,
    }),

    // File transport para errores
    new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
    }),

    // File transport para todos los logs
    new winston.transports.File({
        filename: path.join(logDir, "combined.log"),
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
    }),
];

// Crear logger
const logger = winston.createLogger({
    level: envs.NODE_ENV === "development" ? "debug" : "warn",
    levels: logLevels,
    format: logFormat,
    transports,
    exitOnError: false,
});

export { logger };
`;

// src/templates/middlewares/errorHandlerTemplate.ts
var errorHandlerTemplate = `import type { Request, Response, NextFunction } from 'express'
import { logger } from '../configs'

/**
 * Middleware para manejar rutas no encontradas (404)
 */
export function notFound(req: Request, res: Response, next: NextFunction) {
  logger.warn('Route not found: ' + req.method + ' ' + req.originalUrl');

  res.status(404).json({
    succes: false,
    error: 'Route not found',
    message:  'The route ' + req.method + ' ' + req.originalUrl + ' ' + 'no exist',
    path: req.originalUrl
  })
}

/**
 * Middleware global de manejo de errores
 * DEBE ir al final de todas las rutas
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // No multi request
  if (req.handersSend) return next(err);

  logger.error('Error en ' + req.method + ' ' + req.path:', {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  })
  
  // Errores de Prisma
  // if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //   return handlePrismaError(err, res);
  // }
  //
  // if (err instanceof Prisma.PrismaClientValidationError) {
  //   return res.status(400).json({
  //     success: false,
  //     error: "Error de validaci\xF3n",
  //     message: "Los datos proporcionados no son v\xE1lidos",
  //   });
  // }

  // Errores de validaci\xF3n de express-validator
  if (err.array && typeof err.array === "function") {
    return res.status(400).json({
      success: false,
      error: "Error de validaci\xF3n",
      errors: err.array(),
    });
  }

  // Errores de JWT
  // if (err.name === "JsonWebTokenError") {
  //   return res.status(401).json({
  //     success: false,
  //     error: "Token inv\xE1lido",
  //     message: "El token de autenticaci\xF3n no es v\xE1lido",
  //   });
  // }
  //
  // if (err.name === "TokenExpiredError") {
  //   return res.status(401).json({
  //     success: false,
  //     error: "Token expirado",
  //     message: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente",
  //   });
  // }

  // Errores de sintaxis JSON
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "JSON inv\xE1lido",
      message: "El cuerpo de la petici\xF3n contiene JSON mal formado",
    });
  }

  // Error gen\xE9rico
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    error: err.name || "Error del servidor",
    message: err.message || "Ha ocurrido un error inesperado",
    ...(!isProduction && err.stack && { stack: err.stack }),
  });
}

/**
 * Maneja errores espec\xEDficos de Prisma
 */
function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) {
  switch (err.code) {
    case "P2002":
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.[0] || "campo";
      return res.status(409).json({
        success: false,
        error: "Conflicto de duplicado",
        message: 'El ' + field + ' ya est\xE1 en uso',
      });

    case "P2025":
      // Record not found
      return res.status(404).json({
        success: false,
        error: "No encontrado",
        message: "El registro solicitado no existe",
      });

    case "P2003":
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        error: "Error de relaci\xF3n",
        message: "La operaci\xF3n viola una restricci\xF3n de integridad",
      });

    case "P2014":
      // Required relation missing
      return res.status(400).json({
        success: false,
        error: "Relaci\xF3n requerida",
        message: "Falta una relaci\xF3n requerida en los datos",
      });

    default:
      logger.error('Unhandled Prisma error code: ' + err.code);
      return res.status(500).json({
        success: false,
        error: "Error de base de datos",
        message: "Ha ocurrido un error al procesar la solicitud",
      });
  }
}
`;

// src/scripts/logger.ts
function configureLogger() {
  fs5.mkdirSync("configs", { recursive: true });
  fs5.mkdirSync("configs/middleware", { recursive: true });
  const path3 = "configs/logger.config.ts";
  if (!fs5.existsSync(path3)) {
    fs5.writeFileSync(path3, loggerTemplate);
  }
  const pathErrorHaldler = "configs/middleware/errorHandler.ts";
  if (!fs5.existsSync(pathErrorHaldler)) fs5.writeFileSync(pathErrorHaldler, errorHandlerTemplate);
}

// src/commands/initProject.ts
var packageJson = JSON.parse(
  fs6.readFileSync(new URL("../../package.json", import.meta.url), "utf8")
);
var PROGRAMIN_LANGUAGE = "TypeScript";
async function askProjectDetails() {
  console.log("init input config");
  try {
    const arquitecture = await select({
      message: "Choice an arquitecture",
      //choices: ['clean', 'exagonal', 'capas']
      choices: ["exagonal"]
    });
    const importAlias = await confirm({
      message: "Would you use @/<module> alias?",
      default: true
    });
    const database = await select({
      message: "Choise a database",
      choices: ["MySQL", "PostgreSQL"]
    });
    const testing = await select({
      message: "Choise testing tool",
      //choices: ['Jest & supertest', 'Mocha']
      choices: ["Jest", "Mocha"]
    });
    const useDocker = await confirm({
      message: "Would you use Docker?",
      default: true
    });
    console.log("Selection ends");
    return { arquitecture, importAlias, testing, database, useDocker };
  } catch (error) {
    const promptError = error;
    if (promptError?.isTtyError) {
      process.stdout.write("Prompt cannot be displayed on this terminal.");
    } else {
      process.stdout.write("\nProgram is stopped by user\n");
      console.log(error);
    }
    process.exit(0);
  }
}
async function projectConfig(projectName) {
  console.log("init config project");
  if (fs6.existsSync(projectName)) {
    process.stdout.write(chalk.red("\u2716 ERROR : Project already exists") + `
`);
    process.exit(1);
  }
  const details = await askProjectDetails();
  const spinner = ora(`
Installation in progress... \u2615`).start();
  try {
    shell.mkdir(projectName);
    shell.cd(projectName);
    await runCommandWithBuilder("npm init -y");
    const packageJsonPath = "package.json";
    const packageJson2 = JSON.parse(fs6.readFileSync(packageJsonPath, "utf8"));
    packageJson2.name = projectName;
    packageJson2.description = `This is a ${projectName} project`;
    packageJson2.language = PROGRAMIN_LANGUAGE;
    packageJson2.testing = details.testing;
    fs6.writeFileSync(packageJsonPath, JSON.stringify(packageJson2, null, 2));
    await runCommandWithBuilder(`npm i -E ${dependencies.join(" ")}`);
    await runCommandWithBuilder(`npm i -E -D ${devDependencies.join(" ")}`);
    await directoriesStructure(details);
    await configureVarEnvironment(details, projectName);
    await configureLanguage(details);
    await configureLogger();
    await configureExpressConfig(details);
    spinner.succeed(chalk.green(`Project ${projectName} have been created \u{1F389} `));
    console.log(`
  
Next steps

  cd ${projectName}
  npm i
    `);
  } catch (error) {
    spinner.fail(`Failed to create project: 
 ${error}`);
    console.log(chalk.red(String(error)));
    process.exit(1);
  }
}

// src/bin/index.ts
console.log(
  chalk2.yellow(figlet.textSync("Express CLI", { horizontalLayout: "full" }))
);
var program = new Command();
program.version("1.0.0");
program.command("new <project-name>").description("Create a new Express project").action(projectConfig);
program.parse(process.argv);
//# sourceMappingURL=index.js.map