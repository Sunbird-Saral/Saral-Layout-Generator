import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';
import RectangleDiv from '../bigcomponent/RectangleDiv';
import ROIMarker from './ROIMarker';
import './styles.css'

function FormBuilderRoiGen() {
  const [ activeStep, setActiveStep ] = useState(0);
  const [formConfig, setFormConfig] = useState({});
  const [dst, setdstImage] = useState('');
  const [imgData, setimgData] = useState('');

  function handleDesignComplete (dstImg, imgData) {
    console.log("inside design complete")
    setdstImage(dstImg);
    setimgData(imgData);
  }

  function setNextStep() {
    setActiveStep(activeStep + 1);
  }

  const setFormJson = (json) => {
    console.log('json', json, formConfig)
    setFormConfig({...formConfig, ...json})
    console.log('forconf', formConfig)
  }

  const steps = [
    { title: 'Design Layout' },
    { title: 'Mark ROI' }
  ];

  function getSectionComponent() {
    switch(activeStep) {
      case 0: return <RectangleDiv handleDesignComplete={handleDesignComplete} setActiveStep={setNextStep} setFormJson={setFormJson}/>;
      case 1: return <ROIMarker srcImage={dst} imgData={imgData} formConfigJson={formConfig}/>;
      default: return null;
    }
  }

  return (
    <div>
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
      { getSectionComponent()  }
    </div>
  );
}

export default FormBuilderRoiGen;
