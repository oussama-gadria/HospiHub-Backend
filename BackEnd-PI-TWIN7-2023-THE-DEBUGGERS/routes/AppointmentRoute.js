const express = require('express');
var router = express.Router();
const {AddWorkTimeAppointment,GetAppointmentsByDoctorId,GetAppointmentsByServiceId,GetAppointmentsByPatientId}=require('../controllers/AppointmentDateTimeController');

router.put('/addApp/:id',AddWorkTimeAppointment);
router.get('/getappbydoc/:id',GetAppointmentsByDoctorId);
router.get('/getappbyserv/:id',GetAppointmentsByServiceId);
router.get('/getappbypatient/:id',GetAppointmentsByPatientId);

module.exports=router;