const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

// inicializaciones
const app = express()
const db = require('./database')


// setting
const puerto = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  // partial son componentes html que permiten invocarse dentro de otros elementos
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}))
app.set('view engine', '.hbs')

// middleware
app.use(express.urlencoded({ extended: false }))
// el nombre _method debe ir en el formulario que quiera emplear otro methodo
app.use(methodOverride('_method'))
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}))

// global variables

// routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
// static

app.use(express.static(path.join(__dirname, 'public')))


// server listening
app.listen(puerto, () => {
  console.info(`Server on port ${puerto}`)
})