import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from 'src/services/redis/message.cache';
import { IMessageData } from '../interfaces/chet.interface';
import { socketIOChatObject } from 'src/services/sockets/chet.sockets';
import { chatQueue } from 'src/services/queues/chet.queue';

const messageCache: MessageCache = new MessageCache();

export class Message {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { conversationId, messageId, reaction, type } = req.body;
    const updatedMessage: IMessageData = await messageCache.updateMessageReaction(
      `${conversationId}`,
      `${messageId}`,
      `${reaction}`,
      `${req.currentUser!.username}`,
      type
    );
    socketIOChatObject.emit('message reaction', updatedMessage);
    chatQueue.addChatJob('updateMessageReaction', {
      messageId: new mongoose.Types.ObjectId(messageId),
      senderName: req.currentUser!.username,
      reaction,
      type
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Message reaction added' });
  }
}