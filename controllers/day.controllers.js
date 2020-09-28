const mongoose = require('mongoose')
const express = require('express');
const {Day , dayValidator } = require('../models/days.model');

const router = express.Router();

router.get("/days", async (req,res)=>{
    const days =await Day.find().sort({index:1});
    return res.send(days);
});

router.post("/days", (req,res)=>{

    var {error } = dayValidator(req.body);
    if(error) return res.send(error.details[0].message).status(203);

   
    let newDay = new Day();

    newDay.dayName = req.body.dayName;
    newDay.dayAbbr = req.body.dayAbbr;
    newDay.index = req.body.index;

    newDay.save()
    .then(day => res.send(day).status(201))
    .catch(err => res.send(err).status(203));
})
module.exports = router;