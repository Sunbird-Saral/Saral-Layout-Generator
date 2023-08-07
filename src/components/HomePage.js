import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create and import the CSS file for styling if needed


const HomePage = () => {
    return (
      <div className="home-container">
        <h1 style={{color:'white'}}>Sunbird Saral</h1>
        <div className="dropdown-menu">
          <select>
            <option value="">Select a Page</option>
            <option value="/student">Student Question Table</option>
            <option value="/personal">Personal Details Form</option>
          </select>
          <Link to="/student">
            <button>Go to Student Question Table</button>
          </Link>
          <Link to="/personal">
            <button>Go to Personal Details Form</button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default HomePage;
  