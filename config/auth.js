//Authentication guard logic

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    //TODO: MAYBE FLASH SOMETHING?
    res.redirect('/users/login');
}

