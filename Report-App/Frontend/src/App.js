import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PatientDetails from './pages/PatientDetails';
import AdminRegistration from './pages/AdminRegistration';
import Login from './pages/Login';
// import PatientList from './PatientList';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/PatientDetails" element={<PatientDetails />} />
      <Route path="/register" element={<AdminRegistration />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
  );
};

export default App;
