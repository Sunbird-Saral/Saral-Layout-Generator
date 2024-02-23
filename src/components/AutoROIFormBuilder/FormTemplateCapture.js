import React, { useState } from 'react';

const FormTemplateCapture = ({ isOpen, onClose, onChangeTextStyle, textStyle, setFormJson, fieldOrder }) => {
  const [selectedWeight, setSelectedWeight] = useState(typeof textStyle !== 'undefined' ? textStyle.fontWeight : 'normal');
  const [fieldStyle, setFieldStyle] = useState({'extractionMethod':'BLOCK_LETTER_CLASSIFICATION', 'cellIndex': fieldOrder});
  const [customSize, setCustomSize] = useState(
    typeof textStyle !== 'undefined' && !isNaN(parseInt(textStyle.fontSize?.slice(0, -1), 10))
      ? parseInt(textStyle.fontSize?.slice(0, -1), 10)
      : 16
  );

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleFieldStyle = (value, type) => {
    console.log('value', value, type);
    let obj = {};
    obj[type] = value;
    setFieldStyle({...fieldStyle, ...obj})
    console.log('fieldStyle', fieldStyle);
  }

  const handleSizeChange = (size) => {
    const newSize = parseInt(size, 10);
    setCustomSize(isNaN(newSize) ? 0 : newSize);
  };

  const handleSubmit = () => {
    const finalSize = customSize.toString() !== '' ? customSize.toString() : '16';
    onChangeTextStyle(selectedWeight, finalSize + 'px', fieldStyle["fieldName"]);
    onClose();
    let config = {}
    let {fieldName, ...robj} = fieldStyle;
    config[fieldName] = robj

    console.log('config',config)
    setFormJson(config)
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="weight-popup">
          <label>
            Field Name:
            <input
              type="text"
              value={fieldStyle["fieldName"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'fieldName')}
            />
          </label>
          <label>
            Field Type:
            <label>
            <input
              type="radio"
              value="BLOCK_LETTER_CLASSIFICATION"
              checked={fieldStyle["extractionMethod"] === 'BLOCK_LETTER_CLASSIFICATION'}
              onChange={() => handleWeightChange('BLOCK_LETTER_CLASSIFICATION', 'extractionMethod')}
            />
            Text Only
          </label>
          <label>
            <input
              type="radio"
              value="NUMERIC_CLASSIFICATION"
              checked={fieldStyle["extractionMethod"] === 'NUMERIC_CLASSIFICATION'}
              onChange={() => handleWeightChange('NUMERIC_CLASSIFICATION', 'extractionMethod')}
            />
            Numerical
          </label>
          <label>
            <input
              type="radio"
              value="CELL_OMR"
              checked={fieldStyle["extractionMethod"] === 'CELL_OMR'}
              onChange={() => handleWeightChange('CELL_OMR', 'extractionMethod')}
            />
            OMR
          </label>
          </label>
          <label>
            Input length:
            <input
              type="text"
              value={fieldStyle["count"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'count')}
            />
          </label>
          <label>
            Field Order:
            <input
              type="number"
              value={fieldStyle["cellIndex"] || fieldOrder}
              onChange={(e) => handleFieldStyle(e.target.value, 'cellIndex')}
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
