const HospitalModel = require("../models/Hospital")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const AppointmentModel = require("../models/Appointment")
const SuperAdminmodel=require("../models/SuperAdmin")


const addHospitalWithAdmin = async (req, res, next) => {
    try {
        const { AdminEmail, PasswordAdmin, confirmPasswordAdmin, HospitalName, HospitalAddress, PhoneNumber } = req.body

        /////verifier si les parametres sont presents dans req.body
        if (!AdminEmail || !PasswordAdmin || !confirmPasswordAdmin || !HospitalName || !HospitalAddress || !PhoneNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (PasswordAdmin != confirmPasswordAdmin) {
            return res.status(400).json({ message: "Wrong password confirmation !" });
        }

        else {
            bcrypt
                .hash(PasswordAdmin, 10)
                .then((hashedPasswords) => {
                    const newHospital = HospitalModel.create({
                        AdminEmail,
                        PasswordAdmin: hashedPasswords,
                        HospitalName,
                        HospitalAddress,
                        PhoneNumber,
                    });

                    if (!newHospital) {

                        return res.status(400).json({ message: "error while adding Hospital in the DB!" });
                    }
                })
        }
        res.status(200).json("hospital added successfully !")
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}




const getAllHospitals = async (req, res, next) => {
    try {

        const hospitals = await HospitalModel.find();
        if (!hospitals) {
            return res.status(404).json({ message: "Hospitals not found" });
        }
        if (hospitals.length === 0) {
            return res.status(404).json({ message: "list of hospitals is empty !" });
        }
        res.status(200).json(hospitals);

    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getHospitalById = async (req, res, next) => {
    try {
        const { hospitalId } = req.params
        const hospital = await HospitalModel.findById(hospitalId)
        if (!hospital) {
             return res.status(404).json({ message: "Hospital not found" });
            // throw new Error("Hospital not found");
        }
        res.status(200).json(hospital);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}


const updateHospital = async (req, res, next) => {
    try {
        const { hospitalId } = req.params;
        const { AdminEmail,HospitalName, HospitalAddress, PhoneNumber } = req.body;



        /////verifier si les parametres sont presents dans req.body
        if (!AdminEmail  || !HospitalName || !HospitalAddress || !PhoneNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const Hospital = await HospitalModel.findById(hospitalId)
        if (!Hospital) {
            return res.status(404).json({ message: "hospistal not found !" });
        }

        if(Hospital.AdminEmail!==AdminEmail)
        {
            const existingHospital = await HospitalModel.findOne({ AdminEmail: AdminEmail });
            if(existingHospital){
                return res.status(500).json({ message: "email already exist!" });
            }
        }

    
        const updateHospital = await HospitalModel.findByIdAndUpdate(
            hospitalId,
            {
                $set: {
                    AdminEmail,
                    HospitalName,
                    HospitalAddress,
                    PhoneNumber
                },
            },
            { new: true }

        )
        if (!updateHospital) {
            return res.status(400).json({ message: "error while adding Hospital in the DB!" });
        }

        res.status(200).json(updateHospital);
    }
    catch (error) {
        res.status(500).json(error.message);
    }


};


const updatePasswordHospital=async (req,res,next)=>{
    try {
        const { hospitalId } = req.params;
        const { OldPasswordAdmin, PasswordAdmin, confirmPasswordAdmin} = req.body;


            /////verifier si les parametres sont presents dans req.body
        if (!OldPasswordAdmin || !PasswordAdmin || !confirmPasswordAdmin ) {
        return res.status(400).json({ message: "Missing required fields" });
         }

         const Hospital = await HospitalModel.findById(hospitalId)
         if (!Hospital) {
             return res.status(404).json({ message: "hospistal not found !" });
         }

         const isOldPasswordCorrect = await bcrypt.compare(OldPasswordAdmin, Hospital.PasswordAdmin);
         if (!isOldPasswordCorrect) {
             return res.status(401).json({ error: "Incorrect old password !" });
         }
 
 
         if (PasswordAdmin !== confirmPasswordAdmin) {
             return res.status(400).json({ error: "Wrong password confirmation !" });
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPasswordAdmin = await bcrypt.hash(PasswordAdmin, salt);
         const updateHospital = await HospitalModel.findByIdAndUpdate(
            hospitalId,
            {
                $set: {
                   
                    PasswordAdmin: hashedPasswordAdmin,
                    
                },
            },
            { new: true }

        )
        if (!updateHospital) {
            return res.status(400).json({ message: "error while adding Hospital in the DB!" });
        }

        res.status(200).json(updateHospital);


    } 
    catch (error) {
        res.status(500).json(error.message);
    }

}



const deleteHospital = async (req, res, next) => {
    const { hospitalId } = req.params;
    try {
        if (!hospitalId) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const HospitalToDelte = await HospitalModel.findById(hospitalId);
        if (!HospitalToDelte) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const Hospital = await HospitalModel.findByIdAndDelete(hospitalId)
        if (!Hospital) {
            return res.status(400).json({ message: `Hospital not found with id ${hospitalId}` });
        }
        res.status(200).json("Hospital deleted successfully! ")
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};



async function searchByHospitalName(req, res, next) {
    try {
        const { nameHospital } = req.params;
        if (!nameHospital) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hospitals = await HospitalModel.find({ HospitalName: { $regex: new RegExp(nameHospital, 'i') } })


        if (!hospitals) {
            return res.status(404).json({ message: "Hospitals not found" });
        }
        if (hospitals.length === 0) {
            return res.status(404).json({ message: "list of hospitals is empty !" });
        }
        res.status(200).json(hospitals);

    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function calculerNbrHopitaux(req, res, next) {
    try {
        const count = await HospitalModel.countDocuments({});
        res.json({ count: count });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


async function countComplaintsByHospital(req, res, next) {
    try {
        const aggResult = await HospitalModel.aggregate([
            {
                $lookup: {
                    from: 'Complaint',
                    localField: 'Complaints',
                    foreignField: '_id',
                    as: 'complaints',
                }
            },
            {
                $unwind: '$complaints'
            },
            {
                $group: {
                    _id: '$_id',
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    hospital: '$_id',
                    nbrcomplaints: '$count'

                }
            },
        ]);
        res.json(aggResult);
    }
    catch (error) {
        res.status(500).json(error.message);
    }

}

async function hospitalAvecPlusDeRendezVous(req, res, next) {
    try {
        const results = await AppointmentModel.aggregate([
            { $group: { _id: '$hospitalId', totalAppointments: { $sum: 1 } } },
            { $sort: { totalAppointments: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'Hospital',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hospital'
                }
            },
            {
                $unwind: '$hospital'
            },
            {
                $project: {
                    'hospital._id': 0
                }
            }
        ]).exec();
        res.json(results);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}
const addSuperAdmin = async (req, res, next) => {
    try {
        const { SuperAdminEmail, PasswordSuperAdmin, ConfirmPasswordSuperAdmin } = req.body

        if (PasswordSuperAdmin != ConfirmPasswordSuperAdmin) {
            return res.status(400).json({ message: "Wrong password confirmation !" });
        }

        else {
            bcrypt
                .hash(PasswordSuperAdmin, 10)
                .then((hashedPasswords) => {
                    const newSuperAdmin = SuperAdminmodel.create({
                        SuperAdminEmail,
                        PasswordSuperAdmin: hashedPasswords,
                      
                    });

                    if (!newSuperAdmin) {

                        return res.status(400).json({ message: "error while adding new SuperAdmin in the DB!" });
                    }
                })
        }
        res.status(200).json("new SuperAdmin added successfully !")
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}







module.exports = {
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

}

