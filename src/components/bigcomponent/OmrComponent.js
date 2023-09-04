import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './OmrComponent.css'
const OmrComponent = ({ boundaryRef }) => {
  const [omrs, setOmrs] = useState([]);
  const omrRefs = React.useRef({});

  const [draggingOmrId, setDraggingOmrId] = useState(null);

  const addOmr = () => {
    setOmrs((prevomrs) => [
      ...prevomrs,
      {
        id: Date.now(),
        top: 100, left: 1250,
        name: `omrs ${prevomrs.length + 1}`,
        size: 16,
        color: "white",
      },
    ]);
  };

  const removeOmr = (setOmrs, fieldId) => {
    setOmrs((prevomrs) => prevomrs.filter((field) => field.id !== fieldId));
  };

  const handleOmrDragStart = (inputId,input) => {
    setDraggingOmrId(inputId);
    handleMouseLeaveOmr(input);

  };

  const handleOmrDragStop = (inputId, e, data) => {
    const boundaryRect = boundaryRef.current.getBoundingClientRect();
    const boundaryX = boundaryRect.left;
    const boundaryY = boundaryRect.top;
    const fieldRect = omrRefs.current[inputId].getBoundingClientRect();
    const fieldX = fieldRect.left;
    const fieldY = fieldRect.top;
    let newX = data.x + fieldX - boundaryX;
    let newY = data.y + fieldY - boundaryY;

    setOmrs((prevFields) =>
      prevFields.map((inputs) =>
        inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs
      )
    );
    setDraggingOmrId(null);
  };

  const scaleFactor = 0.1;

  const handleWheelOmr = (event, input) => {
    event.preventDefault();
    const newInputs = omrs.map((prevInput) => {
      if (prevInput.id === input.id) {
        const newSize =
          event.deltaY < 0
            ? prevInput.size * (1 + scaleFactor)
            : prevInput.size * (1 - scaleFactor);
        return { ...prevInput, size: newSize };
      } else {
        return prevInput;
      }
    });
    setOmrs(newInputs);
  };

  const handleDoubleClickOmr = (input) => {
    const newInputs = omrs.map((prevInput) => {
      if (prevInput.id === input.id) {
        let col = "white";
        if (input.color === "white") col = "black";
        return { ...prevInput, color: col };
      } else {
        return prevInput;
      }
    });
    setOmrs(newInputs);
  };


  const handleMouseEnterOmr = (omr) => {
    const omrContainer = omrRefs.current[omr.id];
    const removeButton = omrContainer.querySelector('.remove-omr-btn');
    console.log(removeButton);
    removeButton.style.opacity = 1;
  };

  const handleMouseLeaveOmr = (omr) => {
    const omrContainer = omrRefs.current[omr.id];
    const removeButton = omrContainer.querySelector('.remove-omr-btn');
    removeButton.style.opacity = 0;
  };

  return (
    <>
      {omrs.map((omr) => (
        <div
          key={omr.id}
          ref={(element) => (omrRefs.current[omr.id] = element)}
          style={{ position: 'absolute', left: omr.left, top: omr.top,zIndex:50 }}
          className="field-container"

        >
          <Draggable
            position={{ x: 0, y: 0 }}
            onStart={() => handleOmrDragStart(omr.id,omr)}
            onStop={(e, data) => handleOmrDragStop(omr.id, e, data)}
          >
            <div
              onDoubleClick={() => handleDoubleClickOmr(omr)}
              onWheel={(event) => handleWheelOmr(event, omr)}
              className="omr-box"
              onMouseEnter={() => handleMouseEnterOmr(omr)}
              onMouseLeave={() => handleMouseLeaveOmr(omr)}
            >
              <div className='circle' style={{ width: omr.size, height: omr.size, backgroundColor: omr.color }}></div>
              <div  style={{ opacity: draggingOmrId === omr.id ? 1 : 0 }} className='horizontal-omr-line'></div>
              <div  style={{ opacity: draggingOmrId === omr.id ? 1 : 0 }} className='vertical-omr-line'></div>
            </div>
          </Draggable>
          <div
            className="remove-omr-btn"
            onMouseEnter={() => handleMouseEnterOmr(omr)}
            onMouseLeave={() => handleMouseLeaveOmr(omr)}
            onClick={() => removeOmr(setOmrs, omr.id)}
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
};

export default OmrComponent;
