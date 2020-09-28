const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/users-account', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('connected to mongodb successfully....'))
.catch(err =>console.log('Failed to connect to mongodb!',err));
 
//Connecting Node and MongoDB
require('./user-model');
require('./days.model');
require('./accroplished.model');
require('./weekly-schedule.model');
require('./todo.model');
require('./avatars.model');