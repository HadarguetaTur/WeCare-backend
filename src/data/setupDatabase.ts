import Logger from "bunyan";
import mongoose from "mongoose";
import { config } from "../config/config";


const log:Logger =config.createLogger('setupData')

export default ()=>{
    const connect=()=>{
        mongoose.connect(`${config.DATABASE_URL}`)
        .then(()=>{
           log.info('Successfully connected');
      
        })
        .catch((error)=>{
            log.error(`Error connecting ${error}` );
            return process.exit(1);           
        })
    }
    connect();
    mongoose.connection.on('disconnected',connect)
};