import React, { useState } from 'react';
import './Dropdown.component.css'

const Dropdown = ({ options, onSelect}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div className="dropdown">
      <select
        value={selectedOption}
        onChange={(e) => handleSelect(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
