import React, { useState, useEffect } from 'react';
import './EditableTableCell.component.css'

const WeightPopup = ({ isOpen, onClose, onChangeWeightAndSize }) => {
  const [selectedWeight, setSelectedWeight] = useState('normal');
  const [customSize, setCustomSize] = useState(16);

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleSizeChange = (size) => {
    const newSize = parseInt(size, 10); 
    setCustomSize(isNaN(newSize) ? 0 : newSize); 
  };
  

  const handleSubmit = () => {
    const finalSize = customSize.toString() !== '' ? customSize.toString() : '16';
    onChangeWeightAndSize(selectedWeight, finalSize + 'px');
    onClose();
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="weight-popup">
          <label>
            <input
              type="radio"
              value="normal"
              checked={selectedWeight === 'normal'}
              onChange={() => handleWeightChange('normal')}
            />
            Normal
          </label>
          <label>
            <input
              type="radio"
              value="bold"
              checked={selectedWeight === 'bold'}
              onChange={() => handleWeightChange('bold')}
            />
            Bold
          </label>
          <p></p>
          <label>
            Custom Font Size:
            <input
              type="text" 
              value={customSize}
              onChange={(e) => handleSizeChange(e.target.value)}
            />
          </label>
          <button onClick={handleSubmit}>Apply</button>
        </div>
      </div>
    )
  );
};


const EditableTableCell = ({ initialValue }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isWeightPopupOpen, setWeightPopupOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState('normal');
  const [selectedSize, setSelectedSize] = useState('16px');

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

  const handleTripleClick = () => {
    setEditing(false);
    setWeightPopupOpen(true);
  };

  const textStyle = {
    fontWeight: isBold ? 'bold' : selectedWeight,
    fontSize: selectedSize,

  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="text-weight-popup"
      onClick={(event) => {
        if (event.detail === 3) {
          handleTripleClick();
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
          style={{ backgroundColor: 'grey', width: '100%', border: 'none', outline: 'none', ...textStyle }}
        />
      ) : (
        <div style={textStyle}>&nbsp;{value}</div>
      )}
      <div className="text-weight-popup">
      <WeightPopup 
      
      isOpen={isWeightPopupOpen}
      onClose={() => setWeightPopupOpen(false)}
      onChangeWeightAndSize={(weight, size) => {
        setIsBold(weight === 'bold');
        setSelectedWeight(weight);
        setSelectedSize(size);
      }}
    />
      </div>

    </div>
  );
};

export default EditableTableCell;
