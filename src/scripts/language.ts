import fs from "fs";
import { runCommandWithBuilder } from "../utils/runCommandWithBuilder.js";
import type { ProjectDetails } from "../types/prompt.js";

/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
export async function configureLanguage(
  details: ProjectDetails,
): Promise<void> {
  console.log(`details: ${details}`);
  const packageJsonPath = "package.json";
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // configure enpoint app
  console.log("before: ", packageJson);

  packageJson.main = "src/index.ts";
  packageJson.type = "module";
  packageJson.scripts = {
    dev: "nodemon --exec 'tsx src/index.ts'",
    start: "node dist/index.js",
    build: "rm -rf dist && tsc",
    format: "prettier --write .",
    lint: "eslint \"src/**/*.ts\" --fix",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Setup ts config
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
      skipLibCheck: true,
    },
    include: ["src/**/*"],
  } as Record<string, unknown>;

  // TODO: add alias depending of arquitecture
  // Setup global default alias @
  if (details.importAlias) {
    (customTsConfig.compilerOptions as Record<string, unknown>).baseUrl =
      "./src";
    (customTsConfig.compilerOptions as Record<string, unknown>).paths = {
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
      "@enums/*": ["./enums/*"],
    };
  }
  fs.writeFileSync(tsConfigPath, JSON.stringify(customTsConfig, null, 2));
  // console.log("after: ", JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')))
  // packageJsonPath
}
