import express from 'express';
import services from './routes/services';
import HttpError, { HttpStatusCode } from './utils/httpError';

const app: express.Application = express();

app.use(express.json());

/**
 * Route for agents
 */
app.use('/services', services);

/**
 * Route error
 */
app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const error: HttpError = new HttpError(HttpStatusCode.NotFound, 'Not Found');

  next(error);
});

/**
 * Sending error
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
app.use((error: HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(error.status);

  res.json({
    error,
  });
});

export default app;
