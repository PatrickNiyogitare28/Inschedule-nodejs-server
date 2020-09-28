const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config')

const Schema = new mongoose.Schema({
   avatarName:{
       type: String,
       required: true
   },
   avatarIndex:{
       type: Number,
       required: true
   }
})

function validateAvatar(avatar){
    const schema = {
        avatarName: Joi.string().required(),
        avatarIndex: Joi.number().required()
    }
    return Joi.validate(avatar,schema);
}

const avatar = mongoose.model('Avatar',Schema);
module.exports.avatar = avatar;
module.exports.validateAvatar = validateAvatar;

