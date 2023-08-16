// PersonalDetailsForm.js
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './PersonalDetailsForm.css';
import EditableField from './EditableField';
import DownloadPDF from './DownloadPDF'; 
const PersonalDetailsForm = () => {
  const [fields, setFields] = useState([
    { id: Date.now() + 1, top: 100, left: 100, name: 'Field 1' },
    { id: Date.now() + 2, top: 200, left: 200, name: 'Field 2'},
    { id: Date.now() + 3, top: 300, left: 300, name: 'Field 3'}
  ]);

const [inputs,setinputs]= useState([
{id:Date.now()+4 ,top:250,left:250,name:'input1',size:5},
{id:Date.now()+5 ,top:300,left:300,name:'input2',size:5}

]);


const [omrs,setOmrs]= useState([
  {id:Date.now()+6 ,top:400,left:250,name:'omrs1'},
  
  ]);


  const boundaryRef = React.useRef(null);
  const fieldRefs = React.useRef({});
  const inputRefs = React.useRef({});
  const omrRefs = React.useRef({});
  const addField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), top: 100, left: 100, name: `Field ${prevFields.length + 1}`, numBoxes: 5 },
    ]);
  };
  const addBox = () => {
    setinputs((previnputs) => [
      ...previnputs,
      { id: Date.now(), top: 300, left: 300,name: `input ${previnputs.length + 1}`, size: 5 },
    ]);
  };

  const addOmr = () => {
    setOmrs((prevomrs) => [
      ...prevomrs,
      { id: Date.now(), top: 300, left: 300,name: `omrs ${prevomrs.length + 1}`},
    ]);
  };

  const removeField = (setFields,fieldId) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
  };

  const removeOmr = (setOmrs,fieldId) => {
    setOmrs((prevomrs) => prevomrs.filter((field) => field.id !== fieldId));
  };


  
  const handleFieldDrag = (fieldId, e, data) => {
    const boundaryRect = boundaryRef.current.getBoundingClientRect();
    const boundaryX = boundaryRect.left;
    const boundaryY = boundaryRect.top;
    const fieldRect = fieldRefs.current[fieldId].getBoundingClientRect();
    const fieldX = fieldRect.left;
    const fieldY = fieldRect.top;
    let newX = data.x + fieldX - boundaryX;
    let newY = data.y + fieldY - boundaryY;
    newX = Math.floor(newX/20);
    newX = newX*20;
    newY = Math.floor(newY/20);
    newY = newY*20;

    setFields((prevFields) =>
      prevFields.map((field) => (field.id === fieldId ? { ...field, top: newY, left: newX } : field))
    );
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

    setinputs((prevFields) =>
      prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
    );
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
    newX = Math.floor(newX/20);
    newX = newX*20;
    newY = Math.floor(newY/20);
    newY = newY*20;
    setOmrs((prevFields) =>
      prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
    );
  };

  const handleFieldNameChange = (fieldId, newName) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === fieldId ? { ...field, name: newName } : field))
    );
  };
  const generate = (size)=>{
    const inx=[];

    for(let x=0;x<size;x++){
      inx.push(<td></td>)
    }
    return inx;
  }

  const addcells = (setinputs,inputId)=>{
    setinputs((prevFields) =>
    prevFields.map((input) => {
      if (input.id === inputId) {
        if (input.size + 1 > 10) {
          alert("max value of input box size is 10!");
          return { ...input, size: 10 };
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

  return (
    
    <div className="form-container">
      <div ref={boundaryRef} id="print-this" className="form-boundary">
        {fields.map((field) => (
          <div
            key={field.id}
            ref={(element) => (fieldRefs.current[field.id] = element)}
            style={{ position: 'absolute', left: field.left, top: field.top }}
            className="field-container"
          >
            <Draggable
              position={{ x: 0, y: 0 }}
              onStop={(e, data) => handleFieldDrag(field.id, e, data)}
            >
              <div className="field-box">
                <EditableField
                  initialValue={field.name}
                  onSave={(newName) => handleFieldNameChange(field.id, newName)}
                />
              </div>
            </Draggable>
            <div
              className="remove-btn"
              onClick={() => removeField(setFields,field.id)}
              title="Remove Field"
            >
              &#10005;
            </div>
          </div>
        ))}

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
              <div className="cell-box" >
                <table className='roll '>
                  <tr>
                    {generate(inputs.size)}
                  </tr>
                </table>
              </div>
            </Draggable>
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
        ))}


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
              <div className="omr-box">
              <div className='circle'></div>
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







      </div>
      <button onClick={addField} className="add-btn">
        Add Field
      </button>
      <button onClick={addBox} className="add-box-btn">
        Add InputBox
      </button>
      <button onClick={addOmr} className="add-omr-btn">
        Add OMR Btn
      </button>
      <DownloadPDF />
    </div>
  );
};

export default PersonalDetailsForm;
