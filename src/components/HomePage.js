import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create and import the CSS file for styling if needed


const HomePage = () => {
    return (
      <div className="home-container">
        <h1 style={{color:'white'}}>Sunbird Saral</h1>
        <div className="dropdown-menu">

          <Link to="/attendance">
            <button className='others'>Go to Student Question Table</button>
          </Link>
          <Link to="/personal">
            <button className='others'>Go to Personal Details Form</button>
          </Link>
          <Link to="/main">
            <button className='others'>Go to User configurable </button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default HomePage;
  