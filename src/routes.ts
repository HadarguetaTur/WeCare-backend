import { Application } from 'express';
import { authRoutes } from './api/auth/routes/authRoutes';
import { serverAdapter } from './services/queues/base.queue';
import { currentUserRoutes } from './api/auth/routes/currentRoutes';
import { authMiddleware } from './middlewares/auth-middelware';

const BASE_PATH = '/wecare';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  };
  routes();
};