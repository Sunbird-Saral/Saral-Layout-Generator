import React, { useState } from 'react';

const EditableTableCell = ({ initialValue, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setEditing(false);
      onSave(value);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
        
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          
          onBlur={() => {
            setEditing(false);
            onSave(value);
          }}
          autoFocus
          style={{ border: 'none', outline: 'none' }}
        />
      ) : (
        <span>&nbsp;{value}</span>
      )}
    </div>
  );
};

export default EditableTableCell;
