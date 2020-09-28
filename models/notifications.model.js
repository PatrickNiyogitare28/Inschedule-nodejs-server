const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    notifActivityName:{
        type: String,
        required: true
    },
    notifActivityId:{
        type: String,
        required: true
    },
    notifSeenIndex:{
        type: Number,
        default: 0
    }


})

const Notifications =  new mongoose.model('Notifications',notificationSchema);
module.exports.Notifications = Notifications;
