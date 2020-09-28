const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {avatar,validateAvatar} = require('../models/avatars.model');


router.post('/add-avatar',async(req,res)=>{
     let {error} = validateAvatar(req.body);
     if(error) return res.send(error.details[0].message).status(400);

    //  let avatar = await avatar.find({avatarName: req.body.avatarName});
    //  if(avatar) return (res.send("avatar exist").status(400));

    //  let avatarIndex = await avatar.find({avatarIndex: req.body.avatarIndex});
    //  if(avatarIndex)  return res.send("Avatar index exist").status(400);
     

     let newAvatar = new avatar();
     newAvatar.avatarName = req.body.avatarName;
     newAvatar.avatarIndex = req.body.avatarIndex;
     newAvatar.save()
     .then(avatar =>  res.send(avatar).status(200))
     .catch(err => res.send(err).status(201))
})

router.get('/get-avatars',(req,res)=>{
    console.log("getting....");
    avatar.find().sort({avatarIndex:1})
    .then(avatar => res.send(avatar).status(200))
    .catch(err => res.send(err).status(404))
})
module.exports = router;