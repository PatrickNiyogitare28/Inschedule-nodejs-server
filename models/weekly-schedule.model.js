const mongoose = require('mongoose');
const Joi = require('joi');

const weeklScheduleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:true
    },
    eventName: {
        type: String,
        required: true
    },
    
    eventStartTime: {
        type: String,
        required: true
    },
    eventEndTime: {
        type: String,
        required: true
    },
    eventDay: {
        type:String,
        requird: true
    },
    eventStatus: {
        type: Number,
        default: 1
    },
    eventIndex: {
        type: Number,
       
    },
    eventNotificationStatus:{
        type:Number,
        default: 0
    }

    
})


const weekSchedule = mongoose.model('Weekschedule',weeklScheduleSchema);

function validateSchedule(schedule){
    const schema={
        userId : Joi.string().required(),
        eventName:Joi.string().max(50).min(3).required(),
        eventStartTime:Joi.string().required(),
        eventEndTime:Joi.string().required(),
        eventDay: Joi.string().required()
      
    }
    return Joi.validate(schedule,schema)
}

module.exports.weekSchedule = weekSchedule;
module.exports.validateSchedule = validateSchedule;