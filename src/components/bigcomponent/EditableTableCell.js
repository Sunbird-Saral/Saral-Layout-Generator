import React, { useState, useEffect } from 'react';

const EditableTableCell = ({ initialValue }) => {
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
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={() => {
            setEditing(false);
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
