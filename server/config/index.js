const Joi = require('@hapi/joi')
const logger = require('../logger')
const secrets = require('../../secrets')

const secretsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  MONGO_URI: Joi.string().required(),
  OAUTH_CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required()
})
  .unknown()
  .required()

const { error } = secretsSchema.validate(secrets)
if (error) {
  logger.error('Secrets validation fail', error)
  throw new Error(`Secrets vars validation error: ${error.message}`)
}
