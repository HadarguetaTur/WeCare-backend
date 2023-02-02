import express, { Router } from 'express';
import { authMiddleware } from 'src/middlewares/auth-middelware';
import { Add } from '../controllers/followers';
import { Remove } from '../controllers/unfollow';
import { Get } from '../controllers/get';
import { AddUser } from '../controllers/block';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers);

    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);
    this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.block);
    this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.unblock);

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();