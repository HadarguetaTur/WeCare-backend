import { IUserDocument } from "src/api/user/interfaces/user.interface";
import { UserCache } from "src/services/redis/user.cache";
import { Request,Response } from "express";
import { userService } from "src/services/db/user.service";
import HTTP_STATUS from 'http-status-codes'


const userCache: UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}
