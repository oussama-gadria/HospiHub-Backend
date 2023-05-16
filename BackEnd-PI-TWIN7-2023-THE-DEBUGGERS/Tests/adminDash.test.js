const { expect } = require('chai');
const assert = require('assert');
const request = require('supertest');
const app = require('../app'); // replace with your own express app
const patient = require('../models/Patient');
// replace with your own user model
describe('getConfirmedPatients', function() {
  it('should return a list of confirmed patients', async function(done) {
    this.timeout(100000); // increase the timeout to 5000ms
    // First, create some test users
    const user1 = new patient({
      email: 'user1@example.com',
      password: 'password1',
      role: 'patient',
      confirmed: true
    });
    const user2 = new patient({
      email: 'user2@example.com',
      password: 'password2',
      role: 'patient',
      confirmed: true
    });
    const user3 = new patient({
      email: 'user3@example.com',
      password: 'password3',
      role: 'patient',
      confirmed: false
    });
    await user1.save();
    await user2.save();
    await user3.save();

    // Next, make a request to get the confirmed patients
    const res = await request(app)
      .get('/admin/getconfirmedpatients')
      .expect(200);

    // Finally, assert that the response contains the correct data
    assert.strictEqual(res.body.length, 2);
    assert.deepStrictEqual(res.body[0].email, 'user1@example.com');
    assert.deepStrictEqual(res.body[1].email, 'user2@example.com');

    // Clean up by deleting the test users
    await patient.deleteMany({
      email: { $in: ['user1@example.com', 'user2@example.com', 'user3@example.com'] }
    });
    done();
  });
});
