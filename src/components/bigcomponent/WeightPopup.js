import React, { useState } from 'react';

const WeightPopup = ({ isOpen, onClose, onChangeWeightAndSize, textStyle }) => {
    console.log(textStyle);
  const [selectedWeight, setSelectedWeight] = useState(typeof textStyle!=='undefined'? textStyle.fontWeight : 'normal');
  const [customSize, setCustomSize] = useState(typeof textStyle!=='undefined'?parseInt(textStyle.fontSize.slice(0, -1),10) : 16);

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

export default WeightPopup;
