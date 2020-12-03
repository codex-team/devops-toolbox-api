import express from 'express';
import type e from 'express-serve-static-core';
import services from './routes/services';
import HttpError from './utils/httpError';

const app: express.Application = express();

app.use(express.json());

/**
 * Route for agents
 */
app.use('/services', services);

/**
 * Route error
 */
app.use((req: e.Request, res: e.Response, next: e.NextFunction) => {
  const error: HttpError = new HttpError(404, 'Not Found');

  next(error);
});

/**
 * Sending error
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
app.use((error: HttpError, req: e.Request, res: e.Response, next: e.NextFunction) => {
  res.status(error.status);

  res.json({
    error,
  });
});

export default app;
