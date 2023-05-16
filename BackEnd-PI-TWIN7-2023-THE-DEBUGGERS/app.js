var createError = require('http-errors');
var express = require('express');
const http=require('http');
var cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken')
var logger = require('morgan');
const mongoose=require('mongoose');
var authRoutes = require('./routes/authRoutes');
const { requireAuth } = require('./middlewares/authMiddleware');
require ('dotenv').config();
const user =require('./models/User');
const moment = require('moment');
var medicalRecordRouter=require('./routes/medicalRecord');
var patientRouter=require('./routes/patientRouter');
var doctorRouter=require('./routes/doctorRouter');
var messageRoute=require('./routes/messageRoute');
const signUpRouter=require('./routes/signUp');
var chatRouter=require('./routes/chatRouter')
var HospitalRouter=require('./routes/Hospital');
var prescriptionRouter=require('./routes/prescription');
var serviceRouter = require('./routes/service');
var adminRouter = require('./routes/adminDash');
var indexRouter=require('./routes/index');
var appointmentRouter=require('./routes/AppointmentRoute');
var AccountStatusRouter=require('./routes/status')
const session = require('express-session');
const cors = require('cors');
const Chat = require('./models/Chat');

const {sendAppointmentReminders} =require('./controllers/EmailReminder'); 
const cron = require('node-cron');


var app = express();



app.use(cors());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

//connection to db
mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
.then(()=>{console.log('connected to DB')})
.catch((err)=>{console.log(err.message)});

console.log()
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');


// app.get('/', (req, res) => res.send('Home Page'));
app.get('/doctor', requireAuth, (req, res) => {
  if (req.userRole !== 'doctor') {
    res.send('Home Page');
  } else {
    res.send('Doctor Space');
  }
});
app.get('/patient', requireAuth, (req, res) => {
  if (req.userRole !== 'patient') {
    res.send('Home Page');
  } else {
    res.send('Patient Space');
  }
});

/////les paths des routes 
app.use('/',indexRouter)
app.use(authRoutes);  //pour appellé les methode dans authRoutes
app.use('/signup',signUpRouter);
app.use('/MedicalRecord', medicalRecordRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/hospital',HospitalRouter);
app.use('/service', serviceRouter);
app.use('/admin', adminRouter );
app.use('/appointment',appointmentRouter);
app.use('/chat',chatRouter)
app.use('/message',messageRoute)
app.use('/prescription',prescriptionRouter)
app.use('/accountStatus',AccountStatusRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

//creation du serveur
const server=http.createServer(app);
server.listen(5000,()=>{
  console.log("app is running on port 5000");
})

//socket io 
const io=require("socket.io")(server,{ 
  pingTimeout:60000,
  cors:{ 
    origin:"http://localhost:3000",
  }
})


io.on("connection", (socket)=>{ 
console.log("connected to socket.io");
socket.on("setup",(userData)=>{ 
  socket.join(userData._id);
  console.log(userData._id)
  socket.emit("connected");
})
socket.on('join chat',(room)=>{ 
  socket.join(room); 
  console.log("user joined room "+ room );
})
socket.on("new message",(newMessageReceived)=>{ 

  var  Chat=newMessageReceived.chat ; 
  Chat.users.forEach(user=>{
    if (user._id!==newMessageReceived.sender._id) { 
      console.log("after")
      socket.in(user._id).emit("message received",newMessageReceived)
    }
  })
})
})


// Schedule the function to run every day at 9am
cron.schedule('26 15 * * *', () => {
  console.log('Sending appointment reminders...');
  sendAppointmentReminders();
});







