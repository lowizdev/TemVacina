const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user.js').User;


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

    const { name, email, password, passwordconfirmation } = req.body;

    //TODO:FINISH THIS WITH VALIDATION AND ETC;

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
    req.logout();
    res.send("Logged out!");
}