import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';
import FormBuilder from './FormBuilder/FormBuilder.component';
import Alert from './Alert/Alert.component';
import ROIGenerator from './ROIGenerator/ROIGenerator.component';
import PublishROI from './PublishROI/PublishROI.component';
import './AutoROIFormBuilder.component.css'

function AutoROIFormBuilder() {
  const [ activeStep, setActiveStep ] = useState(0);
  const [formConfig, setFormConfig] = useState({});
  const [dst, setdstImage] = useState('');
  const [imgData, setimgData] = useState('');
  const [alert, setAlert] = useState('');
  const [selectedOption, setSelectedOption] = useState('Landscape');
  const [roiJson, setRoiJson] = useState({});

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

  function publishROI(roijson) {
    console.log("roi", roijson);
    setRoiJson(roijson);
    setActiveStep(activeStep + 1);
  }

  const setFormJson = (json) => {
    let isSame = false;
    for(let k in formConfig) {
      let compk = Object.keys(json)[0];
      if(k == compk) {
        isSame = true;
        formConfig[k]['count'] = formConfig[k]['count'] + json[compk]['count'];
        formConfig[k]['extractionMethod'] = {...formConfig[k]['extractionMethod'], ...json[compk]['extractionMethod']}
      }
    }

    if(!isSame) {
      setFormConfig({...formConfig, ...json})
    }
  }

  const closeAlertBox = () => {
    setAlert('')
  }

  const steps = [
    { title: 'Design Layout' },
    { title: 'Generate ROI' },
    { title: 'Sync ROI to saral backend'}
  ];

  function getSectionComponent() {
    switch(activeStep) {
      case 0: return <FormBuilder handleDesignComplete={handleDesignComplete} setActiveStep={setNextStep} setFormJson={setFormJson} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>;
      case 1: return <ROIGenerator srcImage={dst} imgData={imgData} formConfigJson={formConfig} notifyError={setAlert} selectedOption={selectedOption} publishROI={publishROI}/>;
      case 2: return <PublishROI roiJson={roiJson}></PublishROI>
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
