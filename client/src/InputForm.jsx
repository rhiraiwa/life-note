import React, { useState } from 'react';

function ExpenseForm() {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    storeName: '',
    hasExpense: false,
    user: '',
    amount: ''
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let inputValue = value;

    if (type === 'checkbox') {
      inputValue = checked;
    } else if (name === 'year' || name === 'month' || name === 'day' || name === 'amount') {
      // 数値のみを許可する制約を追加
      inputValue = value.replace(/\D/g, '');
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 入力値を使用して何かを行う
    console.log('フォームデータ:', formData);
    // フォームをリセットする
    setFormData({
      year: '',
      month: '',
      day: '',
      storeName: '',
      hasExpense: false,
      user: '',
      amount: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        年:
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          maxLength={4}
          autoComplete="off"
        />
      </label>
      <label>
        月:
        <input
          type="text"
          name="month"
          value={formData.month}
          onChange={handleInputChange}
          maxLength={2}
          autoComplete="off"
        />
      </label>
      <label>
        日:
        <input
          type="text"
          name="day"
          value={formData.day}
          onChange={handleInputChange}
          maxLength={2}
          autoComplete="off"
        />
      </label>
      <label>
        店名:
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleInputChange}
          autoComplete="off"
        />
      </label>
      <label>
        立替あり:
        <input
          type="checkbox"
          name="hasExpense"
          checked={formData.hasExpense}
          onChange={handleInputChange}
          autoComplete="off"
        />
      </label>
      {formData.hasExpense && (
        <>
          <label>
            立替ユーザー:
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </label>
          <label>
            立替額:
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </label>
        </>
      )}
      <button type="submit">送信</button>
    </form>
  );
}

export default ExpenseForm;
