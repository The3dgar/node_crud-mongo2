const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

// colocar el metodo isAuthenticated a cada ruta que queremos asegurar

router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({userId: req.user.id}).sort({ date: -1 })
  res.render('notes/all-notes', { notes })

})

router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  const { title, description } = req.body
  const errors = [];
  if (!title && typeof title != String) {
    errors.push({ text: "Por favor escriba un titulo" })
  }
  if (!description && typeof description != String) {
    errors.push({ text: "Por favor escriba una descripcion" })
  }

  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      title,
      description
    })
  } else {
    const newNote = new Note({ title, description })
    // al momento de authenticar nosotros hemos creado un req.user
    newNote.userId = req.user.id
    await newNote.save()
    req.flash('success_msg', 'Nota Agregada satisfactoriamente')
    res.redirect('/notes')
  }

})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit-note', { note })
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description })
  req.flash('success_msg', 'Nota Editada satisfactoriamente')
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Nota Eliminada satisfactoriamente')
  res.redirect('/notes')
})


module.exports = router