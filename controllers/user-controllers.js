const hashPassword=require('../utils/hash')
const _=require('lodash')
const express=require('express')
const Joi=require('joi')
const {User,validate,validateLogin} =require('../models/user-model')
const Accoprished = require('../models/accroplished.model');
const bcrypt = require("bcrypt")
var router =express.Router();
const loggedIn=false;
// const {payment}= require("../models/payment.mode")  
const jwt = require("jsonwebtoken")

const config = require('config');
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;


function jwtSignUser (user) {
    // const ONE_DAY = 60 * 60 * 24 
    // return jwt.sign(user, config.authentication.jwtSecret, {
    //   expiresIn: ONE_DAY
    // })

    const token  =jwt.sign(user,config.get('jwtPrivateKey'))
    return token
  }


router.get('/', async (req,res)=>{
    const users =await User.find().sort({email:1});
    return res.send(users)
});




router.post("/login", async (req, res) => {
   
   const {error} = validateLogin(req.body);
   if(error) {console.log("Error occured "+error.details[0].message); return res.status(404).send( error.details[0].message);}
  
    try {
      let user = await User.findOne({ email: req.body.email })
      if (!user) return res.send({err: "Invalid email or password1"}).status(400)
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) return res.send({err: "Invalid email or password2"}).status(400)
      

      //  loggedIn = true;
    
      user = user.toJSON();
      return res.status(200).send({
        user: user,
        id : user._id,
        status: 200,
        token: jwtSignUser(user)
      })
      //return res.status(200).send(user+user_payment)
    // res.send('You are logging in...').status(200);
    } catch (error) {
      console.log("There is an error"+error);
      return res.status(404).send(error)
    }
  })

router.post('/register', async (req,res)=>{
    const {error}=validate(req.body)
    if(error) return res.send(error.details[0].message).status(400)
    let user=await User.findOne({email:req.body.email})
    if(user) return res.send('User already registered').status(400)

    user =new User(_.pick(req.body,['name','email','password','avatarName']))
    const harshed = await hashPassword(user.password)
    user.password = harshed;
    await user.save();
    return res.send(_.pick(user,['_id','name','email','password','avatarName'])).status(201)
});

// router.get('/non-admin', (req, res) => {
//     User.find({isAdmin:false})
//         .then(user => res.send(user))
//         .catch(err => res.send(err).status(404));
//     });
    // router.get('/admin', (req, res) => {
    //     User.find({isAdmin:true})
    //         .then(user => res.send(user))
    //         .catch(err => res.send(err).status(404));
    //     });

        router.delete('/:id',(req,res)=>{
            User.findByIdAndRemove(req.params.id)
            .then(user => res.send(user))
            .catch(err => res.send(err).status(404));
        })


      

      router.get('/dashboard',(req,res)=>{
        if(!loggedIn){
          return res.status(401).send("Please login");

        }
        return res.status(200).send("Welcome to Super-secrete API");
      })

      
      router.get('/profile/:id', async (req,res)=>{
        // const user =await User.findById({_id: new ObjectId(req.params._id)});
        const user =await User.findById({_id: req.params.id});
        console.log(user);
        return res.send(user);

        
    });

    router.post('/user/update-user',(req,res)=>{
      console.log("Updating...");
      let user = User.findOne({_id:req.body.userId})
      
      if(!user) return res.send("User not found").status(404);

      User.findOne({_id:req.body.userId})
      .then(user => {

        user.name = req.body.userName;
        user.email = user.email;
        user.password = user.password;
        user.avatarName = req.body.avatarName;
        user.save()
        .then(updatedUser => {
          console.log(updatedUser)
          res.send({
          
            name:updatedUser.name,
            avatarName: updatedUser.avatarName
          }).status(200)
        })
        .catch(err => res.send(err).status(400))
        
      })
      .catch(err => res.send(err).status(400))

    })

    
module.exports=router;

