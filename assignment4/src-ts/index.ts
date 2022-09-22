import express, { Express, Request, Response, NextFunction } from 'express';
import { PatternDemo } from './pattern-demo';
import { StudentPatternImpt } from './modules/student';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const handler: PatternDemo = new PatternDemo(StudentPatternImpt.getInstace());
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
	handler.handle(req, res);
	next();
});

const port = 3000;
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
