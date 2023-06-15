import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is a required field'
  }),
  work: Joi.string().messages({
    'string.base': 'work must be of type string',
  }),
  location: Joi.string().messages({
    'string.base': 'location must be of type string',
  }),
  userType: Joi.string().required().messages({
    'string.base': 'location must be of type string',
  }),
  meetingPrice: Joi.string().messages({
    'string.base': 'location must be of type string',
  }),
  isHealthFundsAgreed: Joi.string().messages({
    'string.base': 'isHealthFundsAgreed must be of type string',
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email is a required field'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar color is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar image is required'
  })
});

export { signupSchema };