const express=require('express'); 
const router=express.Router(); 
const medicalRecordControlleur =require('../controllers/medicalRecordController'); 

router.post("/add",medicalRecordControlleur.ImagingReports,medicalRecordControlleur.addMedicalRecord);
////update medical record
router.put("/update/:medicalRecordId",medicalRecordControlleur.ImagingReports,medicalRecordControlleur.updateMedicalRecord); 


/////update files to medical record 
router.put("/addImagingReports/:medicalRecordId",medicalRecordControlleur.ImagingReports,medicalRecordControlleur.addFilesToImaginReports)
router.put("/addLaboratoryReports/:medicalRecordId",medicalRecordControlleur.LaboratoryReports,medicalRecordControlleur.addFilesToLaboratoryReports)
router.put("/addMedicalHistory/:medicalRecordId",medicalRecordControlleur.MedicalHistory,medicalRecordControlleur.addFilesToMedicalHistory)
router.put("/addInsuranceClaims/:medicalRecordId",medicalRecordControlleur.InsuranceClaims,medicalRecordControlleur.addFilesToInsuranceClaims)
/////////////////////////////////////////
router.delete("/delete/:medicalRecordId",medicalRecordControlleur.deleteMedicalRecord); 
////////////////////////////////////////
router.delete("/deleteFileOfImagingReports/:medicalRecordId/:fileName",medicalRecordControlleur.deleteFileOfImagingReports);
router.delete("/deleteFileOflaboratoryReports/:medicalRecordId/:fileName",medicalRecordControlleur.deleteFileOflaboratoryReports);
router.delete("/deleteFileOfMedicalHistory/:medicalRecordId/:fileName",medicalRecordControlleur.deleteFileOfMedicalHistory);
router.delete("/deleteFileOfInsuranceClaims/:medicalRecordId/:fileName",medicalRecordControlleur.deleteFileOfInsuranceClaims);
///////////////////////////////////////
router.get("/findMedicalRecordById/:MedicalId",medicalRecordControlleur.findMedicalRecordById)
//////////////////////////////////////////
router.get("downloadfile/:fileName",medicalRecordControlleur.downloadFile)

//router.get("/findFile",medicalRecordControlleur.finFileByname)
module.exports = router;