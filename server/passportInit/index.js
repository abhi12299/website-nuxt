const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const Admin = require('../models/admin.model')
const logger = require('../logger')
const errorCodes = require('../constants/errorCodes')
const baseURL = require('../constants/apiURL')
const secrets = require('../../secrets')

module.exports = (passport) => {
  const { OAUTH_CLIENT_ID, CLIENT_SECRET } = secrets

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: OAUTH_CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: `${baseURL}/auth/redirect`
      },
      async (token, refreshToken, profile, done) => {
        let email
        if (profile.emails && profile.emails.length) {
          email = profile.emails[0].value
        }

        try {
          if (!email) {
            throw new Error('Email not obtained!')
          }
          const admin = await Admin.findOne({ email })
          if (!admin) {
            throw new Error('Not admin!')
          }

          return done(null, { _id: admin._id, email })
        } catch (error) {
          logger.error(`Admin access denied, email was: ${email}`, error)
          const err = new Error()
          err.code = errorCodes[0]
          return done(err, null)
        }
      }
    )
  )
}
