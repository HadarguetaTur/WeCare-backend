import { Request, Response } from "express";
import { joiValidation } from "@utils/joi-validation.decorators";
import { signupSchema } from "@auth/schemes/singup";
import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import { authService } from "@service/db/auth.service";
import { BadRequestError } from "@utils/error-handler";
import { Helpers } from "@utils/helpers";
import { uploads } from "@utils/cloudinary-upload";
import { UploadApiResponse } from 'cloudinary'
import HTTP_STATUS from 'http-status-codes'
import { IUserDocument } from "@user/interfaces/user.interface";
import { UserCache } from "@service/redis/user.cache";
import { authQueue } from "@service/queues/auth.queue";
import { userQueue } from "@service/queues/user.queue";
import JWT from 'jsonwebtoken'
import { config } from "@root/config";
import { ObjectId } from 'mongodb';

const userCache: UserCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage, work, location, meetingPrice, userType, isHealthFundsAgreed, isInsuranceAgreed } = req.body;

    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
      work,
      location,
      meetingPrice,
      userType,
      isHealthFundsAgreed,
      isInsuranceAgreed
    });
    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occurred. Try again.');
    }

    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.work = work
    userDataForCache.profilePicture = `https://res.cloudinary.com/wecare-img/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
    userQueue.addUserJob('addUserToDB', { value: userDataForCache });

    const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
    req.session = { jwt: userJwt };
    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', user: userDataForCache, token: userJwt });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const {
      _id,
      username,
      email,
      uId,
      password,
      avatarColor,
      location,
      meetingPrice,
      userType,
      isHealthFundsAgreed,
      isInsuranceAgreed } = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      location,
      meetingPrice,
      userType,
      isHealthFundsAgreed,
      isInsuranceAgreed,
      createdAt: new Date()
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, email, password, avatarColor, work, location, meetingPrice, userType, isHealthFundsAgreed, isInsuranceAgreed } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      userType,
      isHealthFundsAgreed,
      isInsuranceAgreed,
      avatarColor,
      meetingPrice,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work,
      location,
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      healthFunds: [],
      insuranceCompanies: [],
      Summary: '',
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}