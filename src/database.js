const mongoose = require('mongoose')
let url = 'mongodb://localhost/notes-db-app'
mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(console.log("DB conectada"))
  .catch(console.log)