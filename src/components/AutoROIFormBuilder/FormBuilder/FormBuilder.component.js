import React, { useState } from 'react';
import './FormBuilder.component.css';
import DownloadPDF from './DownloadPDF/DownloadPDF.component';
import OmrComponent from './OMR/Omr.component';
import IdComponent from './ID/Id.component';
import FreeTextComponent from './FreeText/FreeText.component';
import BlackDotComponent from './BlackDot/BlackDot.component';
import EditableTableCell from './EditableTabelCell/EditableTableCell.component';
import Dropdown from '../Dropdown/Dropdown.component';
const FormBuilder = ({handleDesignComplete, setActiveStep, setFormJson, selectedOption, setSelectedOption}) => {
  const [boxes, setBoxes] = useState([{ key:Date.now(), x: 45, y: 45, width: 40, height: 30,textsize:20 }]);

  const boundaryRef = React.useRef(null);



  const [blackdots,setBlackdots]= useState([

    
    ]);

    const updateSharedState = (newValue) => {
      setBlackdots(newValue);
    };


// main table

  const addbox = (oldbox,where) => {
    const newbox = {key:Date.now(), x:oldbox.x,y:oldbox.y,width:oldbox.width,height:oldbox.height,textsize:20};
    if(where==="right"){

      newbox.y +=oldbox.width;
    }
    if(where==="bottom"){
      newbox.x +=oldbox.height;
    }
    
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      newbox 
    ]);
  };
  const removeDiv = (currentbox) => {
    let newlist=[];
    for(let i=0;i<boxes.length;i++){
      if(currentbox.key===boxes[i].key)continue;
      newlist.push(boxes[i]);
    }
    setBoxes(newlist);
  };

  const [initialPos,   setInitialPos] = React.useState(null);
  const [initialSize, setInitialSize] = React.useState(null);
  const [isDesignComplete, setDesignComplete] = useState(false);
  

  const options = ['Landscape', 'Potrait'];

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const initial = (e,box) => {
      
      let resizable = document.getElementsByClassName('box '+box.key)[0];

      setInitialPos(e.clientX);
      setInitialSize(resizable.offsetWidth);
      
  }
  
  const resize = (e,box) => {
      let resizable = document.getElementsByClassName('box '+box.key)[0];

      resizable.style.width = `${parseInt(initialSize) + parseInt(e.clientX - initialPos)}px`;
      let ne = parseInt(resizable.style.width);
      
      ne = Math.floor(ne/10);
      ne = ne*10;
      if(box.y+ne>1230){
        ne = 1230-box.y;
      }
      resizable.style.width =  `${ne}px`;
      for(let i=0;i<boxes.length;i++){
        if(boxes[i]===box){boxes[i].width = ne}
      }

      setBoxes(boxes);
    
  }

  const initialdown = (e,box) => {
      
    let resizable = document.getElementsByClassName('box '+box.key)[0];

    setInitialPos(e.clientY);
    setInitialSize(resizable.offsetHeight);
    
}

const resizedown = (e,box) => {
    let resizable = document.getElementsByClassName('box '+box.key)[0];
    resizable.style.height = `${parseInt(initialSize) + parseInt(e.clientY - initialPos)}px`;
    let ne = parseInt(resizable.style.height);
    ne = Math.floor(ne/10);
    ne = ne*10;
    if(box.x+ne>670){
      ne = 670-box.x;
    }
    resizable.style.height =  `${ne}px`;
    // let curr;
    for(let i=0;i<boxes.length;i++){
      if(boxes[i]===box){boxes[i].height = ne}
    }
    setBoxes(boxes);
  
}

const handleExportComplete = (dstImg, imgData) => {
      handleDesignComplete(dstImg, imgData, (isNoError)=> {
        if(typeof isNoError == 'boolean') {
          setDesignComplete(true)
        }
      });
}

  return (
      <div ref={boundaryRef} className='outer-area'>
      <div  id="print-this" className='area'>
      {boxes.map((box) => (
        <div id="Resizable" key={box.key} className={'box ' + box.key} style={{ width:box.width,height:box.height,top: box.x, left: box.y }}>
                
                <EditableTableCell initialValue={""}/>
                
                <div id = 'Draggable'
                draggable   = 'true'
                onDragStart = {(event)=> initial(event,box)} 
                onDrag      = {(event)=> resize(event,box)}
            />

                <div id = 'Draggable2'
                draggable   = 'true'
                onDragStart = {(event)=> initialdown(event,box)} 
                onDrag      = {(event)=> resizedown(event,box)}
            />
            <div
              className="remove-btn"
              onClick={() => removeDiv(box)}
              title="Remove Field"
            >
              &#10005;
            </div>
          <button onClick={() => addbox(box,"right")} className='add-button right'>+</button>
          <button onClick={() => addbox(box,"bottom")} className='add-button bottom'>+</button>
        </div>
      ))}
      <div className='tool-area'>
      <strong>Form orientation:</strong>
      <p className={`${selectedOption=='Landscape' ? 'rotate' : 'none'} orientation`}>📝</p>
      <Dropdown options={options} onSelect={handleSelect}></Dropdown>
      <OmrComponent boundaryRef={boundaryRef}/>
      <IdComponent boundaryRef={boundaryRef}/>
      <FreeTextComponent boundaryRef={boundaryRef} type="FreeText"/>
      <FreeTextComponent boundaryRef={boundaryRef} setFormJson={setFormJson} type="InputField"/>
      <DownloadPDF boxes={boxes} blackdots={blackdots} setBlackdots={setBlackdots} handleDesignComplete={handleExportComplete} orientationOfForm={selectedOption}/>
      <div><button className={isDesignComplete ? 'download-button': 'button-disabled'} onClick={setActiveStep} disabled={!isDesignComplete}>Generate ROI</button></div>
      </div>
      <BlackDotComponent  blackdots={blackdots} updateblackdots={updateSharedState}/>
    </div>
      </div>
    
  );
};

export default FormBuilder;