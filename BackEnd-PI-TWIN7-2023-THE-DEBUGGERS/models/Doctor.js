const mongoose=require('mongoose');
const User=require('./User');
const Schema=mongoose.Schema;


const DoctorSchema = new mongoose.Schema({
    WorkTime:{
    type:[Date] ,    
    },
    IsValidated:{
      type:Boolean,
      defaultValue:false
    },
    Patients:[{
      type:Schema.Types.ObjectId,
      ref:"Patient"
    }],
    MedicalRecord:[{
      type:Schema.Types.ObjectId,
      ref:"MedicalRecord"
    }],
    Prescriptions:[{
      type:Schema.Types.ObjectId,
      ref:"Prescription"
    }],
    Notifications:[{
      type:Schema.Types.ObjectId,
      ref:"Notification"
    }],
    Chats:[{
      type:Schema.Types.ObjectId,
      ref:"Chat"
    }],
    Appointments:[{
      type:Schema.Types.ObjectId,
      ref:"Appointment"
    }],
    Service:{
      type:Schema.Types.ObjectId,
      ref:"HospitalService"
  },
  hospital:{
    type:Schema.Types.ObjectId,
    ref:"Hospital"
}
  });

  const Doctor = User.discriminator('Doctor', DoctorSchema);

  module.exports=Doctor;