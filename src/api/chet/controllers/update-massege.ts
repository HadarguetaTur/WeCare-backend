import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from 'src/services/redis/message.cache';
import { IMessageData } from '../interfaces/chet.interface';
import { socketIOChatObject } from 'src/services/sockets/chet.sockets';
import { chatQueue } from 'src/services/queues/chet.queue';
import { joiValidation } from 'src/utils/joi-validation.decorators';
import { markChatSchema } from '../schemes/chet.schemes';

const messageCache: MessageCache = new MessageCache();

export class Update {
  @joiValidation(markChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;
    const updatedMessage: IMessageData = await messageCache.updateChatMessages(`${senderId}`, `${receiverId}`);
    socketIOChatObject.emit('message read', updatedMessage);
    socketIOChatObject.emit('chat list', updatedMessage);
    chatQueue.addChatJob('markMessagesAsReadInDB', {
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId)
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Message marked as read' });
  }
}