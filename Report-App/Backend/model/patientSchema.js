const mongoose = require('mongoose');

const patientDetailsSchema = new mongoose.Schema({
  PatientName: String,
  Age: String,
  Address: String,
  DateOfBirth: {
    type: Date, 
    required: true,
  },
  PhoneNumber: String,
  EmailAddress: String,
  BloodGroup: String,
  dateTime: Date,
  file: {
    filename: String,
    originalname: String,
    path: String,
   
  },
});

const PatientDetails = mongoose.model('PatientDetails', patientDetailsSchema);

module.exports = PatientDetails;
