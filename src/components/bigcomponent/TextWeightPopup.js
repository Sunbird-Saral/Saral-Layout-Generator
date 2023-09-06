import React, { useState } from 'react';

const TextWeightPopup = ({ initialValue, onSave, onCancel }) => {
  const [textWeight, setTextWeight] = useState(initialValue);

  const handleSave = () => {
    onSave(textWeight);
  };

  return (
    <div className="text-weight-popup">
      <input
        type="text"
        value={textWeight}
        onChange={(e) => setTextWeight(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
      
    </div>
  );
};

export default TextWeightPopup;
