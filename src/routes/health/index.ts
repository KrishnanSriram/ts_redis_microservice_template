import { Request, Response, Router } from 'express';
import { IAppRoutes } from '../interface/approutes';
import HealthController from './../../controllers/health';

export class HealthRoutes implements IAppRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/health', (req: Request, res: Response) => {
      new HealthController().getHealth(req, res);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
