import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create and import the CSS file for styling if needed


const HomePage = () => {
    return (
      <div className="home-container">
        <h1 style={{color:'white'}}>Sunbird FormROIzen</h1>
        <div className="dropdown-menu">
          <Link to="/main">
            <button className='others'>Go to toolbox</button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default HomePage;
  