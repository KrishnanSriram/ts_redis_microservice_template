import { IAppRoutes } from './routes/interface/approutes';
import * as bodyParser from 'body-parser';
import express, { Application } from 'express';
import config from './config/config';
import {IMQController} from "./controllers/basecontroller";
import {ReddisMQPublishClient} from "./listener/reddismq/publish";
import {ReddisMQSubscribeClient} from "./listener/reddismq/subscribe";

export interface IApp {
  listen(): void;
  initializeGlobalLogging(): void;
  initializeMiddlewares(): void;
  initializeAppRoutes(routes: IAppRoutes[]): void;
  initializeSubscriptions(controllers: IMQController[]) : void;
  initializeErrorRoutes(): void;
}

export default class App implements IApp {
  public app: Application;
  private readonly NAMESPACE: string;

  constructor(routes: IAppRoutes[]) {
    this.app = express();
    this.NAMESPACE = 'App';
    this.initializeGlobalLogging();
    this.initializeMiddlewares();
    this.initializeAppRoutes(routes);
    this.initializeErrorRoutes();
  }

  initializeGlobalLogging() {
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`, this.NAMESPACE);
      next();
    });
  }

  initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  initializeAppRoutes(routes: IAppRoutes[]) {
    routes.forEach((route) => {
      this.app.use('/api/v1/', route.getRouter());
    });
  }

  initializeSubscriptions(controllers: IMQController[]) {
    const {subscriber, publisher} = config.reddis;
    controllers.forEach((controller: IMQController) => {
      controller.publisher = new ReddisMQPublishClient(parseInt(publisher.port!), publisher.host!, publisher.password!, publisher.channel!);
      controller.subscriber = new ReddisMQSubscribeClient(parseInt(subscriber.port!), subscriber.host!, subscriber.password!, subscriber.channel!);
    });
  }

  initializeErrorRoutes() {
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const error = new Error('Page NOT found');
      res.status(404).json({ message: error.message });
    });
  }

  public listen() {
    this.app.listen(config.server.port, () => {
      console.log(this.NAMESPACE, `Server is running in ${config.server.hostname}: ${config.server.port}`);
    });
  }
}