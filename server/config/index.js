const Joi = require('@hapi/joi')
const logger = require('../logger')
const secrets = require('../../secrets')

const secretsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  MONGO_URI: Joi.string().required(),
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().default(6379),
  OAUTH_CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  GMAIL_USER: Joi.string().required(),
  GMAIL_PASS: Joi.string().required(),
  ELASTIC_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string()
      .trim()
      .required()
  })
})
  .unknown()
  .required()

const { error } = secretsSchema.validate(secrets)
if (error) {
  logger.error('Secrets validation fail', error)
  throw new Error(`Secrets vars validation error: ${error.message}`)
}
