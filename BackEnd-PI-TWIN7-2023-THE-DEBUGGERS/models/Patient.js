const mongoose=require('mongoose');
const User=require('./User');
const Schema=mongoose.Schema;


const PatientSchema = new mongoose.Schema({
  Complaints:[{
    type:Schema.Types.ObjectId,
    ref:"Complaint"
  }],
  Appointments:[{
    type:Schema.Types.ObjectId,
    ref:"Appointment"
  }],
  Notifications:[{
    type:Schema.Types.ObjectId,
    ref:"Notifications"
  }],
  Chats:[{
    type:Schema.Types.ObjectId,
    ref:"Chat"
  }],
  MedicalRecord:{
    type:Schema.Types.ObjectId,
    ref:"MedicalRecord"
  },
  Doctors:[{
    type:Schema.Types.ObjectId,
    ref:"Doctor"
  }],
  prescription:[{
    type:Schema.Types.ObjectId,
    ref:"Prescription"
}]

});

const Patient = User.discriminator('Patient', PatientSchema);
module.exports=Patient;