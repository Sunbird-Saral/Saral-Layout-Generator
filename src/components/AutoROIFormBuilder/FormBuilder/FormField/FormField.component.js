import React, { useState } from 'react';
import './FormField.component.css'

const FormField = ({ isOpen, onClose, onChangeTextStyle, textStyle, setFormJson, fieldOrder, handleFieldCancel}) => {
  const [selectedWeight, setSelectedWeight] = useState(typeof textStyle !== 'undefined' ? textStyle.fontWeight : 'normal');
  const [fieldStyle, setFieldStyle] = useState({'extractionMethod':{}, 'cellIndex': fieldOrder});
  const [customSize, setCustomSize] = useState(
    typeof textStyle !== 'undefined' && !isNaN(parseInt(textStyle.fontSize?.slice(0, -1), 10))
      ? parseInt(textStyle.fontSize?.slice(0, -1), 10)
      : 16
  );
  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
      const errors = {}
      if(!fieldStyle['formate'] || fieldStyle['formate']==' ') {
          errors['formate'] = 'Field Name is required'
      }
      if(!fieldStyle['extractionMethod'] || Object.keys(fieldStyle['extractionMethod']).length == 0) {
        errors['extractionMethod'] = 'Field Type is required'
      }
      if(!fieldStyle['cellIndex'] || fieldStyle['cellIndex']== 0) {
        errors['cellIndex'] = 'Field Order is required'
      }

      return errors;
  }

  const handleSubmit = () => {
    const errors = validateForm();
    setErrors(errors);
    if(Object.keys(errors).length == 0 ){
      const finalSize = customSize.toString() !== '' ? customSize.toString() : '16';
      onChangeTextStyle(selectedWeight, finalSize + 'px', fieldStyle["formate"]);
      onClose();
      let config = {}
      let {fieldName, ...robj} = fieldStyle;
      config[fieldName] = robj
      setFormJson(config)
    }
  };

  const handleCancel = () => {
    handleFieldCancel();
    onClose();
  }

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
            {errors.formate && <span className='error-msg'>{errors.formate}</span>}
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
            Field Length:
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
            Field Length:
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
            Field Length:
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
            Field Length:
            <input
              className='checkboxOption'
              type="number"
              value={fieldStyle["extractionMethod"]['BLOCK_ALPHANUMERIC_CLASSIFICATION']}
              onChange={(e) => handleFieldStyle('BLOCK_ALPHANUMERIC_CLASSIFICATION', 'extractionMethod', e.target.value)}
            />
          </label>
          {errors.extractionMethod && <span className='error-msg'>{errors.extractionMethod}</span>}
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
            {errors.cellIndex && <span className='error-msg'>{errors.cellIndex}</span>}
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
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default FormField;
