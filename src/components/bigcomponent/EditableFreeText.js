import React, { useState, useEffect } from 'react';

const EditableFreeText = ({ initialValue, textStyle = {}, onTextChange }) => {
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
      if (onTextChange) {
        onTextChange(textStyle.fontWeight, textStyle.fontSize);
      }
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={textStyle} 
    >
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={() => {
            setEditing(false);
            if (onTextChange) {
              onTextChange(textStyle.fontWeight, textStyle.fontSize);
            }
          }}
          autoFocus
          style={{ backgroundColor: 'grey', width: '100%', border: 'none', outline: 'none',...textStyle }}
        />
      ) : (
        <div>
          &nbsp;{value}
        </div>
      )}
    </div>
  );
};

export default EditableFreeText;
