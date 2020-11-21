const Router = require('express').Router
const passport = require('passport')
const jwt = require('jsonwebtoken')

const Session = require('../models/session.model')
const { verifyAdminToken } = require('../helpers')
const secrets = require('../../secrets')

const authRouter = Router()

authRouter.get(
  '/login',
  async (req, res, next) => {
    const { token } = req.cookies
    if (token) {
      const { valid } = await verifyAdminToken(token)
      if (valid) {
        return res.redirect('/dashboard')
      }
    }
    next()
  },
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
  })
)

authRouter.get(
  '/redirect',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  async (req, res) => {
    const sessionId = await Session.createUserSession(req.user.email)
    const token = jwt.sign(
      {
        token: req.user._id,
        sessionId
      },
      secrets.JWT_SECRET
    )
    res.cookie('token', token, { httpOnly: true })
    res.redirect('/dashboard')
  }
)

authRouter.get('/logout', async (req, res) => {
  res.clearCookie('token')
  try {
    const { token } = req.cookies
    if (token) {
      await req.logout()

      const { sessionId } = jwt.decode(token, secrets.JWT_SECRET)
      await Session.destroyUserSession(sessionId)
      return res.json({ loggedOut: true })
    }
  } catch (err) {}
  res.json({})
})

authRouter.get('/verify', async (req, res) => {
  let { token } = req.cookies

  const bearer = req.headers.authorization
  if (bearer && !token) {
    token = bearer.split(' ')[1]
  }

  if (!token) {
    return res.json({ valid: false, emptyToken: true })
  }

  const { valid } = await verifyAdminToken(token)
  if (valid) {
    return res.json({ valid: true })
  }
  return res.json({ valid: false, emptyToken: false })
})

module.exports = authRouter
