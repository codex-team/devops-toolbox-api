import express from 'express';

const app: express.Application = express();

app.get('/', (req, res) => {
    res.send('Basic server!!');
});

export default app;