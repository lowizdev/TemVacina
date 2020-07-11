const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user.js').User;

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email, password, done) => {
            //Find User here
            User.findOne({email: email})
                .then( (user) => {
                    
                    if(!user){
                        return done(null, false, { message: 'Unregistered' });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        
                        if(err){
                            throw err;
                        }

                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, { message: 'Password error' });
                        }

                    });

                }).catch((err) => {console.log(err)});
        })
    );

    //Needed by passport
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}