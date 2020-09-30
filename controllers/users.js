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
    return res.render('users/login', { csrfToken: req.csrfToken() });
}

exports.loginPost = (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
    })(req, res, next);
}

//Register

exports.registerGet = (req, res, next) => {
    //console.log(req.csrfToken());
    return res.render('users/register', { csrfToken: req.csrfToken(), user: { name: undefined } });
}

exports.registerPost = (req, res, next) => {

    const validationErrors = validationResult(req);

    //console.log(req.body);

    const { name, email, password, passwordconfirmation } = req.body;

    //DONETODO: CHECK IF USER ALREADY EXISTS

    const newUser = new User({
        name: name,
        email: email,
        password: '',
    });
    
    if(!validationErrors.isEmpty() || ( password !== passwordconfirmation )){
        //DONETODO: DO SOMETHING WITH THE ERRORS
        //res.send(validationErrors);
        //res.redirect('/users/register');
        //console.log(validationErrors);
        req.flash('registerErrorMessage', 'Error registering the current user');
        return res.render('users/register', { csrfToken: req.csrfToken(), user: newUser, errors: validationErrors.errors });
    }

    //Password confirmation checked first to avoid resource consumption

    /*if(password !== passwordconfirmation){ //MOVED UP ^
        //DONETODO: SEND USER PRE-FILLED DATA
        res.redirect('/users/register');
        return;
    }*/

    User.find({email: email}).then((user) => { //FIRST, CHECK IF USER ALREADY EXISTS

        //console.log(user == false);

        if(user == false){

            //console.log("HERE")
            bcrypt.genSalt(10, (err, salt) => {

                bcrypt.hash(password, salt, (err, hash) => {
                    
                    if(err){
                        throw err;
                    }

                    newUser.password = hash;

                    newUser.save()
                        .then(user => {
                            
                            req.flash('loginMessage', 'User created successfully. You can now log in');

                            return res.redirect('/users/login');
                        })
                        .catch((err) => {
                        
                            //console.log(err)

                            err.status = 500;
                            return next(err);
                        
                        });//DONETODO: HANDLE THIS

                });
            });

        }else{//ELSE, THE USER ALREADY EXISTS

            //DONETODO: FLASH HERE
            req.flash('registerErrorMessage', 'Error registering the current user');
            return res.render('users/register', { csrfToken: req.csrfToken(), user: newUser }); //GO BACK TO START
        }
    }).catch((err) => {

        err.status = 500;
        return next(err);
    
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

    User.findById(req.user.id).then((user) => {
    
        res.render("users/edit", {csrfToken: req.csrfToken(), user: user});
    
    }).catch((err) => {
        
        err.status = 500;
        return next(err);

    });

    

    /*User.findById(req.user.id).then((curUser) => {
        //res.send(curUser.name);
        
    }).catch();*/

}

exports.editPost = (req, res, next) => {
    
    const validationErrors = validationResult(req);

    //DONETODO: CHECK IF LOGGED IN IS THE SAME BEING EDITED (?)

    const {name, email, password, newPassword, newPasswordConfirmation} = req.body;

    //res.send(req.user);
    if(!validationErrors.isEmpty()){
        //res.send(validationErrors); //DONETODO: FLASH

        req.flash("editErrorMessage", "Error registering the edited user");

        return res.render("users/edit", {csrfToken: req.csrfToken(), user: { name: name, email: email }});
    }

    //DONETODO: VALIDATE OLD PASSWORD TO CONFIRM USER AUTHORIZATION

    User.findById(req.user.id).then((curUser) => { //GETS THE ID FROM THE USER OF THE CURRENT SESSION
        //res.send(curUser.name);

        /*if(newPassword != ""){//New password is set

        }*/

        curUser.name = name; //TO EDIT EVERYTHING AT ONCE, MOVE THOSE LINES DOWN THERE ON BCRYPT HASH
        curUser.email = email;

        return curUser.save();
        
    }).then((curUser) => {
        //Handling password change if requested by user
        //DONETODO: VERIFY MATCHING PASSWORD
        if((newPassword != "") && (newPassword == newPasswordConfirmation)){
            //return curUser.save();

            bcrypt.compare(password, curUser.password).then((result) => {
                
                if(result){

                    bcrypt.genSalt(10, (err, salt) => {


                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            
                            if(err){
                                throw err;
                            }
                            curUser.password = hash;
                            curUser.save()
                            .then(user => {
                                
                                req.flash('editMessage', 'User and password edited successfully.');

                                return res.redirect('/users/edit');
                            })
                            .catch((err) => {

                                err.status = 500;
                                return next(err);
                            });
                        });
                    });
                }else{

                    req.flash('editMessage', 'Current password not match with input.');
                    return res.redirect('/users/edit');

                }
            }).catch((err) => {

                err.status = 500;
                return next(err);
            });

        }else{
            //Hashes and saves new password
            req.flash('editMessage', 'User edited successfully.');
            return res.redirect('/users/edit');
        }

        //return curUser;

    }).catch((err) => {

        err.status = 500;
        return next(err);
    });
    
    /*.then((user) => {
        
        res.send("User saved successfully");

    })*/
    

}

exports.dashboard = (req, res, next) => {

    return res.send("This is the dashboard");

}

exports.test = (req, res, next) => {

    console.log(req.body);

    console.log(req.csrfToken());

    return res.send("test from user");

}