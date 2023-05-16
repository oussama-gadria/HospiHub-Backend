const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ComplaintSchema=new mongoose.Schema({
    DateofComplaint:Date,
    DoctorName:String,
    ServiceName:String,
    Description:String,
    Status:Boolean,
    Hospital:{
        type:Schema.Types.ObjectId,
        ref:"Hospital"
    },
    Patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
    Doctor:{
        type:Schema.Types.ObjectId,
        ref:"Doctor"
    }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;