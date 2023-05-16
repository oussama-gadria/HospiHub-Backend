const mongoose=require("mongoose"); 
const Schema=mongoose.Schema;
const prescriptionSchema=new mongoose.Schema({ 
    
    DateOfVisit:{ 
        type:Date, 
        required:true
    }, 
    Treatments:{ 
        type:String, 
        required:true
    }, 
    Instruction:{ 
        type:String,
        required:true
    }, 
    Note:{ 
        type:String, 
        required:true
    }, 
    Signature:{ 
        type:String, 
       
    },
    Doctor:{
        type:Schema.Types.ObjectId,
        ref:"Doctor"
    },
    Patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
})
const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;