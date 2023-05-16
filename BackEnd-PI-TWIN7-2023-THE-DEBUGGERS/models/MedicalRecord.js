const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const request = require('request');
let countryNames = [];

// request('https://restcountries.com/v3.1/region/africa', function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     const countries = JSON.parse(body);
//     countryNames = countries.map(country => country.name.common);
//   } else {
//     console.log(error);
//   }
// });
const  MedicalRecordSchema=new mongoose.Schema({ 
    gender:{
        type:String, 
        enum:['MALE','FEMALE'],
        //required:true
    }, 
    email:{ 
        type:String,
       // required:true
    },
    country:{ 
        type:String, 
        enum:[  "Algeria",  "Angola",  "Benin",  "Botswana",  "Burkina Faso",  "Burundi",  "Cameroon",  "Cape Verde",  "Central African Republic",  "Chad",  "Comoros",  "Democratic Republic of the Congo",  "Republic of the Congo",  "Cote d'Ivoire",  "Djibouti",  "Egypt",  "Equatorial Guinea",  "Eritrea",  "Eswatini",  "Ethiopia",  "Gabon",  "Gambia",  "Ghana",  "Guinea",  "Guinea-Bissau",  "Kenya",  "Lesotho",  "Liberia",  "Libya",  "Madagascar",  "Malawi",  "Mali",  "Mauritania",  "Mauritius",  "Morocco",  "Mozambique",  "Namibia",  "Niger",  "Nigeria",  "Rwanda",  "Sao Tome and Principe",  "Senegal",  "Seychelles",  "Sierra Leone",  "Somalia",  "South Africa",  "South Sudan",  "Sudan",  "Tanzania",  "Togo",  "Tunisia",  "Uganda",  "Zambia",  "Zimbabwe"]        ,
       // required:true 
    },
    profession:{ 
        type:String, 
      //  required:true,
    },
    civilState:{ 
        type:String, 
        enum:["MARRIED","SINGLE","DIVORCED"],
        //required:true
    }, 
    numberOfChildren:{  
        type :Number , 
       // required:true
    },
    dateOfBirth:{ 
        type:Date , 
       // required:true
    },
    placeOfBirth:{ 
        type:String, 
        enum:["Tunis", "Bizerte", "Nabeul", "Sfax"], 
        //required:true
    },
    bloodGroups:{ 
        type:String, 
        enum:["A","B","AB","O"], 
       // required:true
    },
    weight:{ 
        type:Number, 
       // required:true

    },
    size:{
        type:Number, 
       // required:true
    }, 
    arterialPressure:{ 
        type:Number, 
      //  required:true
    },
    category:{ 
        type:String, 
      //  enum:["Temperature","Blood pressure","Heart rate","Respiratory rate","Oxygen_saturation","Pain"], 
       // required:true
    },
    disease:{ 
        type:String, 
       // enum:["Hypertension","Hypotension","Fever","Tachycardia","Bradycardia","Respiratory diseases","Pain"],
       // required:true
    },
    allergies:{ 
        type:String, 
       // enum:["Anaphylaxis","Asthma","Allergic rhinitis","Food allergies"],
      //  required:true
    },

    ImagingReports:{ 
        type:[String],
      //  required:true
    },

    LaboratoryReports:{
        type:[String],
    },

    MedicalHistory:{
        type:[String],
    },

    InsuranceClaims:{
        type:[String],
    },




    phoneNumber:{ 
        type:String, 
        //required:true
    },
    lastDoctorProvider:{ 
        type:String,
       // required:true
    },
    treatmentPlan:{ 
        type:String, 
        //required:true
    },
    Doctors:[{
        type:Schema.Types.ObjectId,
        ref:"Doctor"
    }],
    Patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
 
})
const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);
module.exports = MedicalRecord;