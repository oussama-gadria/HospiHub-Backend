const express= require("express");
const router= express.Router();
const {validateHospital,validateHospitalwhenUpdate}=require("../middlewares/hospitalValidator");
const
{
    addHospitalWithAdmin,
    updateHospital,
    deleteHospital,
    getAllHospitals,
    getHospitalById,
    calculerNbrHopitaux,
    countComplaintsByHospital,
    hospitalAvecPlusDeRendezVous,
    searchByHospitalName,
    updatePasswordHospital,
    addSuperAdmin
}=require("../controllers/HospitalController")


  
router.post('/addHospitalwithAdmin',validateHospital,addHospitalWithAdmin)
router.post('/addSuperAdmin',addSuperAdmin)
///////////////////////////////////////////////
router.get('/getAllHospitals',getAllHospitals)
router.get('/getHospitalById/:hospitalId',getHospitalById)
router.get('/countHospitals',calculerNbrHopitaux)
router.get('/searchByHospitalName/:nameHospital',searchByHospitalName)
router.get('/hospitalAvecPlusDeRendezVous',hospitalAvecPlusDeRendezVous)
router.get('/countComplaintsByHospital',countComplaintsByHospital)
//////////////////////////////////////////////////
router.put('/updateHospital/:hospitalId',updateHospital)
router.put('/updatePasswordHospital/:hospitalId',updatePasswordHospital)

//////////////////////////////////////////////////
router.delete('/deleteHospital/:hospitalId',deleteHospital)

module.exports=router;