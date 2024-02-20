import React, { useState } from 'react';

const FormTemplateCapture = ({ isOpen, onClose, onChangeTextStyle, textStyle, setFormJson, fieldOrder }) => {
  console.log(textStyle);
  const [selectedWeight, setSelectedWeight] = useState(typeof textStyle !== 'undefined' ? textStyle.fontWeight : 'normal');
  const [fieldStyle, setFieldStyle] = useState({});
  const [customSize, setCustomSize] = useState(
    typeof textStyle !== 'undefined' && !isNaN(parseInt(textStyle.fontSize?.slice(0, -1), 10))
      ? parseInt(textStyle.fontSize?.slice(0, -1), 10)
      : 16
  );

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleFieldStyle = (value, type) => {
    let obj = {};
    obj[type] = value;
    setFieldStyle({...fieldStyle, ...obj})
  }

  const handleSizeChange = (size) => {
    const newSize = parseInt(size, 10);
    setCustomSize(isNaN(newSize) ? 0 : newSize);
  };

  const handleSubmit = () => {
    const finalSize = customSize.toString() !== '' ? customSize.toString() : '16';
    onChangeTextStyle(selectedWeight, finalSize + 'px', fieldStyle["name"]);
    onClose();
    setFormJson(fieldStyle)
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="weight-popup">
          <label>
            Field Name:
            <input
              type="text"
              value={fieldStyle["name"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'name')}
            />
          </label>
          <label>
            Field Type:
            <input
              type="text"
              value={fieldStyle["type"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'type')}
            />
          </label>
          <label>
            Input length:
            <input
              type="text"
              value={fieldStyle["length"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'length')}
            />
          </label>
          <label>
            Field Order:
            <input
              type="text"
              value={fieldStyle["order"] || fieldOrder}
              onChange={(e) => handleFieldStyle(e.target.value, 'order')}
            />
          </label>
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

export default FormTemplateCapture;
