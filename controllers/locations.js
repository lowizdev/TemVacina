const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { NULL } = require('node-sass');
const { Vaccination } = require('../models/vaccination.js');
const Location = require('../models/location.js').Location;
const ObjectId = require('mongoose').Types.ObjectId;

exports.validate = (method) => {
    switch(method){
        case 'createLocation':{
            return[
                body('name', 'Unable to set name').exists(),
                body('type', 'Unable to set type').exists()
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

    if(!validationErrors.isEmpty()){
        return res.send(validationErrors); // TODO: DO SOMETHING MORE FLEXIBLE HERE
    }

    const { name, type } = req.body;
    //TODO: FIX THIS LATER
    const coordinates = ["some lat", "some long"];

    const newLocation = new Location({
        name: name,
        type: type,
        coordinates: coordinates,
    });

    newLocation.save()
        .then(location => {
            return res.redirect('/locations');
        })
        .catch((err) => {console.log(err)});

};

//Search

exports.searchGet = (req, res, next) => {
    //TODO: SEND RESPONSE WITH NEARBY LOCATIONS ALREADY (COORDINATE BASED?)
    let locations = [];
    //console.log("Here");
    return res.render('locations/search', { locations: locations, csrfToken: req.csrfToken() });
};

exports.searchPost = (req, res, next) => {

    //TODO: SEARCH BY MULTIPLE FIELDS FROM LOCATIONS?

    const {q} = req.body;

    //console.log(q);

    //TODO: REMOVE SPECIAL CHARS
    Location.find({ $text: { $search : q } }, (err, locations) => { //TODO: ENHANCE SEARCH
        console.log(locations);
        //return res.send("Query sent!"); // 
        return res.render('locations/search', {locations: locations, csrfToken: req.csrfToken()}); //TODO: MAYBE REMOVE CSRF HERE?
    });

    //return res.render('locations/search');

}


//Edit

//TODO: CHECK IF USER CAN EDIT

exports.editGet = (req, res, next) => {

    const locationId = req.params.locationid;
    //console.log(req.params);
    //console.log(locationId);

    Location.findById(locationId)
    .then((location) => {
        //console.log(location);
        return res.render('locations/edit', { location: location, csrfToken: req.csrfToken() });
    })
    .catch((err) => {
        console.log(err);
        //404
    });

    

};

exports.editPost = (req, res, next) => {
    
    const {name, type} = req.body;

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.send(validationErrors);
    }
    
    const locationId = req.params.locationid;

    Location.findById(locationId).then((curLocation) => {

        curLocation.name = name;
        curLocation.type = type;

        return curLocation.save();

    }).then((location) => {

        return res.redirect('/locations/search');

    }).catch((err) => console.log(err));

};

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
        console.log(err) //TODO: THROW 404 
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

    vaccinationsOIds = vaccinations.map(ObjectId)/*forEach(element => {
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

        return res.redirect('/locations/search'); //TODO: CHANGE REDIRECT
    
    })
    .catch(err => { 
        console.log(err) //TODO: THROW 404 
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
        console.log(err) //TODO: THROW 404 
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
