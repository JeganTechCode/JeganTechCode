import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../cssStyle/AdminRegistration.css'; // Import your CSS file
import configuration from '../config/config';

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData:', formData);

    try {
      const response = await axios.post(
        `${configuration.localhostBackend}/api/v1/register`,
        formData,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json', // Example of an additional header
            // Add more headers as needed
          },
        }
      );

      console.log('Registration successful:', response.data);
      // Handle success, redirect or show a success message
    } catch (error) {
      console.error('Error registering admin:', error);
      // Handle error, show an error message
    }
  };


  return (
    <div className="">
      <div className='container'>
        <div className='row min-vh-100 align-items-center'>
          <div className='col admin-registration-container'>
            <h2>Admin Registration</h2>
            <form className="registration-form">
             

              {Object.entries(formData).map(([field, value]) => (
                <div key={field} className="form-group">
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                  class="form-control"
                    type={field.includes('password') ? 'password' : 'text'}
                    id={field}
                    name={field}
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <button type="submit" onClick={handleSubmit}>
                Register
              </button>
              <p>
                Do you have an account? <Link to="/">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
