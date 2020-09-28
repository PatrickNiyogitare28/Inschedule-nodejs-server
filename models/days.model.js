const mongoose = require('mongoose');
const Joi = require('joi');

const daySchema = new mongoose.Schema({
    dayName: {
        type: String,
        required: true,
        unique:true
    },
    dayAbbr:{
        type: String,
        required: true,
        unique:true
    },
    index: {
        type: Number,
        required: true,
        unique:true
    }

})

const Day = mongoose.model('Day',daySchema);
function dayValidator(day){
    const schema={
       
        dayName: Joi.string().max(50).min(3).required(),
        dayAbbr: Joi.string().max(50).min(3).required(),
        index: Joi.number().required()

       }
    return Joi.validate(day,schema)
}

module.exports.Day = Day;
module.exports.dayValidator = dayValidator;
