const express = require('express');
const { body, validationResult } = require('express-validator');
const Location = require('../models/location.js').Location;

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
exports.locationsGet = (req, res, next) => {
    
};

exports.locationGet = (req, res, next) => {
    const id = req.params.id;
    
    Location.findOne({ name: 'Location name 2' }) //TODO: FIND OUT HOW TO ORDER THIS NUMERICALLY
        .then((location) => {

            return res.send(location);
        
        });
};

//Create

exports.createGet = (req, res, next) => {

    return res.render('locations/create');

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
    return res.render('locations/search', {locations: locations});
};

exports.searchPost = (req, res, next) => {

    //TODO: SEARCH BY MULTIPLE FIELDS FROM LOCATIONS?

    const {search} = req.body;

    //TODO: REMOVE SPECIAL CHARS
    Location.find({name: search}, (err, locations) => {
        console.log(locations);
        //return res.send("Query sent!"); // 
        res.render('locations/search', {locations: locations});
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
        return res.render('locations/edit', { location: location });
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

