const mongoose =require('mongoose')
const Joi=require('joi')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const config=require('config')


var userSchema=new mongoose.Schema({
   
    name:{
        type:String,
        require:true
        
    },
    email:{
        type:String,
        required:true,
        default:true,
        unique: true
    },
    password:{
        required:true,
        type:String
    },
    avatarName:{
        type:String
        
    }

});

userSchema.methods.Token=function(){
    const token=jwt.sign({_id: this._id,name:this.name,email:this.email,password:this.password},config.get('jwtPrivatekey'))
    return token;
}
const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema={
       
        name:Joi.string().max(50).min(3).required(),
        email:Joi.string().min(3).max(100).required(),
        password:Joi.string().required(),
        avatarName:Joi.string()
      
    }
    return Joi.validate(user,schema)
}

function loginValidator(data){
    const schema={
       
        email:Joi.string().min(3).max(20).required(),
        password:Joi.string().required()
      
    }
    return Joi.validate(data,schema)
}

module.exports.User=User
module.exports.validate=validateUser
module.exports.validateLogin=loginValidator