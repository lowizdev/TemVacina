//Authentication guard logic

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    //DONETODO: MAYBE FLASH SOMETHING?
    req.flash('loginMessage', 'Please log in');
    res.redirect('/users/login');
}

