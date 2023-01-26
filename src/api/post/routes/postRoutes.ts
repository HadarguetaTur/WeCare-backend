import express, { Router } from 'express';
import { authMiddleware } from 'src/middlewares/auth-middelware';
import { Create } from '../controllers/create.post';
import { Add } from '../controllers/add.post';
import { Delete } from '../controllers/delete.post';
import { Update } from '../controllers/update.post';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, Add.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, Add.prototype.postsWithImages);

    this.router.post('/post', authMiddleware.checkAuthentication, Create.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthentication, Create.prototype.postWithImage);

    this.router.put('/post/:postId', authMiddleware.checkAuthentication, Update.prototype.posts);
    this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithImage);

    this.router.delete('/post/:postId', authMiddleware.checkAuthentication, Delete.prototype.post);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();