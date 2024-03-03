import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';
import RectangleDiv from '../bigcomponent/RectangleDiv';
import Alert from './Alert/Alert.component';
import ROIGenerator from './ROIGenerator/ROIGenerator.component';
import './AutoROIFormBuilder.component.css'

function AutoROIFormBuilder() {
  const [ activeStep, setActiveStep ] = useState(0);
  const [formConfig, setFormConfig] = useState({});
  const [dst, setdstImage] = useState('');
  const [imgData, setimgData] = useState('');
  const [alert, setAlert] = useState('')

  function handleDesignComplete (dstImg, imgData, callBack) {
    if(Object.keys(formConfig).length == 0) {
      callBack("Invalid Form design")
      setAlert('Invalid Form design')
    } else {
      callBack(true)
      setdstImage(dstImg);
      setimgData(imgData);
    }
  }

  function setNextStep() {
    setActiveStep(activeStep + 1);
  }

  const setFormJson = (json) => {
    setFormConfig({...formConfig, ...json})
  }

  const closeAlertBox = () => {
    setAlert('')
  }

  const steps = [
    { title: 'Design Layout' },
    { title: 'Mark ROI' }
  ];

  function getSectionComponent() {
    switch(activeStep) {
      case 0: return <RectangleDiv handleDesignComplete={handleDesignComplete} setActiveStep={setNextStep} setFormJson={setFormJson}/>;
      case 1: return <ROIGenerator srcImage={dst} imgData={imgData} formConfigJson={formConfig} notifyError={setAlert}/>;
      default: return null;
    }
  }

  return (
    <div className='container'>
      <h1 className='title'>Welcome to FormROIzen</h1>
      <Stepper
        activeColor="green"
        defaultColor="orange"
        completeColor="green"
        activeTitleColor="black"
        titleFontSize = "20px"
        completeTitleColor="black"
        defaultTitleColor="black"
        circleFontColor="#000"
        completeBarColor="black"
        defaultBarColor="black"
        steps={steps}
        activeStep={activeStep}/>
      <Alert alertText={alert} closeAlertBox={closeAlertBox}></Alert>
      { getSectionComponent()  }
    </div>
  );
}

export default AutoROIFormBuilder;
