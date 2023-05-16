const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Service =require ('../models/HospitalService');

const AddWorkTimeAppointment = async (req, res, next) => {
    const { id } = req.params;
    const { WorkTime } = req.body;

    // Check if doctor ID is provided
    if (!id) {
        return res.status(400).json({
            status: 'ERROR',
            message: 'No doctor ID provided'
        });
    }

    // Check if WorkTime is provided
    if (!WorkTime) {
        return res.status(400).json({
            status: 'ERROR',
            message: 'No WorkTime provided in the request body'
        });
    }

    const doctor = await Doctor.findByIdAndUpdate(
        id,
        { $set: { WorkTime: WorkTime } },
        { new: true }
    );

    if (!doctor) {
        return res.status(404).json({
            status: 'ERROR',
            message: `Doctor with ID ${id} not found`
        });
    }

    const appointments = [];

    // Create appointments for each half hour of WorkTime
    for (const date of WorkTime) {
        const [year, month, day] = date.split('-');
        for (let hour = 8; hour <= 13; hour++) {
            for (let minute = 0; minute < 60; minute += 20) {
                const appointmentDate = new Date(year, month - 1, day, hour, minute);

                const existingAppointment = await Appointment.findOne({ Doctor: doctor._id, Date: appointmentDate });

                if (existingAppointment) {
                    console.log(`Appointment already exists for doctor with ID ${id} on date ${date} at ${appointmentDate.toISOString()}`);
                    continue;
                }

                const appointment = await Appointment.create({
                    Doctor: doctor._id,
                    Date: appointmentDate,
                    HospitalService: doctor.Service
                });

                console.log(`Appointment added for doctor with ID ${id} on date ${date} at ${appointmentDate.toISOString()}`);

                appointments.push(appointment._id);
            }
        }
    }

    // Add the appointments to the doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
        id,
        { $set: { Appointments: appointments } },
        { new: true }
    );

    // Add the appointments to the service
    await Service.findByIdAndUpdate(
        doctor.Service,
        { $set: { Appointments: appointments } },
        { new: true }
    );

    return res.json({
        status: 'SUCCESS',
        message: 'Work time and appointments created successfully',
        data: updatedDoctor
    });
};

  



const GetAppointmentsByDoctorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('No doctor ID inserted');
        }
        const appointments = await Appointment.find({ Doctor: id,Patient: { $ne: null }});
        if (appointments.length === 0) {
            throw new Error('No appointments found');
        }
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const GetAppointmentsByServiceId = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('No service ID inserted');
        }
        const appointments = await Appointment.find({ HospitalService: id, Patient: { $ne: null } });
        if (appointments.length === 0) {
            throw new Error('No appointments found');
        }
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const GetAppointmentsByPatientId = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('No patient ID inserted');
        }
        const appointments = await Appointment.find({ Patient: id });
        if (appointments.length === 0) {
            throw new Error('No appointments found');
        }
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { AddWorkTimeAppointment, GetAppointmentsByDoctorId,GetAppointmentsByServiceId ,GetAppointmentsByPatientId};
