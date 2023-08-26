// EditableField.js
import React, { useState, useEffect } from 'react';

const EditableField = ({ initialValue, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
    <div onDoubleClick={handleDoubleClick}>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={() => {
            setEditing(false);
            onSave(value);
          }}
          onKeyDown={handleKeyPress}
          autoFocus
          style={{ width:'100%', border: 'none', outline: 'none', fontSize: '16px' ,background:'lightgrey' }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

export default EditableField;
