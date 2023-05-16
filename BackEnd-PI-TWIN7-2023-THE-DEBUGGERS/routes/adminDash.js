const express = require("express");
const router = express.Router();
const {countDoctorValidated ,countPatient , getDoctorsConfirmedValidated , getDoctorsConfirmedNonValidated , validateDoctor , getConfirmedPatients , getPatientByName,getDoctorsConfirmedValidatedbyIdHspital } = require("../controllers/adminDashCont");

router.get("/getdoctorsconfirmedvalidated/:serviceId", getDoctorsConfirmedValidated);
router.get("/getDoctorsConfirmedValidatedbyIdHspital/:hospitalId", getDoctorsConfirmedValidatedbyIdHspital);
router.get("/getdoctorsconfirmednonvalidated/:hospitalId", getDoctorsConfirmedNonValidated);
router.put("/validatedoctor/:doctorId",validateDoctor);
router.get("/getconfirmedpatients", getConfirmedPatients);
router.get("/getpatientbyname/:name", getPatientByName);
router.get("/countpatient", countPatient);
router.get("/countdoctorvalidated", countDoctorValidated);


module.exports = router;
