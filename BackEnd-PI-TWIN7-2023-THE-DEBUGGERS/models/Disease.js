const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const DiseaseSchema=new mongoose.Schema({
 DiseaseName:{type:String},
 DiseaseDescription:{type:String},
DiseasePrecautions:{type:String}
});

const Disease = mongoose.model('Disease', DiseaseSchema);
module.exports=Disease;
  