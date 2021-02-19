import { Request, Response, NextFunction, Router } from 'express';
import {HealthDTO, IHealthDTO, IServiceStatus} from '../../dto/health';

class DBHealth extends HealthDTO {
  serviceName: string;
  constructor() {
    super();
    this.serviceName = 'MongoDB';
  }

  getHealth(): boolean {
    // check DB Health
    return true;
  }
}

class MQHealth extends HealthDTO {
  serviceName: string;
  constructor() {
    super();
    this.serviceName = 'Redis MQ';
  }

  getHealth(): boolean {
    // check DB Health
    return true;
  }
}

export default class HealthController {
  private dependencies: IHealthDTO[] = [];

  constructor() {
    console.log('Invoked HealthController::constructor');
    this.dependencies.push(new MQHealth());
    this.dependencies.push(new DBHealth());
    console.log('Dependencies for HEALTH', this.dependencies.length);
  }

  public getHealth(req: Request, res: Response) {
    let systemHealth: IServiceStatus[] = [];
    this.dependencies.forEach((dependency) => {
      systemHealth.push(dependency.toJSON());
      console.log(dependency.toJSON());
    });
    res.status(200).json(systemHealth);
  }
}
