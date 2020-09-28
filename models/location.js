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
        type: {
            type: String,
            enum: ['Point'],
            require: true,
        },

        coordinates: {
            type: [Number],
            required: true,
        },

        required: false
    },

    vaccinations: {
        type: [String],
        required:false
    },

    //DONETODO: ADD THE VACCINE TYPES

}, {timestamps: true});

//Text search

LocationSchema.index({name: 'text', type: 'text'});

const Location = mongoose.model('Location', LocationSchema, 'locations'); //TODO: CHECK THIS!!!

module.exports.Location = Location;
