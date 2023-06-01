import React from 'react';

const EditableRow = ({ item, inputFields, handleInputChange, handleDeleteRow, handleClearRow }) => {
  return (
    <tr key={item.id}>
      {inputFields.map(field => (
        <td key={field.name}>
          {field.type === 'select' ? (
            <select
              value={item[field.name]}
              onChange={e => handleInputChange(e, item.id, field.name)}
            >
              <option value="">選択してください</option>
              {field.options.map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={item[field.name]}
              onChange={e => handleInputChange(e, item.id, field.name)}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          )}
        </td>
      ))}
      <td>
        <input
          type="text"
          value={item.amount}
          readOnly
        />
      </td>
      <td>
        {/* クリアボタン */}
        <button onClick={() => handleClearRow(item.id)}>クリア</button>
      </td>
      <td>
        {/* 削除ボタン */}
        <button onClick={() => handleDeleteRow(item.id)}>削除</button>
      </td>
    </tr>
  );
};

export default EditableRow;
