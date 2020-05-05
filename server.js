const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')

const app = express()
initializePassport(passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// database
const users = []

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, './public')
const viewsDirectoryPath = path.join(__dirname, './templates/views')
const partialsDirectoryPath = path.join(__dirname, './templates/partials')

// Authentication middleware
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

// Not authenticated middleware
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// Using templating engine and setting paths
app.set('view engine', 'hbs')
app.set('views', viewsDirectoryPath)
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialsDirectoryPath)

// route:   GET /
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.hbs', { name: req.user.name })
})

// route:   GET /login
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.hbs')
})

// route:   POST /login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// route:   GET /register
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.hbs')
})

// route:   POST /register
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
    console.log(users)
  } catch (error) {
    res.redirect('/register')
  }
})

// Logout user
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.listen(port, () => {
  console.log(`server is up on port: ${port}`)
})