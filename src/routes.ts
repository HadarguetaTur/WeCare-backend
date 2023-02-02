import { Application } from 'express';
import { authRoutes } from './api/auth/routes/authRoutes';
import { serverAdapter } from './services/queues/base.queue';
import { currentUserRoutes } from './api/auth/routes/currentRoutes';
import { authMiddleware } from './middlewares/auth-middelware';
import { postRoutes } from './api/post/routes/postRoutes';
import { reactionRoutes } from './api/reactions/routs/reactions.routes';
import { commentRoutes } from './api/comments/routes/comment-routs';
import { notificationRoutes } from './api/notificartions/routes/notificationRoutes';
import { followerRoutes } from './api/followers/routes/followerRoutes';
import { imageRoutes } from './api/images/routes/image-routes';
import { chatRoutes } from './api/chet/routes/chet-routes';


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
    app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, imageRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
  };
  routes();
};