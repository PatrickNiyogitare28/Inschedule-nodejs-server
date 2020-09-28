const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
   
    scheduleId : {
        type: String,
        require: true
        
    },
    accoprished_date : {
    type : String,
    require: true
    },
    accoprished_time : {
        type : String,
        require: true
        },
    userID : {
        type: String,
        require: true
        
    }
})

const Accoprished = new mongoose.model('Accoplished',Schema);
module.exports.Accoprished = Accoprished;