import React, { useState } from 'react';

const NumberInput = ({isDisabled=false, id, name, initialValue='', focusEvent, changeEvent, maxLength}) => {
  const [value, setValue] = useState(initialValue);

  const formatNumber = (event) => {
    // カンマを除去して数値だけを取得
    const inputValue = event.target.value.replace(/,/g, '');
  
    // 数値以外の文字を削除
    const formattedValue = inputValue.replace(/[^\d.-]/g, '');

    if (formattedValue === '') {
      setValue('');
      return;
    }
  
    // カンマを追加してフォーマット
    const formattedString = parseFloat(formattedValue).toLocaleString();
  
    setValue(formattedString);

    if (changeEvent) changeEvent(event);
  };

  return (
    <input type="text"
           id={`${id}`}
           name={name}
           value={value}
           onFocus={focusEvent}
           onChange={formatNumber}
           disabled={isDisabled}
           autoComplete='off'
           maxLength={maxLength}
           />
  );
}

export default NumberInput;