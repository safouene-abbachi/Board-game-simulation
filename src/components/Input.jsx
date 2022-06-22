import React from 'react';
const Input = ({ inputValue, setInputValue }) => {
  return (
    <div>
      <input
        max={4}
        min={2}
        value={inputValue}
        onChange={(e) => setInputValue(+e.target.value)}
        type="number"
      />
    </div>
  );
};

export default Input;
