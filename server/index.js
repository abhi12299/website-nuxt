const express = require('express')
const consola = require('consola')
const mongoose = require('mongoose')
const passport = require('passport')
const { Nuxt, Builder } = require('nuxt')

const config = require('../nuxt.config.js')
const logger = require('./logger')
const middleware = require('./middleware')
const passportInit = require('./passportInit')
const apiRouter = require('./routes/apiRouter')
const authRouter = require('./routes/authRouter')
const errorCodes = require('./constants/errorCodes')
require('./config')

const app = express()

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
  })
  const db = mongoose.connection
  db.once('error', (err) => {
    logger.error('MongoDB connect error', err)
    process.exit(1)
  })

  db.once('open', () => {
    logger.info('MongoDB connected!')
  })

  middleware(app)
  passportInit(passport)

  app.use(passport.initialize())
  app.use('/api', apiRouter)
  app.use('/auth', authRouter)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.use((err, req, res, next) => {
    if (err.code === errorCodes[4]) {
      logger.error('CSRF token mismatch', err)
      return res.status(403).json({
        error: true,
        msg: 'Something went wrong. Please refresh the page and try again.'
      })
    } else if (err.code === errorCodes[3]) {
      return res.status(429).json({
        error: true,
        msg:
          "We've been receiving a lot of requests from you. Please try after sometime."
      })
    } else if (err.code === errorCodes[0]) {
      req.logout && req.logout()
      res.cookie('notAdmin', 'notAdmin')
      return res.redirect('/')
      // return res.redirect('https://accounts.google.com/logout');
    }
    return next(err)
  })

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason)
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err)
})
