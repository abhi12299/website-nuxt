const Router = require('express').Router
const rateLimit = require('express-rate-limit')
const MongoStore = require('rate-limit-mongo')
const secrets = require('../../secrets')

const Queries = require('../models/queries.model')
const logger = require('../logger')
const { validateContactMe } = require('../validations')
const contactRouter = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'You are submitting too many contact queries.',
  store: new MongoStore({
    uri: secrets.MONGO_URI
  })
})

contactRouter.post('/', limiter, async (req, res) => {
  const err = validateContactMe(req.body)
  if (err) {
    logger.error('Validation fail on /contact', { body: req.body, err })
    return res.status(400).json({ msg: 'Invalid data!', error: true })
  }
  let { email, name, message } = req.body
  email = email.trim()
  name = name.trim()
  message = message.trim()

  try {
    await Queries.create({
      query: { email, name, message, when: Date.now() }
    })
    res.json('ok')
  } catch (err) {
    logger.error('Query cannot be saved:', err)
    res
      .status(400)
      .json({ msg: 'Something went wrong! Please try later.', error: true })
  }
})

module.exports = contactRouter
