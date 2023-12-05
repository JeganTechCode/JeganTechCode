import React, { useState, useEffect } from 'react';
import axios from 'axios';
import configuration from '../config/config';
import '../cssStyle/PatientDetails.css';

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [formDatas, setFormDatas] = useState({
    PatientName: '',
    Age: '',
    Address: '',
    DateOfBirth: '',
    PhoneNumber: '',
    EmailAddress: '',
    BloodGroup: '',
  });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log(localStorage.getItem('token'));
    fetchPatients();
  }, [searchQuery]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${configuration.localhostBackend}/api/v2/listOfPatients`);
      const filteredPatients = response.data.patients.filter((patient) =>
        patient.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.BloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.EmailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.PhoneNumber.includes(searchQuery.toLowerCase()) ||
        patient.Address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.DateOfBirth.includes(searchQuery.toLowerCase())
      );


      setPatients(filteredPatients);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormDatas((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  console.log(formDatas.DateOfBirth.split('T')[0]);
  const handleCreatePatient = async () => {
    try {
      const formData = new FormData();
      formData.append('fileUpload', file);
      formData.append('PatientName', formDatas.PatientName);
      formData.append('Age', formDatas.Age);
      formData.append('Address', formDatas.Address);
      formData.append('DateOfBirth', formDatas.DateOfBirth);
      formData.append('PhoneNumber', formDatas.PhoneNumber);
      formData.append('EmailAddress', formDatas.EmailAddress);
      formData.append('BloodGroup', formDatas.BloodGroup);

      if (editingPatientId !== null) {
        await axios.post(`${configuration.localhostBackend}/api/v2/updatePatient/${editingPatientId}`, formData);
        setEditingPatientId(null);
      } else {
        await axios.post(`${configuration.localhostBackend}/api/v2/createPatient`, formData);
      }

      resetFormData();
      fetchPatients();
    } catch (error) {
      console.error('Error creating/updating patient:', error);
    }
  };

  const handleEditPatient = (patientId) => {
    setEditingPatientId(patientId);
    const selectedPatient = patients.find((patient) => patient._id === patientId);
    if (selectedPatient) {
      setFormDatas(selectedPatient);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await axios.post(`${configuration.localhostBackend}/api/v2/deletePatient/${patientId}`);
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const resetFormData = () => {
    setFormDatas({
      PatientName: '',
      Age: '',
      Address: '',
      DateOfBirth: '',
      PhoneNumber: '',
      EmailAddress: '',
      BloodGroup: '',
    });
    setFile(null);
  };


  const downloadFile = async (fileId) => {
    // try {
    //   const response = await axios.get(`${configuration.localhostBackend}/api/v2/downloadFile/${fileId}`, {
    //     responseType: 'blob', // Important for handling binary data
    //   });

    //   // Create a link element to simulate a click and trigger the download
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(new Blob([response.data]));
    //   link.download = response.headers['content-disposition'].split('filename=')[1];
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error('Error downloading file:', error);
    // }


    const fileName = fileId.file.filename;
    const downloadUrl = `${configuration.localhostBackend}/api/v2/downloadFile/${fileId._id}`;

    fetch(downloadUrl)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });

  };

  const handleDownloadFile = (patient) => {
    console.log('patient---', patient);
    if (patient.file && patient) {
      const fileId = patient;
      downloadFile(fileId);
    }
  };

  const reloadPage = ()=>{
    window.location.reload();
  }

  return (
    <div className="patient-details-container container">

      <div className='d-flex flex-lg-row flex-column new-section-top-design mb-3'>
        <h2>Patient Details</h2>
        <div className='ms-auto'>
          <div class="input-group ">
            <span className="input-group-text"><i className="fa fa-search"></i></span>
            <input
              type="text"
              className=""
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

      </div>


      {patients && patients.length > 0 ? (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Date Of Birth</th>
              <th>Phone Number</th>
              <th>Email Address</th>
              <th>Blood Group</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.PatientName}</td>
                <td>{patient.Age}</td>
                <td>{patient.Address}</td>
                <td>{patient.DateOfBirth.split('T')[0]}</td>
                <td>{patient.PhoneNumber}</td>
                <td>{patient.EmailAddress}</td>
                <td>{patient.BloodGroup}</td>
                <td>
                  {patient.file && (
                    <>
                      {/* <button>
                        <a href={patient.file.path} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </button>
                      {' | '} */}
                      <button onClick={() => handleDownloadFile(patient)}>Download</button>
                    </>
                  )}
                </td>
                <td className='d-flex gap-1'>
                  <button onClick={() => handleEditPatient(patient._id)}>Edit</button>
                  <button className='bg-danger' onClick={() => handleDeletePatient(patient._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading patients...</p>
      )}

      <div className="form-container">
        <h3>{editingPatientId ? 'Edit Patient' : 'Create New Patient'}</h3>


        <form class="row g-3">
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">Patient Name</label>
            <input type="text" class="form-control" id="inputEmail4" name="PatientName"
              value={formDatas.PatientName}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputPassword4" class="form-label">Age</label>
            <input type="number" class="form-control" id="inputPassword4" name="Age" value={formDatas.Age} onChange={handleInputChange} />
          </div>
          <div class="col-12">
            <label for="inputAddress" class="form-label">Address</label>
            <input type="text" class="form-control" id="inputAddress" name="Address"
              value={formDatas.Address}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputAddress2" class="form-label">Date of Birth</label>
            <input type="date" class="form-control" id="inputAddress2" placeholder="DD/MM/YY" name="DateOfBirth"
              value={formDatas.DateOfBirth.split('T')[0]}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputCity" class="form-label">Phone Number</label>
            <input type="number" class="form-control" id="inputCity" name="PhoneNumber"
              value={formDatas.PhoneNumber}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputCity" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="inputCity" name="EmailAddress"
              value={formDatas.EmailAddress}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputCity" class="form-label">Blood Group</label>
            <input type="text" class="form-control" id="inputCity" name="BloodGroup"
              value={formDatas.BloodGroup}
              onChange={handleInputChange} />
          </div>
          <div class="col-md-6">
            <label for="inputCity" class="form-label">File Upload</label>
            <input type="file" class="form-control" id="inputCity" name="file" onChange={handleFileUpload} />
          </div>

          <div class="col-12">
            <button type="submit" class="btn btn-primary" onClick={handleCreatePatient}>
              {editingPatientId ? 'Update' : 'Create'}</button>
          </div>
          
        </form>
        <br />
        <div class="col-12 col-md-1">
            <button class="col-12 col-md-8" onClick={reloadPage}>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bootstrap-reboot" viewBox="0 0 16 16">
                <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" />
                <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" />
              </svg>
            </button>
          </div>
      </div>
    </div>
  );
};

export default PatientDetails;
