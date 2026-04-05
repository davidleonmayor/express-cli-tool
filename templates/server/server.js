const serverTemplate = () => {
  return `
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';

import {
  envs
} from '../configs/env.config';

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
    this.app.get('/test', (req, res) => res.send('OK'))
  }

  public start() {
    this.app.listen(envs.PORT, () => {
      //logger.info('🚀 Servidor ejecutándose en puerto ' + envs.PORT);
      //logger.info('🌍 Entorno: ' + envs.NODE_ENV);
      //logger.info(
      //  '📊 Logs guardándose en: ' + path.join(process.cwd(), "logs")
      //);
      console.log('🚀 Server running on port ' + envs.PORT);
      console.log('🌍 Environment: ' + envs.NODE_ENV);
    });
  }
};
`;
}

export default serverTemplate;
