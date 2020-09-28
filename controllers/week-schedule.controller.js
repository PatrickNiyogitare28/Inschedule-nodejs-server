const mongoose = require('mongoose')
const express = require('express');
const _=require('lodash')
const {weekSchedule , validateSchedule } = require('../models/weekly-schedule.model');
const {Day,validateDay} = require('../models/days.model');
const { User, validateUser } = require('../models/user-model');
const {Accoprished} =  require('../models/accroplished.model');
const {Todo} =  require('../models/todo.model');



const router = express.Router();

router.get("/weekSchedule", async (req,res)=>{
    
    const Schedule =await weekSchedule.find();
    return res.send(Schedule);
});

router.post("/weekSchedule", async(req,res)=>{

    var { error } = validateSchedule(req.body);
    if(error) return res.send(error.details[0].message).status(203);
 
    
    await User.findOne({_id: req.body.userId})
     .then(user => {
         theUser = user
     }).catch(err => res.status(404).send(err))

    //  //finding the maximum index
    //  Accoprished.find({userId: req.body.userId})
    //   .then(foundUser =>{
    //        console.log(foundUser._id);
    //   })
    //   .catch(err=> console.log(err))

    //finding the day existance in db
     await Day.findOne({ dayName: req.body.eventDay })
     .then(day=>{
    eventScheduleDay = day

    let newSchedule = new weekSchedule();

    newSchedule.userId = req.body.userId;
    newSchedule.eventName = req.body.eventName;
    newSchedule.eventStartTime = req.body.eventStartTime;
    newSchedule.eventEndTime = req.body.eventEndTime;
    newSchedule.eventDay = day._id;
    newSchedule.eventIndex = 0;

    newSchedule.save()
    .then(Schedule => res.send({
        user_id: Schedule.userId,
        event_name: Schedule.eventName,
        eventDay: day.dayName,
        start_time: Schedule.eventStartTime,
        end_time: Schedule.eventEndTime,
    }).status(201))
    .catch(err => res.send('Error in postingn: ',err).status(203));
        
     })
     .catch(err=>{
       
         return res.send("Day not found",err)
     })
     
     
    })

   router.delete('/remove/:id', async(req,res)=>{
      
       await weekSchedule.findByIdAndRemove(req.params.id)
       .then(response => {
        res.send(response).status(200)})
       .catch(err => res.send(err).status(404))

   })

router.get("/weekSchedule/:id", async (req, res) => {
    console.log("in there...");
    let sched = []
   await weekSchedule.find({ userId: req.params.id }).sort()

    var statusCounter = 0;
    await weekSchedule.find({ userId: req.params.id })
   .then(foundSchedule => {
    for(let j=0; j<foundSchedule.length; j++){

    if(foundSchedule[j].eventStatus == 0){    
    statusCounter++;
    }
    }
})
.catch(err => res.send(err).status(400))

console.log("Status counter*###: "+statusCounter);

   await weekSchedule.find({ userId: req.params.id }).sort({_id:1})
   .then(Schedule =>{
        for(let i=0; i<Schedule.length; i++){
            // if(Schedule[i].eventStatus == 1){
            console.log("Status*: ",Schedule[i].eventStatus);
          
         if(Schedule[i].eventStatus == 1)
             Day.findById({ _id: Schedule[i].eventDay })
             .then(dayInText=>{
                sched.push({
                    _id: Schedule[i]._id,
                    eventName: Schedule[i].eventName,
                    eventStartTime: Schedule[i].eventStartTime,
                    eventEndTime: Schedule[i].eventEndTime,
                    dayName: dayInText.dayName,
                    dayAbbr: dayInText.dayAbbr,
                    eventStatus: Schedule[i].eventStatus
                })
                console.log("Status***: ",Schedule[i].eventStatus);
                
                if(sched.length == Schedule.length-statusCounter)  return  res.send(sched).status(200)
                
            }).catch(err =>{
                res.send(err).status(404)
            })
    
    
      
    }
    }).catch(err =>{
        res.send(err).status(404)
    })
});


router.get('/weekSchedule/edit-schedule/:id',async(req,res)=>{
   await weekSchedule.findById({_id: req.params.id})
    .then(editSchedule => {
        Day.findById({ _id: editSchedule.eventDay })
        .then(schedule => res.send({
            eventName: editSchedule.eventName,
            eventDay: schedule.dayName,
            eventStartTime: editSchedule.eventStartTime,
            eventEndTime: editSchedule.eventEndTime
        }).status(200))
        .catch(err => res.send(err).status(404))
    })
    .catch(err => res.send(err).status(404))
})


router.post('/weekSchedule/update-schedule/:id', async(req,res)=>{
    await weekSchedule.findById({_id:req.params.id})
    .then(updatableSchd => {
        Day.findOne({dayName: req.body.eventDay})
           .then(updatableEventDay => {

                updatableSchd.eventName = req.body.eventName;
                updatableSchd.eventDay = updatableEventDay._id;
                updatableSchd.eventStartTime = req.body.eventStartTime;
                updatableSchd.eventEndTime = req.body.eventEndTime;

                updatableSchd.save()
                .then(updated => res.send({
                    _id: updated._id,
                    eventName:updated.eventName,
                    eventStartTime: updated.eventStartTime,
                    eventEndTime: updated.eventEndTime,
                    eventDay: updated.eventDay

                }).status(201))
                .catch(err => res.send(err).status(400))

            })
           
    })
    .catch(err => res.send(err).status(404))
})

router.post('/weekSchedule/accoprished/:id',async(req,res)=>{
      
       // Accoplished
         
    //    let accoplished_before = await Accoprished.findOne({scheduleId: req.params.id});
    //    if(accoplished_before) return res.send("Schedule was Accoplished before").status(400);

        let user = await User.findOne({_id: req.body.userId})
        if(!user) return res.send("User not found").status(404);
        
        var TheWeekSchedule = await weekSchedule.findById(req.params.id);
        if(!TheWeekSchedule) return res.send('Schedule not found').status(404);
        
  
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate(); 
      let hour = date.getHours();
      let min = date.getMinutes();
      let secs = date.getSeconds();

      let time = hour+":"+min+":"+secs;
    

      let accoprishe_date = day+"-"+month+"-"+year;

      var accpr =  new Accoprished();
      accpr.userID = user._id;
      accpr.scheduleId = req.params.id;
      accpr.accoprished_date = accoprishe_date;
      accpr.accoprished_time = time;


    let scdl =  await weekSchedule.findById({_id:req.params.id})
    if(!scdl) return res.send("Schedule not found").status(404);
   
    scdl.eventStatus = 0;
    scdl.save();    
   
      accpr.save()
       .then(accopri => {
       
       return  res.send(accopri).status(201)
    })
       .catch(err => {
           return res.send(err).status(403)

       })       

})


//get  accoplished tasks
router.get('/weekSchedule/accoprished/:id',async(req,res)=>{

    let sched = []
    // await weekSchedule.find({ userId: req.params.id }).sort()
 
     var statusCounter = 0;
     await weekSchedule.find({ userId: req.params.id })
    .then(foundSchedule => {
     for(let j=0; j<foundSchedule.length; j++){
 
     if(foundSchedule[j].eventStatus == 1){    
     statusCounter++;
     }
     }
 })
 .catch(err => res.send(err).status(400))
 
 console.log("Status counter*###: "+statusCounter);
    // var accoplished
    await weekSchedule.find({ userId: req.params.id }).sort({eventIndex:1})
    .then(Schedule =>{
         for(let i=0; i<Schedule.length; i++){
             // if(Schedule[i].eventStatus == 1){
             console.log("Status*: ",Schedule[i].eventStatus);
           
          if(Schedule[i].eventStatus == 0)
              Day.findById({ _id: Schedule[i].eventDay })
              .then(dayInText=>{
                var accoplished = Accoprished.find({scheduleId: Schedule[i]._id})
             
                
                    sched.push({
                        _id: Schedule[i]._id,
                        eventName: Schedule[i].eventName,
                        eventStartTime: Schedule[i].eventStartTime,
                        eventEndTime: Schedule[i].eventEndTime,
                        dayName: dayInText.dayName,
                        dayAbbr: dayInText.dayAbbr,
                        eventStatus: Schedule[i].eventStatus,
                        accoprished_date: accoplished.accoprished_date,
                        accoprished_time: accoplished.accoprished_time
                    })
                    console.log("Status***: ",Schedule[i].eventStatus);
                    
                    if(sched.length == Schedule.length-statusCounter)  return  res.send(sched).status(200)
               
                 
             }).catch(err =>{
                 res.send(err).status(404)
             })
     
     
       
     }
     }).catch(err =>{
         res.send(err).status(404)
     })
})

//accoplished data
router.get('/weekSchedule/accoprishedData/:id',async(req,res)=>{

 
   
    await Accoprished.find({scheduleId: req.params.id })
    .then(accop =>{
        // res.send({
        //     accoprished_time:accop.accoprished_time,
        //     accoprished_date:accop.accoprished_date
        // }).status(200);
        res.send(accop).status(200);
     }).catch(err =>{
         res.send(err).status(404)
     })
})

//resetting schedule controller
router.post('/weekSchedule/re-set-schedule/:id',async(req,res)=>{
    await weekSchedule.findById({_id:req.params.id})
    .then(updatableSchd => {
      
                updatableSchd.eventName = updatableSchd.eventName;
                updatableSchd.eventDay = updatableSchd.eventDay;
                updatableSchd.eventStartTime = updatableSchd.eventStartTime;
                updatableSchd.eventEndTime = updatableSchd.eventEndTime;
                updatableSchd.eventStatus = req.body.eventStatus;
                updatableSchd.eventIndex = 1;

                updatableSchd.save()
                .then(updated => res.send({
                    _id: updated._id,
                    eventName:updated.eventName,
                    eventStartTime: updated.eventStartTime,
                    eventEndTime: updated.eventEndTime,
                    eventDay: updated.eventDay,
                    eventStatus: updated.eventStatus

                }).status(201))
             
           
    })
    .catch(err => res.send(err).status(404))
 

})

//To do Controller

//post todo api
router.post('/weekSchedule/todo',async(req,res)=>{
    let taskname = req.body.taskName;
    if(taskname==="Task Name"){
        console.log("Task Name.....")
        return res.send({
            taskName: req.body.taskName,
            statusCode: 400
        }).status(400)
    }

    let user = await User.find({_id: req.body.userId});
    if(!user) return res.send("User not found").status(404);

    await Todo.findOne({taskName:req.body.taskName})
    .then(taskExist => {
        if(taskExist.user_id ===  req.body.userId){
        return res.send({
            taskName:taskExist.taskName,
            status: taskExist.status,
            indext: taskExist.index,
            statusCode:400
        }).status(400)
            
        }
        else{
            let newTask = new Todo();
        newTask.user_id = req.body.userId;
        newTask.taskName = req.body.taskName;
        newTask.status = req.body.status;
        newTask.index = req.body.index;
 
        newTask.save()
        .then(savedTask => res.send({
            taskName:savedTask.taskName,
            status:savedTask.status,
            index:savedTask.index,
            statusCode:200
        }).status(200))
        .catch(err => res.send(err).status(400))
        }
      }
    )
    .catch(notFound =>{
        let newTask = new Todo();
        newTask.user_id = req.body.userId;
        newTask.taskName = req.body.taskName;
        newTask.status = req.body.status;
        newTask.index = req.body.index;
 
        newTask.save()
        .then(savedTask => res.send({
            taskName:savedTask.taskName,
            status:savedTask.status,
            index:savedTask.index,
            statusCode:200
        }).status(200))
        .catch(err => res.send(err).status(400))
    })
    
 
       
     
})

//update todo api
router.post('/weekSchedule/UpdateTodo',async(req,res)=>{
    //  console.log("updating wow.......***");
     
     let user = await User.find({_id: req.body.userId});
     if(!user) return res.send("User not found").status(404);

    //   console.log("TaskName: ..."+req.body.taskName);
     await Todo.findOne({taskName:req.body.taskName})
    .then(taskExisted => {
        console.log("User Id"+taskExisted.user_id );
        if(taskExisted.user_id === req.body.userId){
       
            console.log("Task Id are the same*** "+taskExisted.user_id );
           taskExisted.user_id = req.body.userId;
           taskExisted.taskName = req.body.taskName;
           taskExisted.status = req.body.status;
           taskExisted.index = req.body.index;

           taskExisted.save()
           .then(savedTask => res.send(savedTask).status(200))
           .catch(err => res.send(err).status(400))
            
       }
     else{
         return res.send("Task Not found").status(404);
     }
    })
    .catch(err => res.send(err).status(400))

          
})

//get todo api
router.get('/weekSchedule/todo/:id',async(req,res)=>{
    let user = await User.find({_id:req.params.id});
    if(!user) return res.send("User not found").status(404);

    Todo.find({user_id:req.params.id}).sort({index:1})
    .then(tasks => res.send(tasks).status(200))
    .catch(err => res.send(err).status(400))
})

//deleting task from to do
router.delete('/weekSchedule/todo/removeTask/:userId/:taskName',async(req,res)=>{
    console.log("Deleting...");
   
    Todo.findOne({ 
        user_id: req.params.userId,
        taskName: req.params.taskName
      })
      .remove()
      .exec()
      .then(removed => {
        console.log("Deleted!!!");  
        res.send(removed).status(200)})
      .catch(err => res.send(err).status(400))
})


module.exports = router;
