import React from 'react';

const IdPopup = ({ input, onClose, onWidthChange, onHeightChange }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Box Size</h2>
        <div>
          <label htmlFor="width">Width:</label>
          <input
            type="number"
            id="width"
            value={input.width}
            onChange={(e) => onWidthChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            value={input.height}
            onChange={(e) => onHeightChange(e.target.value)}
          />
        </div>
        <button onClick={onClose}>Save</button>
      </div>
    </div>
  );
};

export default IdPopup;
