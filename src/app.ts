import { IAppRoutes } from './routes/interface/approutes';
import * as bodyParser from 'body-parser';
import express, { Application } from 'express';
import {Configuration, IConfig} from './config/config';
import {IMQController} from "./controllers/basecontroller";
import {ReddisMQPublishClient} from "./services/reddismq/publish";
import {ReddisMQSubscribeClient} from "./services/reddismq/subscribe";
import Logger from "./middleware/logger/logconfig";

export interface IApp {
  listen(): void;
  initializeGlobalLogging(): void;
  initializeMiddlewares(): void;
  initializeAppRoutes(routes: IAppRoutes[]): void;
  initializeSubscriptions(controllers: IMQController[]) : void;
  initializeErrorRoutes(): void;
  getControllers(): IMQController[];
}

export default class App implements IApp {
  public app: Application;
  private readonly NAMESPACE: string;
  private controllers: IMQController[] = [];
  private config: IConfig;

  constructor(routes: IAppRoutes[]) {
    this.app = express();
    this.NAMESPACE = 'App';
    this.initializeGlobalLogging();
    this.initializeMiddlewares();
    this.initializeAppRoutes(routes);
    this.initializeErrorRoutes();
    this.config = Configuration.getInstance().LoadConfig();
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
    const {subscriber, publisher} = this.config.redis;
    this.controllers = controllers;
    Logger.info('Reddis configuration', this.config.redis);
    controllers.forEach((controller: IMQController) => {
      controller.publisher = new ReddisMQPublishClient(this.config.redis.publisher);
      controller.subscriber = new ReddisMQSubscribeClient(this.config.redis.subscriber);
      controller.listen();
    });
  }

  getControllers(): IMQController[] {
    return this.controllers;
  }

  initializeErrorRoutes() {
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const error = new Error('Page NOT found');
      res.status(404).json({ message: error.message });
    });
  }

  public listen() {
    this.app.listen(this.config.server.port, () => {
      Logger.info(`PLOCR Name Verification - NodeJS application ${process.pid} in port ${process.env.PORT}`);
    });
  }
}
