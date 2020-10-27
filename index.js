const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const flash = require('flash');
const helmet = require('helmet');
const csrf = require('csurf');
const uuid = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

//console.log(process.env.MONGODB_URL);

//const User = require("./models/user.js").User;

const conStr = process.env.MONGODB_URL;

const app = express();

mongoose.connect(conStr);

//Registering callbacks for passport configuration
require('./config/passport.js')(passport);

//Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Static files

app.use(express.static('public'));

//Session

sessionSecret = process.env.SECRET;

app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized:true,
})); //TODO: CHANGE SECRET

//TODO: PERSIST SESSIONS ON MONGODB

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Auth guard
const ensureAuthenticated = require('./config/auth.js').ensureAuthenticated;

//BP
app.use(bodyParser.urlencoded({ extended: false }));

//CSRF

let csrfProtection = csrf({cookie: false});

//Nonce for inline scripts //TODO: MAYBE CHANGE TO SOMETHING MORE FORMAL IF ANY

app.use((req, res, next) => {

    res.locals.nonce = uuid.v4();

    next();
});

//Helmet
/*app.use(helmet({
    contentSecurityPolicy: false, //DONETODO: ENABLE AGAIN
    }));*/

app.use(helmet.contentSecurityPolicy({
    directives:{
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://unpkg.com/", (req, res) => `'nonce-${res.locals.nonce}'` ], //UNPKG domain for the map addon //NONCE ADDED FOR INLINE SCRIPTS (USING BACKTICKS IS MANDATORY FOR CSP, APPARENTLY)
        "block-all-mixed-content":[],
        "frame-ancestors": ["'self'"],
        "object-src": ["'none'"],
        "style-src": ["'self'", "https: 'unsafe-inline'"],
        "font-src": ["'self'", "https:", "data:"],
        "img-src": ["'self'", "data:", "*.openstreetmap.org"],
        "upgrade-insecure-requests": [],
    },
}));

//Flash messages

app.use(flash());

//Common routes

app.get('/', (req, res) => {
    //res.send('Hello!');
    res.render("index.ejs"); //IF CHANGED TO POST, WILL NEED CSRF
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

//TODO: FIX TEMPORARY
app.get('/map', (req, res, next) => {
    return res.render("map.ejs");
});

app.get('/testloc', (req, res, next) => {
    return res.render("testloc.ejs");
});

const userRoutes = require('./routes/users.js').router;
app.use('/users', csrfProtection, userRoutes);
const locationRoutes = require('./routes/locations.js').router;
app.use('/locations', csrfProtection, locationRoutes);
const vaccinationRoutes = require('./routes/vaccinations.js').router;
app.use('/vaccinations', csrfProtection, vaccinationRoutes);

//Error routes
//TODO: UNCOMMENT TO ENABLE ERROR HANDLERS
app.get('/404', (req, res, next) => { //TEST ONLY
    let err = new Error('not allowed');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    //console.log(err.status);

    if(err.status == 404){
        res.status(404);
        return res.render('errors/404');
    }else{
        res.status(500);
        return res.render('errors/500');
    }

});

module.exports = app;