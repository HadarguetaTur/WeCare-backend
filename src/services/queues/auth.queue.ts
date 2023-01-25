import { BaseQueue } from './base.queue';
import { IAuthJob } from 'src/api/auth/interfaces/auth.interface';
import { authWorker } from 'src/workers/auth.worker';

class AuthQueue extends BaseQueue{
    constructor(){
        super('auth');
        this.processJob('addAuthUserToDB',5,authWorker.addAuthUserToDB);
    }

    public addAuthUserJob(name:string,data:IAuthJob):void{
        this.addJob(name,data);
    }

}

export const authQueue:AuthQueue=new AuthQueue()