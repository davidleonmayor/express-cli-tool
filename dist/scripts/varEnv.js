import fs from "fs";
import { dotEnvTemplate } from "../templates/configs/env/index.js";
import loaderTemplate from "../templates/configs/env/loader-template.js";
export async function configureVarEnvironment(details, projectName) {
    // if .env don't exist create and write env vars
    const envPath = ".env";
    if (!fs.existsSync(envPath))
        fs.writeFileSync(envPath, dotEnvTemplate);
    // load loader
    const loaderPath = "configs/env.config.ts";
    fs.writeFileSync(loaderPath, loaderTemplate);
}
//# sourceMappingURL=varEnv.js.map