const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app'); // votre application Express
const MedicalRecord = require('../models/MedicalRecord'); // votre modèle MedicalRecord
//Configurez Chai pour utiliser chaiHttp
chai.use(chaiHttp);

describe('updateMedicalRecord', function () {
    // Vérification
    it('should update the medical record correctly', async () => {
        const medicalRecordId = '1234';
        const updatedMedicalRecord = {
            "gender": "MALE",
            "email": "hamza@gmail.com"
        };
        const res = await chai.request(app)
            .put(`/MedicalRecord/update/${medicalRecordId}`)
            .send(updatedMedicalRecord);

        // Vérifier que la réponse est un objet JSON contenant les données mises à jour du dossier médical
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.gender).to.equal(updatedMedicalRecord.gender);
        expect(res.body.email).to.equal(updatedMedicalRecord.email);

        // etc.

        // Vérifier que les données ont été mises à jour dans la base de données
        const medicalRecordInDb = await MedicalRecord.findById(medicalRecordId);
        expect(medicalRecordInDb).to.be.an('object');
        expect(medicalRecordInDb.gender).to.equal(updatedMedicalRecord.gender);
        expect(medicalRecordInDb.email).to.equal(updatedMedicalRecord.email);

        // etc.
    });
}); 