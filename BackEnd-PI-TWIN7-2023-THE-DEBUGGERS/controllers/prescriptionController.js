const PrescriptionModel = require("../models/Prescription")
const DoctorModel = require('../models/Doctor')
const PatientModel = require('../models/Patient')
const multer = require('multer');




// Upload ImagingReports
const storagePrescription = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/DoctorSignature')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

});

const DoctorSignature = multer({ storage: storagePrescription }).array('file', 1);

const addPrescriptionwithDoctorAndPatient = async (req, res, next) => {
    try {
        const idDoctor = req.params.idDoctor
        const idPatient = req.params.idPatient
        const { DateOfVisit, Treatments, Instruction, Note } = req.body

        if (!DateOfVisit || !Treatments || !Instruction || !Note) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const doctor = await DoctorModel.findById(idDoctor)
        if (!doctor) {
            return res.status(404).json({ message: "doctor not found !" })
        }

        const Patient = await PatientModel.findById(idPatient)
        if (!Patient) {
            return res.status(404).json({ message: "patient not found !" })
        }


        const newPrescription = await PrescriptionModel.create({
            DateOfVisit,
            Treatments,
            Instruction,
            Note,
            Doctor: idDoctor,
            Patient: idPatient


        });
        if (!newPrescription) {
            return res.status(400).json({ message: "error while adding new prescription in the DB!" })
        }
        return res.status(200).json(newPrescription)
    }

    catch (error) {

        res.status(500).json(error.message);
      
    }

}
const addFileToPrescription = async (req, res) => {
    try {
        const PrescriptionId = req.params.PrescriptionId
        const Prescription = await PrescriptionModel.findById(PrescriptionId);
        if (!Prescription) {
            return res.status(404).json({ message: "prescription not found !" })
        }
        
        if (req.files) {
            req.files.forEach((file) => {
                Prescription.Signature=file.originalname;
            });   
            Prescription.save();
            res.status(200).json(Prescription);
        } else {
            res.status(400).json({ message: "No files uploaded" });
        }



    } catch (error) {
        res.status(500).json(error.message);
    }

}

const deleteFileOfPrescription = async (req, res) => {
    try {
        const { fileName } = req.params;
        const { PrescriptionId } = req.params;
        const Pescription = await PrescriptionModel.findById(PrescriptionId);
        Pescription.Signature=""
        Pescription.save();
        res.json("file deleted successfully !")
    } catch (error) {
        res.status(500).json(error.message);
    }
}


const updatePrescription = async (req, res) => {
    try {
        const { PrescriptionId } = req.params;
        const Prescription = await PrescriptionModel.findById(PrescriptionId);
        if (!Prescription) {
            return res.status(404).json({ message: "prescription not found !" })
        }

        const { DateOfVisit, Treatments, Instruction, Note } = req.body

        // if (!DateOfVisit || !Treatments || !Instruction || !Note) {
        //     return res.status(400).json({ message: "Missing required fields" });
        // }

        const Prescriptionupdated = await PrescriptionModel.findByIdAndUpdate(
            PrescriptionId,
            {
                $set: {
                    DateOfVisit,
                    Treatments,
                    Instruction,
                    Note,

                },
            },
            { new: true }
        )
        if (!Prescriptionupdated) {
            res.status(400).json({ message: "error while updating prescription in the DB!" });
        }
        res.status(200).json(Prescriptionupdated);

    }
    catch (error) {
        res.status(500).json(error.message);
    }
}
const deletePrescription = async (req, res) => {
    const { idPrescription } = req.params
    const Prescription = await PrescriptionModel.findById(idPrescription);
    if (!Prescription) {
        return res.status(404).json({ message: "prescription not found !" })
    }


    const prescriptionDeleted = await PrescriptionModel.findByIdAndDelete(idPrescription)
    if (!prescriptionDeleted) {
        return res.status(400).json({ message: `prescription not found with id ${idPrescription}` });
    }
    res.status(200).json("prescription deleted successfully! ")

}

const getAllPrescriptionsByIdDoctor = async (req, res) => {
    try {
        const { idDoctor } = req.params
        const doctor = await DoctorModel.findById(idDoctor)
        if (!doctor) {
            return res.status(404).json({ message: "doctor not found !" })
        }
        const prescriptions = await PrescriptionModel.find({ Doctor: idDoctor });
        if (!prescriptions) {
            return res.status(404).json({ message: "prescriptions not found" });
        }
        if (prescriptions.length === 0) {
            return res.status(404).json({ message: "list of prescriptions is empty !" });
        }
        res.status(200).json(prescriptions);

    }
    catch (error) {
        res.status(500).json(error.message);
    }

}

const getAllPrescriptionsByIdPatient = async (req, res) => {
    try {
        const { idPatient } = req.params
        const Patient = await PatientModel.findById(idPatient)
        if (!Patient) {
            return res.status(404).json({ message: "patient not found !" })
        }
        const prescriptions = await PrescriptionModel.find({ Patient :idPatient});
        if (!prescriptions) {
            return res.status(404).json({ message: "prescriptions not found" });
        }
        if (prescriptions.length === 0) {
            return res.status(404).json({ message: "list of prescriptions is empty !" });
        }
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(500).json(error.message);
    }


}


const getAllPrescriptionsByIdPatientAndDoctor= async (req, res) => {
    try {
        const { idPatient } = req.params
        const { idDoctor } = req.params
        const Patient = await PatientModel.findById(idPatient)
        if (!Patient) {
            return res.status(404).json({ message: "patient not found !" })
        }
        const doctor = await DoctorModel.findById(idDoctor)
        if (!doctor) {
            return res.status(404).json({ message: "doctor not found !" })
        }



        const prescriptions = await PrescriptionModel.find({ Patient :idPatient,Doctor: idDoctor});
        if (!prescriptions) {
            return res.status(404).json({ message: "prescriptions not found" });
        }
        if (prescriptions.length === 0) {
            return res.status(404).json({ message: "list of prescriptions is empty !" });
        }
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(500).json(error.message);
    }


}
const getPrescriptionByid = async (req, res, next) => {
    try {
        const {id} = req.params
        const prescription = await PrescriptionModel.findById(id)
        if (!prescription) {
             return res.status(404).json({ message: "prescription not found" });
          
        }
        res.status(200).json(prescription);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}




module.exports = {
    addPrescriptionwithDoctorAndPatient,
    addFileToPrescription,
    deleteFileOfPrescription,
    DoctorSignature,
    updatePrescription,
    deletePrescription,
    getAllPrescriptionsByIdDoctor,
    getAllPrescriptionsByIdPatient,
    getAllPrescriptionsByIdPatientAndDoctor,
    getPrescriptionByid


}
