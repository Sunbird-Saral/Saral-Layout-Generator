import React, { useState } from 'react';
import './Alert.component.css'

const Alert = ({ alertText, closeAlertBox }) => {

  return (
    <div className={alertText !== '' ? "alert": "displayNone"}>
        <span className="closebtn" onClick={closeAlertBox}>&times;</span> 
        <strong>Error:&nbsp;</strong> {alertText}.
    </div>
  );
};

export default Alert;
