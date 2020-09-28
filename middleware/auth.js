const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// router.post('/jwt/:token',(req,res)=>{
//    const token = req.params.token;
//    console.log("Token: "+token);
//    try{
//         let user = jwt.verify(token,config.get('jwtPrivatekey'))
//         res.send({
//             userId: user._id,
//             username: user.name,
//             email: user.email
//         }).status(200)
           
//     }catch(err){
//         res.send('invalid token').status(400);
//     }
  
  
// })
function auth(req,res,next){
    const token = req.header('x-auth-token')
    console.log(token);
    // if(!token) return res.send('token missing..').status(401)
    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'))
        const user = decoded
        console.log("The header is collect"+JSON.stringify(user))
        next()
    } catch (err) {
       console.log(err) 
       return  res.send(err).status(400)
    }
}
module.exports=auth;
