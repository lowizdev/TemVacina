const express = require('express');
const Location = require('../models/location.js').Location;

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