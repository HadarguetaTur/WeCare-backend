import express, {Express} from 'express'
import { WecareServer } from './server'
import databaseConnection from "./data/setupDatabase";
import { config } from './config';

class Application {
    public initialize (): void {
        this.loadConfig();
        databaseConnection();
        const app: Express=express();
        const server:WecareServer= new WecareServer(app);
        server.start();
    }

    private loadConfig():void{
        config.validateConfig();
        config.cloudinaryConfig();
    }
}

const application:Application = new Application();
application.initialize();
