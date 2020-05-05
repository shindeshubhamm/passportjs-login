const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const initialize = (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, next) => {
    const user = getUserByEmail(email)
    if (user === null || user === undefined) {
      return next(null, false, { message: 'Oops! No user found.' })
    }
    console.log(user)
    try {
      if (await bcrypt.compare(password, user.password)) {
        return next(null, user)
      }
      return next(null, false, { message: 'Incorrect password.' })
    } catch (error) {
      return next(error)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, next) => next(null, user.id))
  passport.deserializeUser((id, next) => {
    return next(null, getUserById(id))
  })
}

module.exports = initialize