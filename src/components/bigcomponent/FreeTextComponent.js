import React, { useState } from 'react';
import Draggable from 'react-draggable';
import EditableTableCell from './EditableTableCell';


const FreeTextComponent=({boundaryRef})=>{

    const [fields, setFields] = useState([
        { id: Date.now() + 1, top: 100, left: 100, name: 'Field 1' },
      ]);

      const fieldRefs = React.useRef({});
      const addField = () => {
        setFields((prevFields) => [
          ...prevFields,
          { id: Date.now(), top: 100, left: 100, name: `Field ${prevFields.length + 1}`, numBoxes: 5 },
        ]);
      };

      const removeField = (setFields,fieldId) => {
        setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
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
        newX = Math.floor(newX/5);
        newX = newX*5;
        newY = Math.floor(newY/5);
        newY = newY*5;
    
        setFields((prevFields) =>
          prevFields.map((field) => (field.id === fieldId ? { ...field, top: newY, left: newX } : field))
        );
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
                onStop={(e, data) => handleFieldDrag(field.id, e, data)}
              >
                <div className="field-box">
                  <EditableTableCell
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

<button onClick={addField} className="add-btn">
        Add FreeText
      </button>
        </>

      );

}

export default FreeTextComponent;