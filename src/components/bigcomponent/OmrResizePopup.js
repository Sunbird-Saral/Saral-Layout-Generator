import React from 'react';

const OmrResizePopup = ({ input, onClose, onSizeChange,onColorChange }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Omr Size</h2>
        <label>
            <input
              type="radio"
              value="normal"
              checked={input.color === 'black'}
              onChange={() => onColorChange('black')}
            />
            Black
          </label>
          <label>
            <input
              type="radio"
              value="bold"
              checked={input.color === 'white'}
              onChange={() => onColorChange('white')}
            />
            White
          </label>
        <div>
          <label htmlFor="width">Size:</label>
          <input
            type="number"
            id="width"
            value={input.size }
            onChange={(e) => onSizeChange(e.target.value)}
          />
        </div>

        <button onClick={onClose}>Save</button>
      </div>
    </div>
  );
};

export default OmrResizePopup;
