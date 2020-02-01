const Router = require('express').Router

const ensureAdmin = require('../middleware/ensureAdmin')
const searchController = require('../controllers/search.controller')
const subscriberController = require('../controllers/subscribe.controller')
const postController = require('../controllers/post.controller')
const dashboardController = require('../controllers/dashboard.controller')
const contactController = require('../controllers/contact.controller')
const apiRouter = Router()

apiRouter.use('/subscribe', subscriberController)

apiRouter.use('/search', ensureAdmin({ throwError: false }), searchController)

apiRouter.use('/post', ensureAdmin({ throwError: false }), postController)

// dashboard api routes
apiRouter.use(
  '/dashboard',
  ensureAdmin({ throwError: true }),
  dashboardController
)

apiRouter.use('/contact', contactController)

module.exports = apiRouter
