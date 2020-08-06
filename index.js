const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const User = require("./models/user.js").User;

const conStr = "mongodb://localhost:27017/temvacinadb";

const app = express();

mongoose.connect(conStr);

//Registering callbacks for passport configuration
require('./config/passport.js')(passport);

//Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Session

app.use(session({
    secret: 'this is a secret',
    resave: true,
    saveUninitialized:true,
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash



//Auth guard
const ensureAuthenticated = require('./config/auth.js').ensureAuthenticated;

//BP
app.use(bodyParser.urlencoded({ extended: false }));

//Common routes

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('This is the /authenticated/ dashboard!');
});

/*app.get('/createtest', (req, res) => {

    const user = new User({
        name: 'Test user',
        email: 'test@testmail.com',
        password: 'nopass',
    });

    user.save().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });

});*/

const userRoutes = require('./routes/users.js').router;
app.use('/users', userRoutes);
const locationRoutes = require('./routes/locations.js').router;
app.use('/locations', locationRoutes);

app.listen(3000);