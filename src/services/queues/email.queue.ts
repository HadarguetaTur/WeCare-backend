import { BaseQueue } from "./base.queue";
import { IEmailJob } from "src/api/user/interfaces/user.interface";
import { emailWorker } from "src/workers/email.worker";


class EmailQueue extends BaseQueue {
    constructor() {
      super('emails');
      this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail);
    }
  
    public addEmailJob(name: string, data: IEmailJob): void {
      this.addJob(name, data);
    }
  }
  
  export const emailQueue: EmailQueue = new EmailQueue();