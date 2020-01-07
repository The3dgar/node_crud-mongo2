const express = require('express')
const router = express.Router()
const Note = require('../models/Note')

router.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ date: -1 })
  res.render('notes/all-notes', { notes })

})

router.get('/notes/add', (req, res) => {
  res.render('notes/new-note')
})

router.post('/notes/new-note', async (req, res) => {
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
    await newNote.save()
    req.flash('success_msg', 'Nota Agregada satisfactoriamente')
    res.redirect('/notes')
  }

})

router.get('/notes/edit/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit-note', { note })
})

router.put('/notes/edit-note/:id', async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description })
  req.flash('success_msg', 'Nota Editada satisfactoriamente')
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Nota Eliminada satisfactoriamente')
  res.redirect('/notes')
})


module.exports = router