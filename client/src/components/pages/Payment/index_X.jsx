import React, { useState } from 'react';
import NumberInput from '../../atoms/NumberInput';

const SampleApp = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  return (
    <div>
      <NumberInput onChange={handleInputChange} value={inputValue} />
      <p>入力値: {inputValue}</p>
    </div>
  );
};

export default SampleApp;
