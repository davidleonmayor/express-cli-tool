const templateCodeMainAppTS = () => {
  return `
//import configureExpress from './configs/express.config.ts';
import server from './server.ts';

//const app = configureExpress();
//export default app;
void server();
`;
};

export default templateCodeMainAppTS;
