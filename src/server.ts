import { HealthRoutes } from './routes/health/index';
import App, {IApp} from './app';
import {ScorecardNameCheckerMQController} from "./controllers/namechecker";

const app: IApp = new App([new HealthRoutes()]);
app.initializeSubscriptions([new ScorecardNameCheckerMQController(app)]);
app.listen();