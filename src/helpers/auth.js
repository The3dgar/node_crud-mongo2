const helpers = {};

helpers.isAuthenticated = (req, res, next) =>{
  // esta funcion viene desde passport
  if(req.isAuthenticated()) {
    // si se logeo
    next()
  }else{
    req.flash('error_msg', 'No autorizado')
    res.redirect('/users/signin')
  }
}

module.exports = helpers