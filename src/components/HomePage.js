import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create and import the CSS file for styling if needed


const HomePage = () => {
    const [formName, setFormName] = useState('newForm');

    const handleInputChange = (e) => {
      setFormName(e.target.value);
    };
    return (
      <div className="home-container">
        <h1>Welcome to Sunbird FormROIzen</h1>
        <p style={{fontSize: 'large', fontWeight: 'bold', color: 'black'}}>Start desiging a new form !!!</p>
        <lable id="formlabel">Enter Form Name:
        </lable>
        <input type="text" id="formName" value={formName} onChange={handleInputChange}></input>
        <div className="dropdown-menu">
          <Link to={`/main?formName=${encodeURIComponent(formName)}`}>
            <button className='others'>Go to toolbox</button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default HomePage;
  