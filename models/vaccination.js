const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VaccinationSchema = new Schema({
    
    name:{
        type:String,
        required:true,
    },

    description:{
        type: String,
        required: true
    },

    pathologies:{ //TODO: (FUTURE) ENCAPSULATE PATHOLOGY IN ITS OWN SCHEMA
        type:[String],
        required: false,
    },

    vaccode:{
        type:String,
        required:true,
    },

    dosage:{
        type: Number,
        required:true,
    }

}, {timestamps:true});

VaccinationSchema.index({ name:'text', vaccode: 'text' });

const Vaccination = mongoose.model('Vaccination', VaccinationSchema, 'vaccinations');
module.exports.Vaccination = Vaccination;