import { Application } from 'express';
import { authRoutes } from './api/auth/routes/authRoutes';
import { serverAdapter } from './services/queues/base.queue';
import { currentUserRoutes } from './api/auth/routes/currentRoutes';
import { authMiddleware } from './middlewares/auth-middelware';
import { postRoutes } from './api/post/routes/postRoutes';
import { reactionRoutes } from './api/reactions/routs/reactions.routes';
import { commentRoutes } from './api/comments/routes/comment-routs';

const BASE_PATH = '/wecare';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
  };
  routes();
};