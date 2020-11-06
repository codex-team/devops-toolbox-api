import express from 'express';
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
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error: HttpError = new HttpError(404, 'Not Found');

  next(error);
});

/**
 * Sending error
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(error.status);

  res.json({
    error,
  });
});

export default app;
