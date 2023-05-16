const mongoose=require("mongoose");
const medicalRecord=require('../models/MedicalRecord');
const multer = require('multer');
const user=require('../models/User'); 
const path = require('path');
const fs = require('fs');


// UPLOADS FILES USING MULTER 
// Upload ImagingReports
const storageImagingReports = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/ImagingReports')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
   
  });
  
exports.ImagingReports = multer({ storage: storageImagingReports }).array('file', 10);

// Upload LaboratoryReports
const storageLaboratoryReports = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/LaboratoryReports')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
   
  });
  
exports.LaboratoryReports = multer({ storage: storageLaboratoryReports }).array('file', 10);


// Upload MedicalHistory
const storageMedicalHistory = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/MedicalHistory')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
   
  });
  
exports.MedicalHistory = multer({ storage: storageMedicalHistory }).array('file', 10);



// Upload InsuranceClaims
const storageInsuranceClaims = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/InsuranceClaims')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
   
  });
  
exports.InsuranceClaims = multer({ storage: storageInsuranceClaims }).array('file', 10);






//ADD MEDICAL RECORD FUNCTION 

exports.addMedicalRecord = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { 
            gender, 
            email, 
            country, 
            profession, 
            civilState, 
            numberOfChildren, 
            dateOfBirth, 
            placeOfBirth, 
            bloodGroups, 
            weight, 
            size, 
            arterialPressure, 
            category, 
            disease, 
            allergies, 
            phoneNumber, 
            lastDoctorProvider, 
            treatmentPlan 
        } = req.body;

        // Création d'un nouveau MedicalRecord
        const newMedicalRecord = new medicalRecord({
            gender, 
            email, 
            country, 
            profession, 
            civilState, 
            numberOfChildren, 
            dateOfBirth, 
            placeOfBirth, 
            bloodGroups, 
            weight, 
            size, 
            arterialPressure, 
            category, 
            disease, 
            allergies, 
            phoneNumber, 
            lastDoctorProvider, 
            treatmentPlan 
        });

        if (req.file) {
            newMedicalRecord.files.push(req.file.originalname);
        }

        await newMedicalRecord.save();
        res.json(newMedicalRecord.toObject());  
    } catch(err) { 
        res.status(500).json(err.message);
    }
};



//UPDATE MEDICAL RECORD

exports.updateMedicalRecord=async (req,res)=>{ 
    try{
        const { medicalRecordId}=req.params;
    
        const updatedMedicalRecord=await medicalRecord.findByIdAndUpdate(medicalRecordId,req.body,{new:true}); 
        if(updatedMedicalRecord){
            res.status(200).json(updatedMedicalRecord);
            
        }
        
        if (req.file){ 
            updatedMedicalRecord.files.push(req.file.originalname);
            updatedMedicalRecord.save();

        }
        
    }catch(error){ 
        res.status(500).json(error.message); 
    }   
}
///ADD FILES to imaging reports  :
exports.addFilesToImaginReports=async (req,res)=>{ 
    try{
        const  medicalRecordId=req.params.medicalRecordId;
        const MedicalRecord = await medicalRecord.findById(medicalRecordId);
        if (!MedicalRecord) {
             return res.status(404).json({ message: "MedicalRecord not found" });
            
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
              MedicalRecord.ImagingReports.push(file.originalname);
              
            });
            MedicalRecord.save();
            res.status(200).json(MedicalRecord);
            
          } else {
            res.status(400).json({ message: "No files uploaded" });
          }
    }catch(error){ 
        res.status(500).json(error.message); 
    }   
}


///ADD FILES to laboratory reports  :
exports.addFilesToLaboratoryReports=async (req,res)=>{ 
    try{
        const  medicalRecordId=req.params.medicalRecordId;
        const MedicalRecord = await medicalRecord.findById(medicalRecordId);
        if (!MedicalRecord) {
             return res.status(404).json({ message: "MedicalRecord not found" });
            
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
              MedicalRecord.LaboratoryReports.push(file.originalname);
              
            });
            MedicalRecord.save();
            res.status(200).json(MedicalRecord);
            
          } else {
            res.status(400).json({ message: "No files uploaded" });
          }
    }catch(error){ 
        res.status(500).json(error.message); 
    }   
}


///ADD FILES to  medical history  :
exports.addFilesToMedicalHistory=async (req,res)=>{ 
    try{
        const  medicalRecordId=req.params.medicalRecordId;
        const MedicalRecord = await medicalRecord.findById(medicalRecordId);
        if (!MedicalRecord) {
             return res.status(404).json({ message: "MedicalRecord not found" });
            
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
              MedicalRecord.MedicalHistory.push(file.originalname);
              
            });
            MedicalRecord.save();
            res.status(200).json(MedicalRecord);
            
          } else {
            res.status(400).json({ message: "No files uploaded" });
          }
    }catch(error){ 
        res.status(500).json(error.message); 
    }   
}

///ADD FILES to  insurance  claims  :
exports.addFilesToInsuranceClaims=async (req,res)=>{ 
    try{
        const  medicalRecordId=req.params.medicalRecordId;
        const MedicalRecord = await medicalRecord.findById(medicalRecordId);
        if (!MedicalRecord) {
             return res.status(404).json({ message: "MedicalRecord not found" });
            
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
              MedicalRecord.InsuranceClaims.push(file.originalname);
              
            });
            MedicalRecord.save();
            res.status(200).json(MedicalRecord);
            
          } else {
            res.status(400).json({ message: "No files uploaded" });
          }
    }catch(error){ 
        res.status(500).json(error.message); 
    }   
}




//DELETE MEDICAL RECORD 
exports.deleteMedicalRecord=async (req ,res)=>{ 
    try{ 
        const {medicalRecordId}=req.params; 
        const deleteMedicalRecord=await medicalRecord.findByIdAndDelete(medicalRecordId); 
        res.json(deleteMedicalRecord);
    }catch(error) {
        res.status(500).json(error.message);
    }
} 
 
// DELETE FILES : 
exports.deleteFileOfImagingReports=async (req,res)=>{ 
    try{ 
        const {fileName}=req.params;
        const {medicalRecordId}=req.params; 
        const medicalRecordOfFile=await medicalRecord.findById(medicalRecordId);
        const updatedFiles=medicalRecordOfFile.ImagingReports.filter(file=>file!=fileName);
        medicalRecordOfFile.ImagingReports=updatedFiles; 
        medicalRecordOfFile.save();       
        res.json("file deleted successfully !")
    } catch (error) {
        res.status(500).json(error.message);
    }
}

exports.deleteFileOflaboratoryReports=async (req,res)=>{ 
    try{ 
        const {fileName}=req.params;
        const {medicalRecordId}=req.params; 
        const medicalRecordOfFile=await medicalRecord.findById(medicalRecordId);
        const updatedFiles=medicalRecordOfFile.LaboratoryReports.filter(file=>file!=fileName);
        medicalRecordOfFile.LaboratoryReports=updatedFiles; 
        medicalRecordOfFile.save();       
        res.json("file deleted successfully !")
    } catch (error) {
        res.status(500).json(error.message);
    }
}


exports.deleteFileOfMedicalHistory=async (req,res)=>{ 
    try{ 
        const {fileName}=req.params;
        const {medicalRecordId}=req.params; 
        const medicalRecordOfFile=await medicalRecord.findById(medicalRecordId);
        const updatedFiles=medicalRecordOfFile.MedicalHistory.filter(file=>file!=fileName);
        medicalRecordOfFile.MedicalHistory=updatedFiles; 
        medicalRecordOfFile.save();       
        res.json("file deleted successfully !")
    } catch (error) {
        res.status(500).json(error.message);
    }
}


exports.deleteFileOfInsuranceClaims=async (req,res)=>{ 
    try{ 
        const {fileName}=req.params;
        const {medicalRecordId}=req.params; 
        const medicalRecordOfFile=await medicalRecord.findById(medicalRecordId);
        const updatedFiles=medicalRecordOfFile.InsuranceClaims.filter(file=>file!=fileName);
        medicalRecordOfFile.InsuranceClaims=updatedFiles; 
        medicalRecordOfFile.save();       
        res.json("file deleted successfully !")
    } catch (error) {
        res.status(500).json(error.message);
    }
}

////////////////////////////////////////////////
exports.findMedicalRecordById=async (req,res)=>{ 
    try {
        const { MedicalId } = req.params
        const MedicalRecord = await medicalRecord.findById(MedicalId)
        if (!MedicalRecord) {
             return res.status(404).json({ message: "MedicalRecord not found" });
            // throw new Error("Hospital not found");
        }
        res.status(200).json(MedicalRecord);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}



exports.findFileByName=async(req,res)=>{ 
    try{ 
     const medicalRecordId=req.params.MedicalId; 
    }catch(error){ 

    }
}

///////////////////////////download files 
exports.downloadFile = async (req, res) => {
    try {
      const { fileName } = req.params;
      const filePath = path.join(__dirname, '..', 'uploads','ImagingReports', fileName);
      console.log(filePath)
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }
      
      // Set headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Transfer-Encoding', 'binary');
  
      // Create read stream and pipe to response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };