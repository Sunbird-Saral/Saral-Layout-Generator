import React, { useState } from 'react';

const FormTemplateCapture = ({ isOpen, onClose, onChangeTextStyle, textStyle, setFormJson, fieldOrder }) => {
  const [selectedWeight, setSelectedWeight] = useState(typeof textStyle !== 'undefined' ? textStyle.fontWeight : 'normal');
  const [fieldStyle, setFieldStyle] = useState({'extractionMethod':{}, 'cellIndex': fieldOrder});
  const [customSize, setCustomSize] = useState(
    typeof textStyle !== 'undefined' && !isNaN(parseInt(textStyle.fontSize?.slice(0, -1), 10))
      ? parseInt(textStyle.fontSize?.slice(0, -1), 10)
      : 16
  );

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleFieldStyle = (value, type, isCountValue=null) => {
    let obj = {};
    if(type == 'formate') {
      obj["fieldName"] = value.toUpperCase();
    }
    if(isCountValue !=null){
      let nobj = {}
      nobj[value] = parseInt(isCountValue)
      let count = 0;
      obj[type] = {...fieldStyle[type], ...nobj}
      for(let i in obj[type]) {
        count = count + obj[type][i]
      }
    obj['count'] = count
    } else {
      obj[type] = value;
    }
    setFieldStyle({...fieldStyle, ...obj})
  }

  const handleSizeChange = (size) => {
    const newSize = parseInt(size, 10);
    setCustomSize(isNaN(newSize) ? 0 : newSize);
  };

  const handleSubmit = () => {
    const finalSize = customSize.toString() !== '' ? customSize.toString() : '16';
    onChangeTextStyle(selectedWeight, finalSize + 'px', fieldStyle["formate"]);
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
              value={fieldStyle["formate"]}
              onChange={(e) => handleFieldStyle(e.target.value, 'formate')}
            />
          </label>
          <label>
            Field Type:
            <ol>
            <li>
            <label>
            Alphabets Only:
            <input
              type="checkbox"
              value="BLOCK_LETTER_CLASSIFICATION"
              checked={fieldStyle["extractionMethod"]['BLOCK_LETTER_CLASSIFICATION']}
              onChange={() => handleFieldStyle('BLOCK_LETTER_CLASSIFICATION', 'extractionMethod', 1)}
            />
          </label>
          <label>
            Field Count:
            <input
              className='checkboxOption'
              type="number"
              value={fieldStyle["extractionMethod"]['BLOCK_LETTER_CLASSIFICATION']}
              onChange={(e) => handleFieldStyle('BLOCK_LETTER_CLASSIFICATION', 'extractionMethod', e.target.value)}
            />
          </label>
          </li>
          <li>
          <label>
          Numeric Only:
            <input
              type="checkbox"
              value="NUMERIC_CLASSIFICATION"
              checked={fieldStyle["extractionMethod"]['NUMERIC_CLASSIFICATION']}
              onChange={() => handleFieldStyle('NUMERIC_CLASSIFICATION', 'extractionMethod', 1)}
            />
            <label>
            Field Count:
            <input
              className='checkboxOption'
              type="number"
              value={fieldStyle["extractionMethod"]['NUMERIC_CLASSIFICATION']}
              onChange={(e) => handleFieldStyle('NUMERIC_CLASSIFICATION', 'extractionMethod', e.target.value)}
            />
          </label>
          </label>
          </li>
          <li>
          <label>
            OMR Only:
            <input
              type="checkbox"
              value="CELL_OMR"
              checked={fieldStyle["extractionMethod"]['CELL_OMR']}
              onChange={() => handleFieldStyle('CELL_OMR', 'extractionMethod', 1)}
            />
            <label>
            Field Count:
            <input
              className='checkboxOption'
              type="number"
              value={fieldStyle["extractionMethod"]['CELL_OMR']}
              onChange={(e) => handleFieldStyle('CELL_OMR', 'extractionMethod', e.target.value)}
            />
          </label>
          </label>
          </li>
          <li>
          <label>
            Alpha-Numeric:
            <input
              type="checkbox"
              value="BLOCK_ALPHANUMERIC_CLASSIFICATION"
              checked={fieldStyle["extractionMethod"]['BLOCK_ALPHANUMERIC_CLASSIFICATION']}
              onChange={() => handleFieldStyle('BLOCK_ALPHANUMERIC_CLASSIFICATION', 'extractionMethod', 1)}
            />
            <label>
            Field Count:
            <input
              className='checkboxOption'
              type="number"
              value={fieldStyle["extractionMethod"]['BLOCK_ALPHANUMERIC_CLASSIFICATION']}
              onChange={(e) => handleFieldStyle('BLOCK_ALPHANUMERIC_CLASSIFICATION', 'extractionMethod', e.target.value)}
            />
          </label>
          </label>
          </li>
          </ol>
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
