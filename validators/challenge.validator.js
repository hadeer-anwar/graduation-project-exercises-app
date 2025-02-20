import Joi from "joi";

export const validateChallenge = Joi.object({
    challengeType: Joi.string().required().messages({
      'string.empty': 'Challenge type is required'
    }),
    description: Joi.string().optional(),
    target: Joi.number().required().messages({
      'number.base': 'Target must be a number',
      'any.required': 'Target is required'
    }),
    points: Joi.number().default(0),
    exercise: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'Invalid exercise ID format'
    })
  });