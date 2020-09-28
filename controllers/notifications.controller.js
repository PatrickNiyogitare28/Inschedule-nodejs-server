const express = require('express');
const {Day,dayValidator} = require('../models/days.model');
const {weekSchedule,validateSchedule} = require('../models/weekly-schedule.model');
const Notifications = require('../models/notifications.model');

const router = express.Router();
router.get('/to-notify/:userId/:day/:currentTime', async(req,res)=>{
   
    let resultHolder = [];
    let day = req.params.day;
   
    if(!day) return res.send("Invalid day").status(400);
    else if(day > 6 || day < 0) return res.send("Invalid day").status(400);
   

    await Day.findOne({index: day})
     .then(currentDay => {
      
         weekSchedule.find({eventDay: currentDay._id})
         .then(todaySchedules => {

            if(todaySchedules.length == 0){
                resultHolder.push({
                    notificationsResStatus:0
                })
                return res.send(resultHolder).status(200)
            }
            
             for(var i=0;i<todaySchedules.length;i++){

                if(todaySchedules[i].userId == req.params.userId && todaySchedules[i].eventStatus == 1 && todaySchedules[i].eventStartTime == req.params.currentTime){
                  resultHolder.push({
                      _id: todaySchedules[i]._id,
                      eventName: todaySchedules[i].eventName,
                      eventStartTime: todaySchedules[i].eventStartTime,
                      eventEndTime: todaySchedules[i].eventEndTime,
                      notificationsResStatus: 1
                  })
               
                  if(resultHolder.length == todaySchedules.length) return res.send(resultHolder).status(200);
                } 
                else{
                      resultHolder.push({
                        
                        notificationsResStatus: 0
                    
                      })
                      if(resultHolder.length == todaySchedules.length) return res.send(resultHolder).status(200);
                  }

            //    console.log(resultHolder.length());
                // console.log(todaySchedules[i]._id);
                // if(resultHolder.length == todaySchedules.length) return res.send(resultHolder).status(200);
             }
           
             
           
            
         })
         .catch(err => res.send("schedule not found").status(404))
     })
     .catch(err => res.send("Current day not found").status(404)); 

})
module.exports = router;