import fs from "fs";

import { dotEnvTemplate } from "../templates/configs/env/index";
import loaderTemplate from "../templates/configs/env/loader-template";
import {  barrelTemplate} from '../templates/configs/barrel.ts'

import type { ProjectDetails } from "../types/prompt";

export async function configureVarEnvironment(
  details: ProjectDetails,
  projectName: string,
): Promise<void> {
  // if .env don't exist create and write env vars
  const envPath = ".env";
  if (!fs.existsSync(envPath)) fs.writeFileSync(envPath, dotEnvTemplate);

  // load loader
  const loaderPath = "configs/envs.config.ts";
  fs.writeFileSync(loaderPath, loaderTemplate);

  // barrel
  const barrelPath = 'configs/index.ts'
  if (!fs.existsSync(barrelPath)) fs.writeFileSync(barrelPath, barrelTemplate)
}
