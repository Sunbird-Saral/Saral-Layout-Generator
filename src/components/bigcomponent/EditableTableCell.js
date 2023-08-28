import React, { useState, useEffect } from 'react';

const EditableTableCell = ({ initialValue }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [isBold, setIsBold] = useState(false); // State to track if text is bold

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleDoubleClick = () => {
    setIsBold(!isBold);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setEditing(false);
    }
  };

  const handleTripleClick = () => {
    setEditing(true);
  };

  const textStyle = {
    fontWeight: isBold ? 'bold' : 'normal',





  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onClick={(event) => {
        if (event.detail === 3) {
          handleTripleClick(); // Triple-click to toggle bold
        }
      }}
    >
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
          style={{   border: 'none', outline: 'none', ...textStyle }}
        />
      ) : (
        <div style={textStyle}>
          
          &nbsp;{value}
        </div>
      )}
    </div>
  );
};

export default EditableTableCell;
