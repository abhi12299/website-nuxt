const logger = require('../logger')
const redisClient = require('../config/redisDb')
const errorCodes = require('../constants/errorCodes')

module.exports = ({ prefix = '' } = {}) => async (req, res, next) => {
  try {
    const THROTTLE_TIME = 30 * 60 // 30 mins
    const MAX_ATTEMPTS = 5 // max attempts per IP in a given time
    const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info('IP address is: ' + IP)

    // gives null on non-existent key
    const numAttempts =
      Number(await redisClient.getAsync(`${prefix}${IP}`)) || 0
    if (numAttempts < MAX_ATTEMPTS) {
      logger.info(`${prefix}${IP} has attempts ${numAttempts}..`)
      let TTL = await redisClient.ttlAsync(`${prefix}${IP}`)
      if (TTL <= 0) {
        TTL = THROTTLE_TIME
      }

      await redisClient.setexAsync(`${prefix}${IP}`, TTL, numAttempts + 1)
    } else {
      logger.info(`throttling on IP: ${prefix}${IP}`)
      const err = new Error()
      err.code = errorCodes[3]
      throw err
    }

    next()
  } catch (err) {
    next(err)
  }
}
