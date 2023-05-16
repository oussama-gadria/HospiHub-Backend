const mongoose = require("mongoose");
const medicalRecord = require('../models/MedicalRecord');
const path = require('path');
const user = require('../models/User');
const bcrypt = require('bcrypt');
const express = require('express');
const nodemailer = require('nodemailer');
const Appointment = require("../models/Appointment");
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTH_TOKEN_TWILIO;
const client = require('twilio')(accountSid, authToken);
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const PDFDocument = require('pdfkit');
const fs = require('fs');


//update Doctors profile 
exports.updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.userId;
        const updateDoctor = await user.findByIdAndUpdate(doctorId, req.body);
        res.json(updateDoctor);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

//Send : mobile verifications : 
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
        client.messages.create({
            body: `Your OTP is ${code}`,
            from: process.env.PHONE_NUMBER_TWILIO,
            to: `${phone}`
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
            userNumber.phoneNumber = userNumber.phoneNotVerif;
            userNumber.code = "";
            userNumber.phoneNotVerif = "";
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

//getAppointments List
exports.getAppointments = async (req, res) => {
    const { doctorId } = req.body;      // bech twali tji m token
    try {
        const appointments = await Appointment.find({ Doctor: doctorId })
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//getAppointmentById
exports.getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointment = await Appointment.findOne({ _id: appointmentId });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//updateAppointment
exports.updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { Date } = req.body;

    try {
        const appointment = await Appointment.findOne({ _id: appointmentId });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }


        appointment.Date = Date || appointment.Date;

        await appointment.save();

        // send email to patient
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: appointment.Patient.email,
            subject: "Appointment Updated",
            text: `Dear ${appointment.Patient.firstName}, your appointment has been updated.`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//validateAppointment
exports.validateAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findOne({ _id: appointmentId });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.isVerified) {
            return res.status(400).json({ message: "Appointment already verified" });
        }

        appointment.isVerified = true;

        await appointment.save();

        // send email to patient
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: appointment.Patient.email,
            subject: "Appointment Updated",
            text: `Dear ${appointment.Patient.firstName}, your appointment has been updated.`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.updateDoctorService=async(req,res)=>{ 
    const doctorId = req.params.userId;
    const doctor = await Doctor.findById(doctorId);
    if (doctor.Service) {
      res.status(400).json({ message: 'Doctor already has a service assigned' });
      return;
    }
    const serviceId = req.params.serviceId;
    const hospitalId = req.params.hospitalId;
    const updateDoctor = await Doctor.findByIdAndUpdate(doctorId, {
      $set: { Service: serviceId,
        hospital: hospitalId},
    }, { new: true });

    res.json(updateDoctor);

}

exports.getDoctorAppointmentsWithLeastPatients= async (req,res) => {
  try {
    const serviceId=req.params.serviceId;
    const appointments1 = await Appointment.find({ HospitalService: serviceId }).populate('Doctor');
    const doctors1 = Array.from(new Set(appointments1.map(appointment => appointment.Doctor)));
    const result = [];
    for (let doctor of doctors1) {
    console.log(doctors1)
      const doctorAppointments1 = appointments1.filter(appointment => appointment.Doctor._id.equals(doctor._id));
      if (doctorAppointments1.every(appointment => !appointment.Patient)) {
        result.push(...doctorAppointments1);
      }
    }
    if (result.length > 0 ) {
        res.status(200).json(result); }
    else {

    const appointments = await Appointment.find({ 'Patient': { $ne: null }, 'HospitalService': serviceId })
      .populate('Doctor')
      .exec();
    
    const doctorCounts = appointments.reduce((acc, appointment) => {
      const doctorId = appointment.Doctor._id.toString();
      if (!acc.hasOwnProperty(doctorId)) {
        acc[doctorId] = 0;
      }
      acc[doctorId]++;
      return acc;
    }, {});
    const doctorsSorted = Object.keys(doctorCounts).sort((a, b) => doctorCounts[a] - doctorCounts[b]);
    let i = 0;
    let doctor = null;
    let doctorAppointments = null;
    while (i < doctorsSorted.length && !doctorAppointments) {
      doctor = await Doctor.findById(doctorsSorted[i]).populate({
        path: 'Appointments',
        match: { 'Patient': null, 'HospitalService': serviceId }
      }).exec();
      if (doctor && doctor.Appointments.length > 0) {
        doctorAppointments = doctor.Appointments;
      }
      i++;
    }
   
      res.status(200).json(doctorAppointments);
   
    
    if (!doctorAppointments) {
      throw new Error('No doctor found with available appointments');
    }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get doctor appointments with least patients.' });

  }

}


exports.getAvailableAppointments = async (req, res) => {
    try {
      const serviceId = req.params.serviceId;
      const appointments = await Appointment.find({ 'Patient': null, 'HospitalService': serviceId }).exec();
      if (appointments.length === 0) {
        throw new Error('No appointments found with the given serviceId ');
      }
      res.status(200).json(appointments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get appointments ' });
    }
  }; 



  exports.getPatientList = async (req, res) => {
    try {
      const doctorId = req.body.doctorId;
      const doctor = await Doctor.findById(doctorId);
      const patientsListId = doctor.Patients;
      var patients = [];
      const promises = patientsListId.map(async (d) => {
        var patientInfo = await Patient.findById(d);
        patients.push(patientInfo);
      });
      await Promise.all(promises);
      res.json(patients);
      console.log(patients);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  exports.PdfFile = async (req, res) => {
    try {
      const prescription = req.body.prescriptionDetails;
      console.log('prescription:', prescription);
  
      // Create a new PDF document
      const doc = new PDFDocument();
  
      // Set the content type to PDF
      res.contentType('application/pdf');
      console.log('contentType:', res.get('Content-Type'));
  
      // Set the response headers to force a download
      res.setHeader('Content-Disposition', 'attachment; filename=prescription.pdf');
      res.setHeader('Cache-Control', 'no-cache');
  
      // Pipe the PDF document to the response
      doc.pipe(res);
  
      // Add the prescription details to the PDF document
      const patientPresc = await user.findById(prescription.Patient);
      const dateString = prescription.DateOfVisit;
const date = new Date(dateString);
const formattedDate = date.toISOString().split('T')[0];
      doc.fontSize(25).text('Prescription', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(12);
      doc.text(`Date of Visit: ${formattedDate}`, { lineGap: 10 });
      doc.text(`Patient Name: ${patientPresc.firstName} ${patientPresc.lastName}`, { lineGap: 10 });
      doc.text(`Treatments: ${prescription.Treatments}`, { lineGap: 10 });
      doc.text(`Instruction: ${prescription.Instruction}`, { lineGap: 10 });
      doc.text(`Note: ${prescription.Note}`, { lineGap: 10 });
      doc.moveDown(2);
      
  
      // Add some styling to the PDF document
 
      doc.fontSize(10).text('Generated by HospiHub', { align: 'right', link: 'http://localhost:3000/' });
  
      // End the document and the response
      doc.end();
      console.log('PDF document generated successfully');
  
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send({ message: 'Error generating PDF document' });
    }
  };
  
  
  