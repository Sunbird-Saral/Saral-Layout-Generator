import React, { useState } from 'react';
import Draggable from 'react-draggable';
import EditableFreeText from './EditableFreeText/EditableFreeText.component';
import WeightPopup from './WeightPopup/WeightPopup.component';
import './FreeText.component.css';

const FreeTextComponent = ({ boundaryRef }) => { 
  const [fields, setFields] = useState([]);
  const fieldRefs = React.useRef({});
  const [draggingFieldId, setDraggingFieldId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupFieldId, setPopupFieldId] = useState(null);

  const addField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), top: 150, left: 1110, name: `Field ${prevFields.length + 1}` },
    ]);
  };

  const removeField = (setFields, fieldId) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
  };

  const handleFieldDragStart = (fieldId) => {
    setDraggingFieldId(fieldId);
  };

  const handleFieldDragStop = (fieldId, e, data) => {
    const boundaryRect = boundaryRef.current.getBoundingClientRect();
    const boundaryX = boundaryRect.left;
    const boundaryY = boundaryRect.top;
    const fieldRect = fieldRefs.current[fieldId].getBoundingClientRect();
    const fieldX = fieldRect.left;
    const fieldY = fieldRect.top;
    let newX = data.x + fieldX - boundaryX;
    let newY = data.y + fieldY - boundaryY;

    setFields((prevFields) =>
      prevFields.map((field) => (field.id === fieldId ? { ...field, top: newY, left: newX } : field))
    );
    setDraggingFieldId(null);
  };

  const handleFieldNameChange = (fieldId, newName) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === fieldId ? { ...field, name: newName } : field))
    );
  };

  const handleFieldTripleClick = (fieldId) => {
    setIsPopupOpen(true);
    setPopupFieldId(fieldId);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupFieldId(null);
  };

  const handleTextChange = (weight, size, fieldId) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              textStyle: {
                fontWeight: weight === 'bold' ? 'bold' : 'normal',
                fontSize: size==='undefined'?'16px':size,
              },
            }
          : field
      )
    );
  };

  return (
    <>
      {fields.map((field) => (
        <div
          key={field.id}
          ref={(element) => (fieldRefs.current[field.id] = element)}
          style={{ position: 'absolute', left: field.left, top: field.top }}
          className="field-container"
          onClick={(event) => {
            if (event.detail === 3) {
              handleFieldTripleClick(field.id);
            }
          }}
        >
          <Draggable
            position={{ x: 0, y: 0 }}
            onStart={() => handleFieldDragStart(field.id)}
            onStop={(e, data) => handleFieldDragStop(field.id, e, data)}
          >
            <div className="field-box" style={{ width: "max-content" }}>
              <EditableFreeText
                initialValue={field.name}
                textStyle={field.textStyle}
                onTextChange={(weight, size) => handleTextChange(weight, size, field.id)} 
                onSave={(newName) => handleFieldNameChange(field.id, newName)}
              />
              <div style={{ opacity: draggingFieldId === field.id ? 1 : 0 }} className='vertical'></div>
              <div style={{ opacity: draggingFieldId === field.id ? 1 : 0 }} className='horizontal'></div>
            </div>
          </Draggable>
          <div
            className="remove-btn"
            onClick={() => removeField(setFields, field.id)}
            title="Remove Field"
          >
            &#10005;
          </div>
          {isPopupOpen && popupFieldId === field.id && (
            <WeightPopup
              isOpen={isPopupOpen}
              onClose={closePopup}
              onChangeWeightAndSize={(weight, size) => handleTextChange(weight, size, field.id)} 
              textStyle={field.textStyle}
            />
          )}
        </div>
      ))}

      <button onClick={addField} className="add-free-btn">
        Add Text
      </button>
    </>
  );
};

export default FreeTextComponent;
