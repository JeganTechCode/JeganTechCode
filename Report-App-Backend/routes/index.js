const express = require('express');
const router = express.Router();

const userControllers = require('../userController/controller');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/uploads', express.static('uploads'));

router.post('/api/v1/register', userControllers.Register);
router.post('/api/v1/login', userControllers.Login);
router.post('/api/v2/createPatient',  userControllers.createPatient);
router.get('/api/v2/listOfPatients', userControllers.listOfPatients);
router.get('/api/v2/getPatient/:patientId', userControllers.SpecificPatient);
router.post('/api/v2/updatePatient/:patientId', userControllers.UpdateAPatient);
router.post('/api/v2/deletePatient/:patientId', userControllers.DeleteAPatient);
router.get('/api/v2/downloadFile/:fileName', userControllers.Download);

module.exports = router;
