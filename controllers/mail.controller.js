
const express = require('express');
var nodemailer = require('nodemailer');

const router = express.Router();

router.post("/comment", (req,res)=>{
    console.log("sending the msg..")
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'inschedule2020@gmail.com',
          pass: '@InSchedule2020'
        }
      });
      
      var mailOptions = {
        from: 'patrick@gmail.com',
        to: 'patrickniyogitare28@gmail.com',
        subject: req.body.userName+' Comment',
        text: "Email: "+req.body.email+" "+req.body.message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send("Email sent").status(200);
})
module.exports = router;