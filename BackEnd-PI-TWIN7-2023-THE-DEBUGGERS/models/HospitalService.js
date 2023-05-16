const mongoose=require("mongoose");
const Hospital = require("./Hospital");
const Schema=mongoose.Schema;


const HospitalServiceSchema=new mongoose.Schema({
    ServiceName: {
        type: String,
    },
    Description: {
        type: String,
    },
    EmailService: {
        type:String,
    },
  
    Hospital:{
        type:Schema.Types.ObjectId,
        ref:"Hospital"
    },
    Doctors:[{
        type:Schema.Types.ObjectId,
        ref:"Doctor"
    }],
    Appointments:[{
        type:Schema.Types.ObjectId,
        ref:"Appointment"
    }]
});
const HospitalService=mongoose.model("HospitalService",HospitalServiceSchema);
module.exports=HospitalService;