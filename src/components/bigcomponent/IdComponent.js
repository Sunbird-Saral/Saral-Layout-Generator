import React, { useState } from 'react';
import Draggable from 'react-draggable';


const IdComponent = ({boundaryRef}) =>{

    const [inputs,setinputs]= useState([

        ]);
        const inputRefs = React.useRef({});
        const addBoxes = () => {
            setinputs((previnputs) => [
              ...previnputs,
              { id: Date.now(), top: 575, left: 900,name: `input ${previnputs.length + 1}`, size: 1, width:20,height:20 },
            ]);
          };
          const removeField = (setFields,fieldId) => {
            setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
          };
          const handleInputDrag = (inputId, e, data) => {

            const boundaryRect = boundaryRef.current.getBoundingClientRect();
            const boundaryX = boundaryRect.left;
            const boundaryY = boundaryRect.top;
            const fieldRect = inputRefs.current[inputId].getBoundingClientRect();
            const fieldX = fieldRect.left;
            const fieldY = fieldRect.top;
            let newX = data.x + fieldX - boundaryX;
            let newY = data.y + fieldY - boundaryY;
            newX = Math.floor(newX/2);
            newX = newX*2;
            newY = Math.floor(newY/2);
            newY = newY*2;     
            setinputs((prevFields) =>
              prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
            );
          };
          const generate = (size,box)=>{
            const inx=[];
        
            for(let x=0;x<size;x++){
              inx.push(<td  style={{width:box.width , height:box.height ,transition: 'width 0.3s, height 0.3s'}}  ></td>)
            }
            return inx;
          }
          const addcells = (setinputs,inputId)=>{
            setinputs((prevFields) =>
            prevFields.map((input) => {
              if (input.id === inputId) {
                if (input.size + 1 > 20) {
                  alert("max value of input box size is 20!");
                  return { ...input, size: 20 };
                } else {
                  return { ...input, size: input.size + 1 };
                }
              } else {
                return input;
              }
            })
          );
          }
        
          const removecells = (setinputs,inputId)=>{
            setinputs((prevFields) =>
            prevFields.map((input) => {
              if (input.id === inputId) {
                if (input.size - 2 <0) {
                  alert("min value of input box size is 1!");
                  return { ...input, size: 1 };
                } else {
                  return { ...input, size: input.size - 1 };
                }
              } else {
                return input;
              }
            })
          );
          }

          const scaleFactor = 0.1;
          const handleWheel = (event, input) => {
        
            event.preventDefault();
        
            const newInputs = inputs.map((prevInput) => {
              if (prevInput.id === input.id) {
                const newWidth = event.deltaY < 0 ? prevInput.width * (1 + scaleFactor) : prevInput.width * (1 - scaleFactor);
                const newHeight = event.deltaY < 0 ? prevInput.height * (1 + scaleFactor) : prevInput.height * (1 - scaleFactor);
        
                return { ...prevInput, width: newWidth, height: newHeight };
              } else {
                return prevInput;
              }
            });
        
            setinputs(newInputs);
          };

          return (

            <>
            {inputs.map((inputs) => (
          <div
            key={inputs.id}
            ref={(element) => (inputRefs.current[inputs.id] = element)}
            style={{ position: 'absolute', left: inputs.left, top: inputs.top }}
            className="field-container"
          >
            <Draggable
              position={{ x: 0, y: 0 }}
              onStop={(e, data) => handleInputDrag(inputs.id, e, data)}
            >
              <div className="cell-box"  >
                <table className='roll '>
                  <tr onWheel={(event)=> handleWheel(event,inputs)}>
                    {generate(inputs.size,inputs)}
                  </tr>
                </table>
              </div>
            </Draggable>
            <div className='input-feat-buttons'>
            <div
              className="remove-btn"
              onClick={() => removeField(setinputs,inputs.id)}
              title="Remove Field"
            >
              &#10005;
            </div>

            <div
              className="add-cell-btn"
              onClick={() => addcells(setinputs,inputs.id)}
            >
              &#43;
            </div>
            <div
              className="remove-cell-btn"
              onClick={() => removecells(setinputs,inputs.id)}
            >
              &#10005;
            </div>
            </div>
            
          </div>
        ))}
    <button onClick={addBoxes} className="add-box-btn">
        Add InputBox
      </button>
            
            </>
          );


}

export default IdComponent;