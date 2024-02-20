import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';
import RectangleDiv from '../bigcomponent/RectangleDiv';
import ROIMarker from './ROIMarker';
import './styles.css'

function FormBuilderRoiGen() {
  const [ activeStep, setActiveStep ] = useState(0);
  const [isDesignComplete, setDesignComplete] = useState(false);
  const [dst, setdstImage] = useState('');
  const [imgData, setimgData] = useState('');

  function handleDesignComplete (dstImg, imgData) {
    console.log("inside design complete")
    setdstImage(dstImg);
    setimgData(imgData);
    setDesignComplete(true);
  }

  const steps = [
    { title: 'Design Layout' },
    { title: 'Mark ROI' }
  ];

  function getSectionComponent() {
    switch(activeStep) {
      case 0: return <RectangleDiv handleDesignComplete={handleDesignComplete}/>;
      case 1: return <ROIMarker srcImage={dst} imgData={imgData}/>;
      default: return null;
    }
  }

  return (
    <div>
      <Stepper
        activeColor="green"
        defaultColor="yellow"
        completeColor="green"
        activeTitleColor="white"
        titleFontSize = "20px"
        completeTitleColor="#B3FF26"
        defaultTitleColor="white"
        circleFontColor="#000"
        completeBarColor="#B3FF26"
        steps={steps}
        activeStep={activeStep}/>
      <div className="step-button">
        { (activeStep !== 0 && activeStep !== steps.length - 1)
            && <button onClick={ () => setActiveStep(activeStep - 1) }>Previous</button>
        }
        { isDesignComplete
          && <button onClick={ () => setActiveStep(activeStep + 1) }>Process Image</button>
        }
      </div>
      { getSectionComponent()  }
    </div>
  );
}

export default FormBuilderRoiGen;
