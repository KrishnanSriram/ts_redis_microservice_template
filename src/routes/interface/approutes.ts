import { Router } from 'express';

export interface IAppRoutes {
  registerRoutes(): void;
  getRouter(): Router;
}
