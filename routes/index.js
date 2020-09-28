require('../models/mongodb')
const userController = require('../controllers/user-controllers');
const weekScheduleController = require('../controllers/week-schedule.controller')

const config = require('config')
//Import the necessary packages
const express = require('express');

var app = express();
const bodyparser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const dayController = require('../controllers/day.controllers');
const avatarController = require('../controllers/avatar.controller')
const mail = require('../controllers/mail.controller');
const authMiddleWare = require('../middleware/auth');
const notifications = require('../controllers/notifications.controller');

 
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
 
//  if(!config.get("jwtPrivateKey")){
//     console.log('JWT PRIVATE KEY IS NOT DEFINED')
//     process.exit(1)
// } 
//Create a welcome message and direct them to the main page

app.use(cors({
    origin: ["http://localhost:4200"],credentials:true
}))

app.use(session({
     secret: "httttthh",
     resave:false,
     saveUninitialized:true

}))

app.get('/api/pageViews',(req,res)=>{
    if(req.session.page_views){
        req.session.page_views++;
        res.send("You visited page "+req.session.page_views+" Times" ).status(200);
    }
    else{

        req.session.page_views = 1;
        res.send("You visited the page only Once").status(200);
    }
})

app.get('/', (req, res) => {
    res.send('Welcome to our app');
});

//Set the Controller path which will be responding the user actions
app.use('/users',userController);
app.use('/schedule',dayController);
app.use('/schedule/manage/',authMiddleWare,weekScheduleController);
app.use('/schedule/avatar',avatarController);
app.use('/schedule/mail',mail);
app.use('/schedule/notifications',notifications);
// app.use('/api/auth',auth);



//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
 