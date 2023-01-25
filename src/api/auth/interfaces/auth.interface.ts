import { Document, ObjectId } from "mongoose";
import  mongoose  from "mongoose";
import { IUserDocument } from "src/api/user/interfaces/user.interface";



declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthPayload;
        }
    }
}

export interface AuthPayload {
    userId: string;
    uId: string;
    email: string;
    username: string;
    avatarColor: string;
    iat?: number
}

export interface IAuthDocument extends Document {
    _id: string | mongoose.Types.ObjectId|ObjectId;
    uId: string;
    username: string;
    email: string;
    password?: string;
    avatarColor: string;
    createdAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: number | string;
    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
  }

export interface ISignUpData {
    _id: mongoose.Types.ObjectId|ObjectId;
    uId: string;
    username: string;
    email: string;
    password?: string;
    avatarColor: string;
}

export interface IAuthJob {
    value?: string | IAuthDocument| IUserDocument
}

