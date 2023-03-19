import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from 'src/services/redis/user.cache';
import { userQueue } from 'src/services/queues/user.queue';
import { joiValidation } from 'src/utils/joi-validation.decorators';
import { notificationSettingsSchema } from '../schemes/user.schema';

const userCache: UserCache = new UserCache();

export class UpdateSettings {
  @joiValidation(notificationSettingsSchema)
  public async notification(req: Request, res: Response): Promise<void> {
    await userCache.updateSingleUserItemInCache(`${req.currentUser!.userId}`, 'notifications', req.body);
    userQueue.addUserJob('updateNotificationSettings', {
      key: `${req.currentUser!.userId}`,
      value: req.body
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification settings updated successfully', settings: req.body });
  }
}