const serverTemplate = (): string => {
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
    })
  }

  public start() {
    this.app.listen(envs.PORT, () => {
      logger.info('🚀 Servidor ejecutándose en puerto ' + envs.PORT);
      logger.info('🌍 Entorno: ' + envs.NODE_ENV);
      logger.info('📊 Logs guardándose en: ' + path.join(process.cwd()) + "/logs");
    });
  }
};
`;

export default serverTemplate;
