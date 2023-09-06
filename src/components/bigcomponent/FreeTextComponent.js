import React, { useState } from 'react';
import Draggable from 'react-draggable';
import EditableTableCell from './EditableTableCell';
import './FreeTextComponent.css';

const FreeTextComponent = ({ boundaryRef }) => {
  const [fields, setFields] = useState([]);
  const fieldRefs = React.useRef({});
  const [draggingFieldId, setDraggingFieldId] = useState(null);

  const addField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), top: 150, left: 1230, name: `Field ${prevFields.length + 1}`, numBoxes: 5 },
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

  return (
    <>
      {fields.map((field) => (
        <div
          key={field.id}
          ref={(element) => (fieldRefs.current[field.id] = element)}
          style={{ position: 'absolute', left: field.left, top: field.top }}
          className="field-container"
        >
          <Draggable
            position={{ x: 0, y: 0 }}
            onStart={() => handleFieldDragStart(field.id)}
            onStop={(e, data) => handleFieldDragStop(field.id, e, data)}
          >
            <div
              className="field-box"
              style={{ width: "fit-content" }}
            >
              <EditableTableCell
                initialValue={field.name}
                onSave={(newName) => handleFieldNameChange(field.id, newName)}
              />
              <div style={{opacity: draggingFieldId === field.id ? 1 : 0}} className='horizontal'></div>
              <div style={{opacity: draggingFieldId === field.id ? 1 : 0}} className='vertical'></div>
            </div>
          </Draggable>
          <div
            className="remove-btn"
            onClick={() => removeField(setFields, field.id)}
            title="Remove Field"
          >
            &#10005;
          </div>
        </div>
      ))}

      <button onClick={addField} className="add-free-btn">
        Add FreeText
      </button>
    </>
  );
};

export default FreeTextComponent;
