import React, { useState } from 'react';
import Draggable from 'react-draggable';
const OmrComponent = ({boundaryRef}) =>{

    const [omrs,setOmrs]= useState([

    
    ]);
    const omrRefs = React.useRef({});

          const addOmr = () => {
        setOmrs((prevomrs) => [
          ...prevomrs,
          { id: Date.now(), top: 300, left: 300,name: `omrs ${prevomrs.length + 1}`,size:16,color:"white"},
        ]);
      };

      const removeOmr = (setOmrs,fieldId) => {
        setOmrs((prevomrs) => prevomrs.filter((field) => field.id !== fieldId));
      };
      const handleOmrDrag = (inputId, e, data) => {

        const boundaryRect = boundaryRef.current.getBoundingClientRect();
        const boundaryX = boundaryRect.left;
        const boundaryY = boundaryRect.top;
        const fieldRect = omrRefs.current[inputId].getBoundingClientRect();
        const fieldX = fieldRect.left;
        const fieldY = fieldRect.top;
        let newX = data.x + fieldX - boundaryX;
        let newY = data.y + fieldY - boundaryY;
        newX = Math.floor(newX/2);
        newX = newX*2;
        newY = Math.floor(newY/2);
        newY = newY*2; 
        setOmrs((prevFields) =>
          prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
        );
      };

      const scaleFactor = 0.1;

      const handleWheelOmr = (event, input) => {
        event.preventDefault();
    
        const newInputs = omrs.map((prevInput) => {
          if (prevInput.id === input.id) {
            const newSize = event.deltaY < 0 ? prevInput.size * (1 + scaleFactor) : prevInput.size * (1 - scaleFactor);
    
            return { ...prevInput, size:newSize };
          } else {
            return prevInput;
          }
        });
    
        setOmrs(newInputs);
      };

      const handleDoubleClickOmr =(input) =>{

        const newInputs = omrs.map((prevInput) => {
          if (prevInput.id === input.id) {
            let col="white";
            if(input.color==="white")col="black";
    
    
            return { ...prevInput, color:col };
          } else {
            return prevInput;
          }
        });
    
        setOmrs(newInputs);
        
      }



      return (
<>
{omrs.map((omr) => (
          <div
            key={omr.id}
            ref={(element) => (omrRefs.current[omr.id] = element)}
            style={{ position: 'absolute', left: omr.left, top: omr.top }}
            className="field-container"
          >
            <Draggable
              position={{ x: 0, y: 0 }}
              onStop={(e, data) => handleOmrDrag(omr.id, e, data)}
            >
              <div onDoubleClick={()=>handleDoubleClickOmr(omr)} 
              onWheel={(event)=> handleWheelOmr(event,omr)} className="omr-box">
              <div className='circle' style={{width:omr.size,height:omr.size,backgroundColor:omr.color}} ></div>
              </div>
            </Draggable>





            <div
              className="remove-btn"
              onClick={() => removeOmr(setOmrs,omr.id)}
              title="Remove omr"
            >
              &#10005;
            </div>
          </div>
        ))}

    <button onClick={addOmr} className="add-omr-btn">
            Add OMR Btn
        </button>
</>


        
      );




}

export default OmrComponent;