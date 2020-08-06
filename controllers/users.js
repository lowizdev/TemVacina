const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator/check');
const User = require('../models/user.js').User;


//Validation with express validator
//Maybe put this on the model?
exports.validate = (method) => {
    switch(method){
        case 'createUser': {
            return [
                body('name', 'Unable to set proper username').exists(),
                body('email', 'Invalid Email').exists().isEmail(),
                body('password', 'Invalid Password').exists().isLength({min: 4}),
            ];
        }
    }
}

//Login

exports.loginGet = (req, res, next) => {
    res.render('login');
}

exports.loginPost = (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
    })(req, res, next);
}

//Register

exports.registerGet = (req, res, next) => {
    res.render('register');
}

exports.registerPost = (req, res, next) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        //TODO: DO SOMETHING WITH THE ERRORS
        res.send(validationErrors);
        //res.redirect('/users/register');
        return;
    }

    const { name, email, password, passwordconfirmation } = req.body;

    //Password confirmation checked first to avoid resource consumption

    if(password !== passwordconfirmation){
        //TODO: SEND USER PRE-FILLED DATA
        res.redirect('/users/register');
        return;
    }

    const newUser = new User({
        name: name,
        email: email,
        password: '',
    });

    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(password, salt, (err, hash) => {
            
            if(err){
                throw err;
            }

            newUser.password = hash;

            newUser.save()
                .then(user => {
                    
                    //TODO: FLASH HERE

                    res.redirect('/users/login');
                })
                .catch((err) => {console.log(err)});//TODO: HANDLE THIS

        });
    });

}

//Logout

exports.logout = (req, res, next) => {
    //Exposed by passport
    req.logout();
    res.send("Logged out!");
}

exports.editGet = (req, res, next) => {
    //For simplicity and security, the app will allow only the authenticated user to edit itself

    res.render("users/edit");

    /*User.findById(req.user.id).then((curUser) => {
        //res.send(curUser.name);
        
    }).catch();*/

}

exports.editPost = (req, res, next) => {
    
    const validationErrors = validationResult(req);

    //TODO: CHECK IF LOGGED IN IS THE SAME BEING EDITED (?)

    //res.send(req.user);
    if(!validationErrors.isEmpty()){
        res.send(validationErrors);
        return;
    }

    const {name, email, password, newPassword, newPasswordConfirmation} = req.body;

    //TODO: VALIDATE OLD PASSWORD TO CONFIRM USER AUTHORIZATION

    User.findById(req.user.id).then((curUser) => {
        //res.send(curUser.name);

        curUser.name = name;
        curUser.email = email;

        return curUser.save();
        
    }).then((curUser) => {
        //Handling password change if requested by user
        //TODO: VERIFY MATCHING PASSWORD
        if(true){
            //return curUser.save();
        }else{
            //Hashes and saves new password
        }

        return curUser;

    }).then((user) => {
        
        res.send("User saved successfully");

    })
    .catch();

}