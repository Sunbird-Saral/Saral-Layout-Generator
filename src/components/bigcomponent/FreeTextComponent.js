import React, { useState } from 'react';
import Draggable from 'react-draggable';
import EditableFreeText from './EditableFreeText';
import WeightPopup from './WeightPopup';
import './FreeTextComponent.css';
import FormField from '../AutoROIFormBuilder/FormField/FormField.component';

const FreeTextComponent = ({ boundaryRef, type, setFormJson}) => {
  const [fields, setFields] = useState([]);
  const [InputFieldCount, setInputFieldCount] = useState(0);
  const fieldRefs = React.useRef({});
  const [draggingFieldId, setDraggingFieldId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupFieldId, setPopupFieldId] = useState(null);
  const [isFieldSetPopupOpen, setIsFieldSetPopupOpen] = useState(false);

  const addField = () => {
    let id =  Date.now()
    if(type == 'InputField') {
      setInputFieldCount((preCount)=>preCount+1);
      id = InputFieldCount;
    }
    setFields((prevFields) => [
      ...prevFields,
      { id: id, top: 150, left: 1110, name: `Field ${prevFields.length + 1}` },
    ]);
    setIsFieldSetPopupOpen(true);
  };

  const handleFieldCancel = (fieldId) => {
    setInputFieldCount((preCount)=>preCount-1);
    removeField(setFields, fieldId)
  }

  const closeFieldSetPopup = () => {
    setIsFieldSetPopupOpen(false);
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

  const handleInputTextChange = (weight, size, value, fieldId) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              name: value,
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
              <div style={{ opacity: draggingFieldId === field.id ? 1 : 0 }} className='horizontal'></div>
              <div style={{ opacity: draggingFieldId === field.id ? 1 : 0 }} className='vertical'></div>
            </div>
          </Draggable>
          <div
            className="remove-btn"
            onClick={() => removeField(setFields, field.id)}
            title="Remove Field"
          >
            &#10005;
          </div>
          {isPopupOpen && popupFieldId === field.id && type === "FreeText" && (
            <WeightPopup
              isOpen={isPopupOpen}
              onClose={closePopup}
              onChangeWeightAndSize={(weight, size) => handleTextChange(weight, size, field.id)} 
              textStyle={field.textStyle}
            />
          )}
          {isFieldSetPopupOpen && type === "InputField" && (
            <FormField
              isOpen={isFieldSetPopupOpen}
              onClose={closeFieldSetPopup}
              onChangeTextStyle={(weight, size, value) => handleInputTextChange(weight, size, value, field.id)} 
              textStyle={field.textStyle}
              setFormJson={setFormJson}
              fieldOrder = {InputFieldCount}
              handleFieldCancel = {() => handleFieldCancel(field.id)}
            />
          )}
        </div>
      ))}

      <button onClick={addField} className="add-free-btn">
        {type}
      </button>
    </>
  );
};

export default FreeTextComponent;
