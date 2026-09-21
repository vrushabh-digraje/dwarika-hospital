import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import config from './config/index.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { optionalAuth } from './middleware/optionalAuth.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || config.corsOrigin.includes(origin) || config.nodeEnv === 'development') {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(optionalAuth);

app.use('/uploads', express.static(path.join(config.uploadDir)));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dwarika Hospital CMS API',
    version: '1.0.0',
    docs: {
      admin: '/api/admin',
      public: '/api/public',
      health: '/api/health',
    },
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
