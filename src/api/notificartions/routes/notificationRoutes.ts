import express, { Router } from 'express';
import { authMiddleware } from 'src/middlewares/auth-middelware';
import { Update } from '../controllers/update-notifications';
import { Delete } from '../controllers/delete-notifications';
import { Get } from '../controllers/get-notifications';

class NotificationRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    console.log('notification');
    this.router.get('/notifications', authMiddleware.checkAuthentication, Get.prototype.notifications);
    this.router.put('/notification/:notificationId', authMiddleware.checkAuthentication, Update.prototype.notification);
    this.router.delete('/notification/:notificationId', authMiddleware.checkAuthentication, Delete.prototype.notification);

    return this.router;
  }
}

export const notificationRoutes: NotificationRoutes = new NotificationRoutes();