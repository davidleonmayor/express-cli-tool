const templateCodeServerTS = () => {
  return `
import app from './app.ts';
//import connectToDatabase from './configs/database.config.ts';
//import { envConfig } from './configs/env.config.ts';
//import logger from './configs/logger.config.ts';

export default async function server(): Promise<void> {
  try {
    //await connectToDatabase();
    //app.listen(envConfig.APP_PORT, async () => {
    app.listen(4000, async() => {
      //logger.info(\`Server running on port \${envConfig.APP_PORT}\`);
      console.log("it's working...");
    });
  } catch (error) {
    //logger.error('Failed to start server', error);
    console.error(error);
    process.exit(1);
  }
}
`;
};

export default templateCodeServerTS;
