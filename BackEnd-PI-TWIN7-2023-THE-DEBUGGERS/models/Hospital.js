const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;
const SuperAdmin = require("../models/SuperAdmin")

const HospitalSchema = new mongoose.Schema({

    AdminEmail: {
        type: String,
        required: true,
        unique: true,
        match: /^Admin\.[a-zA-Z0-9]+@gmail\.com$/,
    },
    PasswordAdmin:
    {
        type: String,
        required: true,
    },
    HospitalName:
    {
        type: String,
        required: true,
    },
    HospitalAddress:
    {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: String,
        required: true,
    },
    Complaints: [{
        type: Schema.Types.ObjectId,
        ref: "Complaint"
    }],

    Appointments: [{
        type: Schema.Types.ObjectId,
        ref: "Appointment"
    }],
    HospitalServices: [{
        type: Schema.Types.ObjectId,
        ref: "HospitalService"
    }]

    
});


HospitalSchema.statics.login = async function (AdminEmail, PasswordAdmin) {            //compare email and password to login
    const admin = await this.findOne({ AdminEmail })
    if (!admin) {
        throw Error("incorrect admin email");
    }
    const auth = await bcrypt.compare(PasswordAdmin, admin.PasswordAdmin);

    if (auth) {
        return admin;
    } else {
        throw Error("incorrect admin password");
    }
}

const Hospital = mongoose.model('Hospital', HospitalSchema);
module.exports = Hospital;