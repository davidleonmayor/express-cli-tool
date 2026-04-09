import fs from "fs";
import shell from "shelljs";

import { templateSumTest } from "../templates/test/index";
import type { Testing } from "../types/prompt";

type TestingConfig = {
  scripts: Record<string, string>;
  dependencies: string[];
  jest?: Record<string, unknown>;
};

const techs: Record<Testing, TestingConfig> = {
  Jest: {
    scripts: {
      test: "jest --detectOpenHandles --forceExit",
      "test:cov": "jest --detectOpenHandles --coverage --forceExit",
    },
    jest: {
      transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
      },
    },
    dependencies: [
      "jest",
      "@types/jest",
      "babel-jest",
      "@babel/preset-env",
      "supertest",
      "@types/supertest",
      "@babel/preset-typescript",
      "@jest/globals",
    ],
  },

  Mocha: {
    scripts: {
      test: "mocha --import=tsx test/*.test.ts --exit",
      "test:cov": "nyc mocha --import=tsx test/*.test.ts --exit",
    },
    dependencies: [
      "mocha",
      "chai",
      "chai-http",
      "@babel/core",
      "@babel/preset-env",
      "@babel/preset-typescript",
      "@babel/register",
      "supertest",
      "@types/supertest",
      "@types/chai",
      "@types/chai-http",
      "@types/mocha",
      "nyc",
      "tsx",
    ],
  },
};

export function configureTesting(testing: Testing): void {
  console.log("starting config to :", testing);
  // 1 validar que exista la carpeta, y archivos de conf 2. si existen agregar contenido
  // config scripts and libreries depends of selectec techs
  const config = techs[testing];
  if (!config) return;

  const packageJsonPath = "package.json";
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.scripts = {
    ...packageJson.scripts,
    ...config.scripts,
  };
  if (config.jest) packageJson.jest = config.jest; // just if user select jest, past the config

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log("end testing");

  // install dependencies
  // runCommandWithBuilder(`npm i -E -D ${config.dependencies.join(" ")`);
  shell.exec(`npm install --save-dev ${config.dependencies.join(" ")}`, {
    silent: true,
  });
  // create babel config
  const presets = ["@babel/preset-env", "@babel/preset-typescript"];
  const content = JSON.stringify({ presets }, null, 2);
  fs.writeFileSync("babel.config.json", content);

  fs.mkdirSync("__tests__", { recursive: true });

  // write test
  const testPath = "__tests__/index.ts";
  if (!fs.existsSync(testPath)) {
    fs.writeFileSync(testPath, templateSumTest());
  }
}
