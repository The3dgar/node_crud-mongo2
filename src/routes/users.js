const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')

router.get('/users/signin', (req, res) => {
  res.render('users/signin')
})

// por defecto es local
router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true //para enviar mensajes flash
}))

router.get('/users/signup', (req, res) => {
  res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
  const { name, password, email, confirm_password } = req.body
  const errors = []

  for (let prop in req.body) {
    if (req.body[prop].length <= 0) {
      errors.push({ text: `${prop} no puede estar vacio` })
    }
  }

  if (password != confirm_password) {
    errors.push({ text: 'Contraseña no coincide' })
  }

  if (password.length < 4) {
    errors.push({ text: 'La contraseña debe ser mayor de 4 caracteres' })
  }

  if (errors.length > 0) {
    res.render('users/signup', { errors, name, email, password, confirm_password })
  } else {
    const emailUser = await User.findOne({ "email": email })
    if (emailUser) {
      req.flash('errors_msg', 'Correo en uso')
      res.redirect('/users/signup')
    } else {
      const newUser = new User({ name, email, password })
      newUser.password = await newUser.encryptPassword(password)
      await newUser.save()
      req.flash('success_msg', 'Usuario registrado')
      res.redirect('/users/signin')
    }
  }

})

module.exports = router