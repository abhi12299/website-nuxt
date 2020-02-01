const Router = require('express').Router
const rateLimiter = require('../middleware/rateLimiter')

const Subscriber = require('../models/subscriber.model')
const logger = require('../logger')
const { validateSubscribe } = require('../validations')
const subscribeRouter = Router()

subscribeRouter.post('/', rateLimiter(), async (req, res) => {
  const err = validateSubscribe(req.body)
  if (err) {
    logger.error('Validation fail on /subscribe', { body: req.body })
    return res.status(400).json({ msg: 'Invalid email!', error: true })
  }
  let { email } = req.body
  email = email.trim()

  if (await Subscriber.exists({ email })) {
    return res
      .status(400)
      .json({ msg: 'You are already subscribed!', error: true })
  }

  try {
    await Subscriber.create({ email })
    res.json('ok')
  } catch (err) {
    logger.error('Subscriber cannot be created:', err)
    res
      .status(400)
      .json({ msg: 'Something went wrong! Please try later.', error: true })
  }
})

module.exports = subscribeRouter
