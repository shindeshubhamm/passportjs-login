const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const initializePassport = (passport) => {
  const authenticateUser = (email, password, next) => {
    const user = getUserByEmail()
    if (user === null) {
      return next(null, false, { message: 'Oops! No user found.' })
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, next) => { })
  passport.deserializeUser((id, next) => { })
}

module.exports = initializePassport