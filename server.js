const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')

const app = express()
initializePassport(passport)

// database
const users = []

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, './public')
const viewsDirectoryPath = path.join(__dirname, './templates/views')
const partialsDirectoryPath = path.join(__dirname, './templates/partials')

// Using templating engine and setting paths
app.set('view engine', 'hbs')
app.set('views', viewsDirectoryPath)
app.use(express.urlencoded({ extended: false }))

app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialsDirectoryPath)

// route:   GET /
app.get('/', (req, res) => {
  res.render('index.hbs', { name: 'Shubham Shinde' })
})

// route:   GET /login
app.get('/login', (req, res) => {
  res.render('login.hbs')
})

// route:   POST /login
app.post('/login', (req, res) => {

})

// route:   GET /register
app.get('/register', (req, res) => {
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

app.listen(port, () => {
  console.log(`server is up on port: ${port}`)
})