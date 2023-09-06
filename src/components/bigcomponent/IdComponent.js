import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './IdComponent.css';
import IdPopup from './IdPopup';
const IdComponent = ({ boundaryRef }) => {
  const [inputs, setInputs] = useState([]);
  const inputRefs = React.useRef({});
  const [draggingInputId, setDraggingInputId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInputId, setPopupInputId] = useState(null);

  const addBoxes = () => {
    setInputs((prevInputs) => [
      ...prevInputs,
      {
        id: Date.now(),
        top: 200,
        left: 1230,
        name: `input ${prevInputs.length + 1}`,
        size: 1,
        width: 20,
        height: 20,
      },
    ]);
  };

  const removeField = (setFields, fieldId) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
  };

  const handleInputDragStart = (inputId, input) => {
    setDraggingInputId(inputId);
    handleMouseLeaveID(input);
  };

  const handleInputDragStop = (inputId, e, data) => {
    const boundaryRect = boundaryRef.current.getBoundingClientRect();
    const boundaryX = boundaryRect.left;
    const boundaryY = boundaryRect.top;
    const fieldRect = inputRefs.current[inputId].getBoundingClientRect();
    const fieldX = fieldRect.left;
    const fieldY = fieldRect.top;
    let newX = data.x + fieldX - boundaryX;
    let newY = data.y + fieldY - boundaryY;

    setInputs((prevFields) =>
      prevFields.map((input) => (input.id === inputId ? { ...input, top: newY, left: newX } : input))
    );
    setDraggingInputId(null);
  };

  const generate = (size, box) => {
    const cells = [];
    for (let x = 0; x < size; x++) {
      cells.push(
        <td
          style={{
            width: box.width,
            height: box.height,
            transition: 'width 0.3s, height 0.3s',
          }}
        ></td>
      );
    }
    return cells;
  };

  const addCells = (setInputs, inputId) => {
    setInputs((prevFields) =>
      prevFields.map((input) => {
        if (input.id === inputId) {
          if (input.size + 1 > 20) {
            alert('The maximum value of input box size is 20!');
            return { ...input, size: 20 };
          } else {
            return { ...input, size: input.size + 1 };
          }
        } else {
          return input;
        }
      })
    );
  };

  const removeCells = (setInputs, inputId) => {
    setInputs((prevFields) =>
      prevFields.map((input) => {
        if (input.id === inputId) {
          if (input.size - 2 < 0) {
            alert('The minimum value of input box size is 1!');
            return { ...input, size: 1 };
          } else {
            return { ...input, size: input.size - 1 };
          }
        } else {
          return input;
        }
      })
    );
  };

  const scaleFactor = 0.1;
  const handleWheel = (event, input) => {
    event.preventDefault();

    const newInputs = inputs.map((prevInput) => {
      if (prevInput.id === input.id) {
        const newWidth =
          event.deltaY < 0 ? prevInput.width * (1 + scaleFactor) : prevInput.width * (1 - scaleFactor);
        const newHeight =
          event.deltaY < 0 ? prevInput.height * (1 + scaleFactor) : prevInput.height * (1 - scaleFactor);

        return { ...prevInput, width: newWidth, height: newHeight };
      } else {
        return prevInput;
      }
    });

    setInputs(newInputs);
  };

  const handleMouseEnterID = (omr) => {
    const IDContainer = inputRefs.current[omr.id];
    const removeButton = IDContainer.querySelector('.remove-id-btn');
    removeButton.style.opacity = 1;
    const removeID = IDContainer.querySelector('.add-cell-btn');
    removeID.style.opacity = 1;
    const addID = IDContainer.querySelector('.remove-cell-btn');
    addID.style.opacity = 1;
  };

  const handleMouseLeaveID = (omr) => {
    const IDContainer = inputRefs.current[omr.id];
    const removeButton = IDContainer.querySelector('.remove-id-btn');
    removeButton.style.opacity = 0;
    const removeID = IDContainer.querySelector('.add-cell-btn');
    removeID.style.opacity = 0;
    const addID = IDContainer.querySelector('.remove-cell-btn');
    addID.style.opacity = 0;
  };

  const handleBoxTripleClick = (inputId) => {
    setIsPopupOpen(true);
    setPopupInputId(inputId);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupInputId(null);
  };

  const handleWidthChange = (newWidth) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === popupInputId ? { ...input, width: parseInt(newWidth) } : input
      )
    );
  };

  const handleHeightChange = (newHeight) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === popupInputId ? { ...input, height: parseInt(newHeight) } : input
      )
    );
  };

  return (
    <>
      {inputs.map((input) => (
        <div
          key={input.id}
          ref={(element) => (inputRefs.current[input.id] = element)}
          style={{ position: 'absolute', left: input.left, top: input.top }}
          className="field-container"
          onDoubleClick={() => handleBoxTripleClick(input.id)}
        >
          <Draggable
            position={{ x: 0, y: 0 }}
            onStart={() => handleInputDragStart(input.id, input)}
            onStop={(e, data) => handleInputDragStop(input.id, e, data)}
          >
            <div className="cell-box">
              <table className="roll " onMouseEnter={() => handleMouseEnterID(input)} onMouseLeave={() => handleMouseLeaveID(input)}>
                <tr onWheel={(event) => handleWheel(event, input)}>
                  {generate(input.size, input)}
                </tr>
              </table>
              <div style={{ opacity: draggingInputId === input.id ? 1 : 0 }} className="horizontal-id"></div>
              <div style={{ opacity: draggingInputId === input.id ? 1 : 0 }} className="vertical-id"></div>
            </div>
          </Draggable>
          <div className="input-feat-buttons">
            <div
              className="remove-id-btn"
              onClick={() => removeField(setInputs, input.id)}
              title="Remove Field"
              onMouseEnter={() => handleMouseEnterID(input)}
              onMouseLeave={() => handleMouseLeaveID(input)}
            >
              &#10005;
            </div>
            <div
              className="add-cell-btn"
              onClick={() => addCells(setInputs, input.id)}
              onMouseEnter={() => handleMouseEnterID(input)}
              onMouseLeave={() => handleMouseLeaveID(input)}
            >
              &#43;
            </div>
            <div
              className="remove-cell-btn"
              onClick={() => removeCells(setInputs, input.id)}
              onMouseEnter={() => handleMouseEnterID(input)}
              onMouseLeave={() => handleMouseLeaveID(input)}
            >
              &#10005;
            </div>
          </div>
        </div>
      ))}
{isPopupOpen && (
        <IdPopup
          input={inputs.find((input) => input.id === popupInputId)}
          onClose={closePopup}
          onWidthChange={(newWidth) => handleWidthChange(newWidth)}
          onHeightChange={(newHeight) => handleHeightChange(newHeight)}
        />
      )}
      <button onClick={addBoxes} className="add-box-btn">
        Add InputBox
      </button>
    </>
  );
};

export default IdComponent;
