const serverTemplate = () => {
  return `
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';
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
  }

  public start() {
        this.app.listen(4000, () => {
            //logger.info('🚀 Servidor ejecutándose en puerto ' + 4000); // TODO: use envs.
            //logger.info('🌍 Entorno: ' + envs.NODE_ENV');
            //logger.info(
            //    '📊 Logs guardándose en: ' + path.join(process.cwd(), "logs")}',
            //);
            console.log("Server running...")
        });
    }
};
`;
}

export default serverTemplate;

