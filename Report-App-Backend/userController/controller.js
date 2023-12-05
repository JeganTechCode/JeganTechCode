const axios = require('axios');
const configuration = require('../config/config');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const PatientDetails = require('../model/patientSchema');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); 
const fs = require('fs');
const uploadDest = './public/Images';
const path = require('path');

const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log(username, email, password, confirmPassword);
    if (!username || !email || !password || !confirmPassword) {
      return res.status(200).json({ error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(200).json({ error: 'Password and confirm password do not match.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(201).json({ error: 'Invalid email address.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(201).json({ error: 'Username is already taken.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(201).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(201).json({ error: 'email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(201).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful.', status: true });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



if (!fs.existsSync(uploadDest)) {
  fs.mkdirSync(uploadDest, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDest);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const handleFileUpload = upload.single('fileUpload');

const createPatient = async (req, res) => {
  try {
    handleFileUpload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      const {
        PatientName,
        Age,
        Address,
        DateOfBirth,
        PhoneNumber,
        EmailAddress,
        BloodGroup,
      } = req.body;

      const newPatient = await PatientDetails.create({
        PatientName,
        Age,
        Address,
        DateOfBirth,
        PhoneNumber,
        EmailAddress,
        BloodGroup,
        dateTime: Date.now(),
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
        },
      });

      res.status(201).json({ success: true, patient: newPatient });
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const listOfPatients = async (req, res) => {
  try {
    const patients = await PatientDetails.find();
    // console.log('patients---', patients);
    res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error('Error listing patients:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const SpecificPatient = async (req, res) => {
  try {
    const patient = await PatientDetails.findById(req.params.patientId);
    if (!patient) {
      return res.status(200).json({ success: false, error: 'Patient not found' });
    }
    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


const handleUpdateFileUpload = upload.single('fileUpload');

const UpdateAPatient = async (req, res) => {
  try {
    handleUpdateFileUpload(req, res, async (err) => {
      console.log('req---', req.file);
      // return false;
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      let fileData = {}; 

      if (req.file) {
        fileData = {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
        };
      }

      const updatedPatient = await PatientDetails.findByIdAndUpdate(
        req.params.patientId,
        {
          ...req.body, 
          file: fileData, 
        },
        { new: true }
      );

      if (!updatedPatient) {
        return res.status(200).json({ success: false, error: 'Patient not found' });
      }

      res.status(200).json({ success: true, patient: updatedPatient });
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const Download = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    console.log('fileName---', fileName);
    const filePath = path.join(__dirname, 'uploads', fileName);

    if (fs.existsSync(filePath)) {
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

     
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      
      res.status(200).json({ success: false, error: 'File not found' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const DeleteAPatient = async (req, res) => {
  console.log(req.params);
  try {
    const deletedPatient = await PatientDetails.findByIdAndDelete(req.params.patientId);
    if (!deletedPatient) {
      return res.status(200).json({ success: false, error: 'Patient not found' });
    }
    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
module.exports = { Register, Login, createPatient, listOfPatients, SpecificPatient, UpdateAPatient, DeleteAPatient,Download };