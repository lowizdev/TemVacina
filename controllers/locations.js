const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { User } = require('../models/user.js');
//const { NULL } = require('node-sass');
const { Vaccination } = require('../models/vaccination.js');
const Location = require('../models/location.js').Location;
const ObjectId = require('mongoose').Types.ObjectId;

exports.validate = (method) => {
    switch(method){
        case 'createLocation':{
            return[
                body('name', 'Unable to set name').exists(),
                body('type', 'Unable to set type').exists(),
                body('latitude', 'Unable to set latitude').exists().isFloat(),
                body('longitude', 'Unable to set longitude').exists().isFloat(),
            ];
        }
    }
}

//Show
/*exports.locationsGet = (req, res, next) => {
    return res.send("Location get");
};*/

exports.locationGet = (req, res, next) => {
    const id = req.params.id;

    let reqLocation = undefined; //Another solution for passing dependencies through promises
    
    Location.findOne({ _id: id }) //DONETODO: FIND OUT HOW TO ORDER THIS NUMERICALLY //TEST, CHANGE LATER
        .then((location) => {
            reqLocation = location;
            //return res.send(location);
            vaccinationIds = location.vaccinations;
            
            return Vaccination.find({'_id': 
                { $in: vaccinationIds },
            });
        
        }).then((vaccinations) => {
            return res.render('locations/show', { location : reqLocation, vaccinations : vaccinations });
        })
        .catch((err) => {console.log(err);});
};

//Create

exports.createGet = (req, res, next) => {

    return res.render('locations/create', {csrfToken: req.csrfToken()});

};

exports.createPost = (req, res, next) => {
    
    const validationErrors = validationResult(req);

    const { name, type, latitude, longitude } = req.body;

    //console.log("Here");

    if(!validationErrors.isEmpty()){

        //console.log("Here");

        req.flash('createErrorMessage', 'Error registering current location');

        return res.render('locations/create', { csrfToken: req.csrfToken(), location: {name: name, type: type}, errors: validationErrors.errors });

        //return res.send(validationErrors); // DONETODO: DO SOMETHING MORE FLEXIBLE HERE
    }
    //DONETODO: FIX THIS LATER

    //let latitude = -21.87;
    //let longitude = -42.70;

    const coordinates = {
        type: "Point",
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
    };//["some lat", "some long"];

    const newLocation = new Location({
        name: name,
        type: type,
        coordinates: coordinates,
    });

    newLocation.save()
        .then(location => {
            return res.redirect('/locations');
        })
        .catch((err) => {
            //console.log(err)
            err.status = 500;
            return next(err);
        });

};

//Search

exports.searchGet = (req, res, next) => {
    //TODO: SEND RESPONSE WITH NEARBY LOCATIONS ALREADY (COORDINATE BASED?)
    let locations = [];
    //console.log("Here");
    return res.render('locations/search', { locations: locations, csrfToken: req.csrfToken() });
};

exports.searchPost = (req, res, next) => {

    //DONETODO: SEARCH BY MULTIPLE FIELDS FROM LOCATIONS?

    const {q} = req.body;

    const sanitizedQuery = q.replace(/[^0-9a-z ]/gi, '');

    //console.log(sanitizedQuery);

    //DONETODO: REMOVE SPECIAL CHARS
    Location.find({ $text: { $search : sanitizedQuery } }, (err, locations) => { //DONETODO: ENHANCE SEARCH
        console.log(locations);
        //return res.send("Query sent!"); // 
        return res.render('locations/search', {locations: locations, csrfToken: req.csrfToken()}); //TODO: MAYBE REMOVE CSRF HERE?
    });

    //return res.render('locations/search');

}

exports.searchGeoGet = (req, res, next) => {

    let locations = [];

    return res.render('locations/searchgeo', { locations: locations, csrfToken: req.csrfToken() });
}

exports.searchGeoPost = (req, res, next) => { //TODO: MAYBE MERGE WITH SEARCH?
    
    const {q, latitude, longitude} = req.body;

    const sanitizedQuery = q.replace(/[^0-9a-z ]/gi, '');

    //{ $text: { $search : sanitizedQuery }}

    //{ coordinates: { $near: { $maxDistance: 12000000, $geometry: { type: "Point", coordinates: [-21, -42],  } } } }

    let searchQuery = { coordinates: {
        $geoWithin: {
            $center: [[latitude, longitude], 50], //Longitude first?
        }
    }};

    Location.find(searchQuery, (err, locations) => { 
        console.log(locations);
        return res.send("Query sent!"); // TODO: FINISH RESPONSE
        //return res.render('locations/search', {locations: locations, csrfToken: req.csrfToken()});
    });
};


exports.searchVacByLocationGeo = (req, res, next) => { 
    
    const {q, latitude, longitude} = req.query;

    const sanitizedQuery = q.replace(/[^0-9a-z ]/gi, '');

    let searchQuery = { coordinates: {
        $geoWithin: {
            $center: [[latitude, longitude], 50], //Longitude first?
        }
    }};

    //console.log(q);

    //TODO: MAYBE CHECK OTHER DATA FROM VACCINATION ON SEARCH
    Vaccination.find({ $text: { $search: sanitizedQuery } })
    .then((vaccinations) => {

        //TODO: HANDLE WHEN EMPTY
        //console.log(vaccinations);

        vaccinationIds = vaccinations.map((vaccination) => {
            return vaccination._id;
        });

        //console.log(vaccinationIds);
        
        return Location.find({
            ...searchQuery, 
            vaccinations: {
                $elemMatch: { //Match
                    $in: vaccinationIds
                }
            }
        });
        //return res.send('success');
        //return res.render('locations/showvacbygeoresults');
        //TODO: TEST WITH MORE CASES
    })
    .then((locations) => {

        //console.log(locations);//TESTING ONLY

        //DONETODO: ADD MAP TO SHOW PAGE
        //TODO: FIX MAP STYLING 
        return res.render('locations/showvacbygeoresults', { locations: locations, coords: { latitude, longitude }, nonce: res.locals.nonce });

    })
    .catch((err) => {
        
        err.status = 500;
        return next(err);
    
    });

};

//Edit

//DONETODO: CHECK IF USER CAN EDIT

exports.editGet = (req, res, next) => {

    const locationId = req.params.locationid;
    //console.log(req.params);
    //console.log(locationId);

    let foundLocation = undefined;

    Location.findById(locationId)
    .then((location) => {
        
        foundLocation = location;

        return User.findById(req.user.id);
        
    })
    .then((user) => {
        //console.log(location);

        if(user.admin){
            return res.render('locations/edit', { location: foundLocation, csrfToken: req.csrfToken() });
        }
        
        return res.render('locations/index');
        
    })
    .catch((err) => {
        //console.log(err);
        //404 ?
        err.status = 500;
        return next(err);
    });

    

};

exports.editPost = (req, res, next) => {
    
    const {name, type} = req.body;

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.send(validationErrors);
    }
    
    const locationId = req.params.locationid;

    User.findById(req.user.id)
    .then((user) => {
        
        if(!user.admin){
            return res.redirect('/locations/index');
        }

        return Location.findById(locationId);

    }).then((curLocation) => {

        curLocation.name = name;
        curLocation.type = type;

        return curLocation.save();

    }).then((location) => {

        return res.redirect('/locations/search');

    }).catch((err) => {
        //console.log(err)
        err.status = 500;
        return next(err);
    });

};

exports.delete = (req, res, next) => {

    const locationId = req.params.locationid;

    Location.findById(locationId).then((curLocation) => {
    
        return curLocation.delete();
    
    }).then((result) => {
        
        return res.redirect('/locations/');
    
    }).catch((err) => {
        //console.log(err)
        err.status = 500;
        return next(err);
    });

} //DONETODO: IMPLEMENT DELETION

exports.showDashboard = (req, res, next) => { //DONETODO: FINISH DASHBOARD

    const { page = 1, qLimit = 100 } = req.query; //Can be used with or without query

    const qSkipped = (page - 1) * qLimit;

    Location.find({}).limit(qLimit).skip(qSkipped).exec().then((locations) => {
        return res.render('locations/dashboard', { locations: locations, page: page });
    }).catch(err => { 
        err.status = 500;
        return next(err);
    });
}

//ADD VACCINATION ROUTE
//Add Vaccination

exports.addVaccinationGet = (req, res, next) => {

    //Adds to a list, when posted, sends all to register on such location

    //const vaccinationId = req.params.vaccinationid;

    //Would be ideal to make a route for each vaccination?

    const locationId = req.params.locationid;

    Promise.all([Location.findById(locationId), Vaccination.find({})])
    .then(values => {
        //console.log(values);

        const existingVaccinationCodes = values[0].vaccinations;
        const vaccinations = values[1];

        return res.render('locations/addvaccinations', {
            existingVaccinationCodes: existingVaccinationCodes,
            vaccinations: vaccinations,
            location: values[0],
            csrfToken: req.csrfToken(),
        });
    })
    .catch(err => { 
        //console.log(err) //DONETODO: THROW 404 
        err.status = 404;
        return next(err);
    });

    /*Location.findById(locationId)
    .then((location) => {
        return location;
    })

    Vaccination.find({})
    .then((vaccinations) => {
        return res.render("locations/addVaccination", { vaccinations: vaccinations });
    })
    .catch(err => { console.log(err) });*/

}

exports.addVaccinationPost = (req, res, next) => {

    const vaccinations = Object.values(req.body);
    const locationId = req.params.locationid;

    //console.log(Object.values(req.body));

    vaccinationsOIds = vaccinations.map(ObjectId);/*forEach(element => {
        return ObjectId(element);
    });*/

    //console.log(vaccinationsOIds);

    Promise.all([
        Location.findById(locationId),
        Vaccination.find({'_id': {
            $in: vaccinationsOIds
        }}), 
    ])
    .then(values => {

        const location = values[0];
        const vaccinationIds = values[1].map(vaccination => { return vaccination._id; });
        
        //console.log(vaccinationIds);
        location.vaccinations = vaccinationIds;
        
        //return res.send("done");

        return location.save();

    })
    .then(location => {

        return res.redirect('/locations/'+location._id); //DONETODO: CHANGE REDIRECT
    
    })
    .catch(err => { 
        //console.log(err) //DONETODO: THROW 404

        err.status = 404;
        return next(err);
    });

    /*Vaccination.find({'_id': {
            $in: vaccinationsOIds
        }
    })
    .then(existingVaccinations => {
        console.log(existingVaccinations);

        //FIND LOCATION AND REGISTER VACCINATIONS

        return res.send("Post sent");
    })
    .catch(err => { 
        //console.log(err) //DONETODO: THROW 404
        err.status = 404;
        return next(err); 
    });*/

    //return res.send("Post sent");

    /*Location.findById(locationId)
    .then((location) => {

        //vaccinations.filter(); //Responsibility moved to get

        return location.save();
    })
    .then()
    .catch(err => {console.log(err)});*/
}
