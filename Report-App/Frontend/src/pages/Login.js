import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import '../cssStyle/Login.css';
import configuration from '../config/config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${configuration.localhostBackend}/api/v1/login`, formData);

      if (response.data.status === true) {
        // Assuming the server returns a JWT token
        const token = response.data.user;
        // Store the token in localStorage
        console.log(localStorage.setItem('token', token));
        localStorage.setItem('token', token);

        // Redirect to the patient details page
        // window.location.href = '/PatientDetails';
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="">
      <div className='container'>
        <div className='row min-vh-100 align-items-center'>
          <div className='col login-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit">Login</button>

              {/* Link to the registration page */}
              <p>
                Don't have an account?{' '}
                <Link to="/register">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
