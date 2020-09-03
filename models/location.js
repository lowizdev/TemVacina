const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LocationSchema = Schema({

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    coordinates: {
        type: [String],
        required: true
    },

    //TODO: ADD THE VACCINE TYPES

}, {timestamps: true});

const Location = mongoose.model('Location', LocationSchema, 'locations'); //TODO: CHECK THIS!!!

module.exports.Location = Location;
