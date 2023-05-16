const mongoose = require("mongoose");
const medicalRecord = require('../models/MedicalRecord');
const path = require('path');
const user = require('../models/User');
const bcrypt = require('bcrypt');
const express = require('express');
const Hospital = require("../models/Hospital");
const HospitalService = require("../models/HospitalService");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const multer = require('multer');
require('dotenv');

require('dotenv').config();
const nodemailer = require('nodemailer');
const _ = require('lodash');
const speakeasy = require('speakeasy');

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


//let the pc access less secured websites
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Define a secret key for JWT
const secretKey = 'mysecretkey';
const EMAIL_SECRET = 'mysecretemail';

//creating transporter (the sender of the email verification)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Upload imageProfile
const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/userProfile')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

});
exports.ProfileImage = multer({ storage: storageProfile }).array('file', 1);

exports.addImageToUserProfile = async (req, res) => {
    try {
        const  {userId}= req.params
        const User = await user.findById(userId);
        if (!User) {
            return res.status(404).json({ message: "user not found !" })
        }
        
        if (req.files) {
            User.image="";
            req.files.forEach((file) => {
                User.image=file.originalname;
            });   
            User.save();
            res.status(200).json(User);
        } 
        else {
            res.status(400).json({ message: "No files uploaded" });
        }

    } catch (error) {
        res.status(500).json(error.message);
    }

}

//update patient profile 
exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.userId;
        const patientBefore = await user.findById(patientId);
        const emailBefore = patientBefore.email;
        const emailAfter = req.body.email;
        console.log(patientId);
        const userFound = await user.find({ email: emailAfter, _id: { $ne: patientId } });
        if (userFound.length > 0) {
            console.log("email used");
            return res.status(400).json({ message: 'Email already in use' });
        } else {
            if (emailBefore !== emailAfter) {
                // Send email verification link to patient
                transporter.sendMail({
                    to: emailBefore,
                    subject: 'Email changement',
                    html: `<p>Your email has changed from ${emailBefore} to ${emailAfter}</p>`,
                });
                console.log("email sent successfully");
            }
            const updatePatient = await user.findByIdAndUpdate(patientId, req.body);
            res.json(updatePatient);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};


// //Send : mobile verifications : 
exports.sendSms = async (req, res) => {
    try {
        const phone = req.body.phone;
        const userId = req.params.userId;
        const userNumber = await user.findById(userId);
        userNumber.phoneNotVerif = phone;
        const crypto = require('crypto');
        const code = crypto.randomInt(1000000);
        userNumber.code = code;
        await userNumber.save();
        setTimeout(expirationCode = () => {
            userNumber.code = "";
            userNumber.save();
        }, 29999);
        client.messages.create({
            body: `Your OTP is ${code}`,
            from: process.env.PHONE_NUMBER_TWILIO,
            to: `+${phone}`
        }).then(res.json(console.log(code)))

    } catch (error) {
        res.status(500).json(error.message);
    }
}


//Receive : mobile verification : 
exports.verifNumber = async (req, res) => {
    try {
        const codeEnter = req.body.codeEnter;
        const userId = req.params.userId;
        const userNumber = await user.findById(userId);
        if (userNumber.code == codeEnter) {
            userNumber.phoneNumber = userNumber.phoneNotVerif
            await userNumber.save();
            res.json(console.log("number verified !"));

        } else {
            res.status(400).json({ error: "wrong confirm code" })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}


//updateDoctorPassword 
exports.updateUserPassword = async (req, res) => {
    try {
        const oldPassword = req.body.oldPassword;
        const userId = req.params.userId;
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;
        const updatedUser = await user.findById(userId);
        console.log(updatedUser);
        bcrypt.compare(oldPassword, updatedUser.password).then((match) => {
            if (!match) {
                res.status(400).json({ error: "Wrong password !" })
            } else {
                if (newPassword == confirmNewPassword) {
                    bcrypt.hash(newPassword, 10).then((hashedNewPassword) => {
                        updatedUser.password = hashedNewPassword;
                        res.json("password updated ! ")
                        updatedUser.save();
                    })
                } else {
                    res.status(400).json({ error: "wrong confirm password" })
                }
            }
        })

    } catch (err) {
        res.status(500).json(err.message);
    }
}


//get user by id : 
exports.getUserById = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const userSearched = await user.findById(idUser);
        res.json(userSearched);
    } catch (err) {
        res.status(500).json(err.message);
    }
}


//getHospitals List
exports.getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//getHospitalService List
exports.getHospitalServicesByHospitalId = async (req, res) => {
    const { hospitalId } = req.params;
    try {
        const services = await HospitalService.find({ Hospital: hospitalId });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//getAppointments List
exports.getAppointmentsByHospitalServicesId = async (req, res) => {
    const { hospitalServiceId } = req.params;
    try {
        const appointments = await Appointment.find({ HospitalService: hospitalServiceId });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//takeAppointment
exports.takeAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { patientId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        const patient = await user.findById(patientId);
        console.log(patient)
        const doctor = await Doctor.findOne({ Appointments: appointmentId });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" })
        }
        appointment.Patient = patientId;
        patient.Appointments.push(appointment._id);
        doctor.Patients.push(patientId);
        patient.Doctors.push(doctor._id);
        await appointment.save();
        await patient.save();
        await doctor.save();

        res.json({ message: "Appointment taken successfully", appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/// function will be deleted after the test  
/// add appointment function : 
exports.addAppointments = async (req, res) => {
    try {
        const idPatient = req.params.idPatient;
        const { Titre, Date, Heure, Notes } = req.body;
        const addedAppointment = await Appointment.create({ Titre, Date, Heure, Notes, Patient: idPatient });
        const patientOfAppointment = await user.findById(idPatient);
        patientOfAppointment.Appointments.push(addedAppointment);
        patientOfAppointment.save();
        console.log(patientOfAppointment);
        if (!addedAppointment) {
            throw new Error("error while adding appoitment in the data base ");
        }
        res.json(addedAppointment)
    } catch (err) {
        res.status(500).json(err.message)
    }
}

//getAppointmentByIdPatient 
exports.getAppointmentByIdPatient = async (req, res) => {
    try {
        const idPatient = req.params.idPatient;
        const patient = await user.findById(idPatient);

        const appointments = patient.Appointments;
        const populatedAppointments = await Promise.all(appointments.map(async appointmentId => {
            const appointment = await Appointment.findById(appointmentId);
            return appointment;
        }));
        res.json(populatedAppointments);
    } catch (error) {
        res.status(500).json(error.message)
    }
}


//Serach for appointment : 
exports.searchForAppointmentByTitle = async (req, res) => {
    try {
        const titleEntered = req.body.titleEntered;
        const appointmentExist = await Appointment.find({ Titre: titleEntered })
        if (appointmentExist.length == 0) {
            res.json("appointment doesn't exist !")
        } else {
            res.json(appointmentExist);

        }
    } catch (error) {
        res.status(500).json("appointment doesn't exist")
    }
}

//Sort for appointment :  
exports.sortForAppointment = async (req, res) => {
    try {
        const listAppointment = await Appointment.find();
        const typeSort = req.body.typeSort;
        if (typeSort == "asc") {
            const listAppointmentAsc = listAppointment.sort((app1, app2) => new Date(app1.date) - new Date(app2.date));
            console.log(listAppointmentAsc)
            res.json(listAppointmentAsc)
        }
        else if (typeSort == "desc") {
            const listAppointmentDesc = listAppointment.sort((app1, app2) => new Date(app2.date) - new Date(app1.date));
            console.log(listAppointmentDesc)
            res.json(listAppointmentDesc)
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//patient delete his id from the appointment 
exports.deleteAppointmentFromPatient = async (req, res, next) => {
    try {
        const idPatient = req.params.idPatient;
        const idAppointment = req.params.idAppointment;
        const appointment = await Appointment.findById(idAppointment);
        appointment.Patient = null;
        const patient = await user.findById(idPatient);
        const listAppointment = patient.Appointments.filter(p => p._id != idAppointment);
        patient.Appointments = listAppointment;
        appointment.save();
        patient.save();
        res.json(listAppointment);
    } catch (error) {
        next(error);
    }
};


//notification before 1h of appointment 
exports.notificationBeforeTheAppointment = async (req, res) => {
    try {
        let exist = false
        const idpatient = req.params.idPatient;
        const patient = await user.findById(idpatient);
        const listAppointment = patient.Appointments;
        for (const a of listAppointment) {
            let appointment = await Appointment.findById(a);
            if (appointment) {
                let hours = (((Math.abs((appointment.Date.getTime()) - Date.now()))) - 3600000.) / 36e5;
                if (hours <= 1) {
                    exist = true;
                    res.json("you have a appointment after " + Math.trunc(hours * 60) + " minute ")
                }
            }

        }
        if (exist == false) {
            res.json("no appointment available !")
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
}


exports.getDoctorList = async (req, res) => {
    try {
        const patientId = req.body.patientId;
        const patient = await Patient.findById(patientId);
        const doctorsListId = patient.Doctors;
        var doctors = [];

        const promises = doctorsListId.map(async (d) => {
            var doctorInfo = await Doctor.findById(d);
            doctors.push(doctorInfo);
        });
        await Promise.all(promises);
        res.json(doctors);
        console.log(doctors);
    } catch (error) {
        res.status(500).json(error.message);
    }
};



exports.sendemailbeforeappointment = async (req, res) => {
    //remind the patient of the appointment


// Retrieve all appointments that are scheduled for tomorrow
const tomorrow = moment().add(1, 'days').startOf('day');

Appointment.find({ Date: { $gte: tomorrow.toDate(), $lt: moment(tomorrow).endOf('day').toDate() } })
  .populate('Patient')
  .then((appointments) => {
    for (const appointment of appointments) {
      const patient = appointment.Patient;
      console.log(appointment.Patient); // Check the value of appointment.Patient
      console.log(patient); // Check the value of patient

      // Send the email
      transporter.sendMail({
        to: patient.email,
        subject: 'Appointment Reminder',
        html: `<p>Hello ${patient.name},</p><p>This is a reminder that you have an appointment tomorrow at ${appointment.Heure}.</p><p>Please make sure to arrive on time and bring any necessary documents or information.</p><p>Thank you for choosing our services.</p>`,
      });

      console.log(`Appointment reminder sent to ${patient.email}`);
    }
  })
  .catch((err) => {
    console.error(err);
  });
}

exports.sendemailForMeet=async(req,res)=>{
    const {email,doctor,id}= await req.params;
    // Send the email
    transporter.sendMail({
        to:email,
        subject: 'Doctor meeting',
        html: `<p>The doctor, ${doctor} has sent you this link to have a meeting. Please click on this link to join: <a>https://meet.jit.si/${id}</a></p>`,
      });

      console.log(`Appointment reminder sent to ${email}`);
}