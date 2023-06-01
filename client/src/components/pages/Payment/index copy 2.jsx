import React, { useState, useEffect } from 'react';
import EditableRow from './EditableRow';
import './index.scss';

const EditableTable = () => {
  const [data, setData] = useState([
    { id: 1, mainCategory: '', middleCategory: '', productCategory: '', productName: '', unitPrice: '', quantity: '', discountAmount: '', taxRate: '', amount: '' },
    { id: 2, mainCategory: '', middleCategory: '', productCategory: '', productName: '', unitPrice: '', quantity: '', discountAmount: '', taxRate: '', amount: '' },
    { id: 3, mainCategory: '', middleCategory: '', productCategory: '', productName: '', unitPrice: '', quantity: '', discountAmount: '', taxRate: '', amount: '' }
  ]);
  const [expenseDate, setExpenseDate] = useState('');
  const [storeName, setStoreName] = useState('');
  const [advancer, setAdvancer] = useState('');
  const [advancementAmount, setAdvancementAmount] = useState('');
  const [advancementEnabled, setAdvancementEnabled] = useState(false);
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); // 合計金額の状態を追加

  useEffect(() => {
    // 合計金額の計算
    const sum = data.reduce((total, item) => total + parseFloat(item.amount.replace(/,/g, '') || 0), 0);
    setTotalAmount(sum);
    if (advancementEnabled) setAdvancementAmount(sum.toLocaleString());

  }, [data]);

  const handleExpenseDateChange = (e) => {
    const value = e.target.value;
    // 数値のみ受け付けるために入力値を検証
    if (/^\d*$/.test(value) && value !== '0') {
      setExpenseDate(value);
    }
  };

  const handleStoreNameChange = (e) => {
    setStoreName(e.target.value);
  };

  const handleAdvancementEnabledChange = (e) => {
    setAdvancementEnabled(e.target.checked);
    if (!e.target.checked) {
      setAdvancementAmount('');
      setAdvancer('');
    }
    else {
      setAdvancementAmount(totalAmount.toLocaleString());
      setAdvancer('system');
    }
  };

  const handleAdvancerChange = (e) => {
    setAdvancer(e.target.value);
  };

  const handleAdvancementAmountChange = (e) => {
    const value = e.target.value;
    // 数値のみ受け付けるために入力値を検証
    if (/^\d*$/.test(value) && value !== '0') {
      setAdvancementAmount(value);
    }
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const mainCategories = ['Category A', 'Category B', 'Category C'];
  const middleCategories = ['Subcategory 1', 'Subcategory 2', 'Subcategory 3'];
  const taxRates = [5, 10, 15];

  const inputFields = [
    { name: 'mainCategory', type: 'select', options: mainCategories },
    { name: 'middleCategory', type: 'select', options: middleCategories },
    { name: 'productCategory', type: 'text' },
    { name: 'productName', type: 'text' },
    { name: 'unitPrice', type: 'number' },
    { name: 'quantity', type: 'number' },
    { name: 'discountAmount', type: 'number' },
    { name: 'taxRate', type: 'select', options: taxRates }
  ];

  const handleInputChange = (e, id, field) => {
    let { value } = e.target;
  
    if (field === 'quantity' || field === 'unitPrice' || field === 'discountAmount' || field === 'taxRate') {
        value = value.replace(/[^0-9.\b]/g, '');
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    setData(prevData => {
      const updatedData = prevData.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
  
      return updatedData.map(item => {
        if (item.id === id) {
          let quantity = parseFloat(item.quantity.replace(/,/g, '')) || 0;
          let unitPrice = parseFloat(item.unitPrice.replace(/,/g, '')) || 0;
          let discountAmount = parseFloat(item.discountAmount.replace(/,/g, '')) || 0;
          let taxRate = parseFloat(item.taxRate.replace(/,/g, '')) || 0;
  
          let amount = (unitPrice - discountAmount) * (1 + taxRate / 100) * quantity;
          amount = parseInt(amount).toLocaleString(); // カンマ区切りを追加
  
          return { ...item, amount: amount.toString() };
        }
        return item;
      });
    });
  };
  
  const handleAddRow = () => {
    const newRow = {
      id: data.length + 1,
      mainCategory: '',
      middleCategory: '',
      productCategory: '',
      productName: '',
      unitPrice: '',
      quantity: '',
      discountAmount: '',
      taxRate: '',
      amount: ''
    };
    setData(prevData => [...prevData, newRow]);
  };

  const handleClearRow = (id) => {
    setData(prevData => {
      return prevData.map(item => {
        if (item.id === id) {
          return { ...item, mainCategory: '', middleCategory: '', productCategory: '', productName: '', unitPrice: '', quantity: '', discountAmount: '', taxRate: '', amount: '' };
        }
        return item;
      });
    });
  };

  const handleDeleteRow = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleOutputButtonClick = () => {
    console.log('Expense Date:', expenseDate);
    console.log('Store Name:', storeName);
    console.log('Advancer:', advancer);
    console.log('Advancement Amount:', parseFloat(advancementAmount.replace(/,/g, '')) || 0);
    console.log('Notes:', notes);
    console.log('Total Amount:', parseFloat(totalAmount.toString().replace(/,/g, '')) || 0);
    console.log('Data:');
    data.forEach(item => {
      const { quantity, unitPrice, discountAmount, taxRate, amount, ...rest } = item;
      console.log({
        ...rest,
        quantity: parseFloat(quantity.replace(/,/g, '')) || 0,
        unitPrice: parseFloat(unitPrice.replace(/,/g, '')) || 0,
        discountAmount: parseFloat(discountAmount.replace(/,/g, '')) || 0,
        taxRate: parseFloat(taxRate.replace(/,/g, '')) || 0,
        amount: parseFloat(amount.replace(/,/g, '')) || 0,
      });
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Main Category</th>
            <th>Middle Category</th>
            <th>Product Category</th>
            <th>Product Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Discount Amount</th>
            <th>Tax Rate</th>
            <th>Amount</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <EditableRow
              key={item.id}
              item={item}
              inputFields={inputFields}
              handleInputChange={handleInputChange}
              handleDeleteRow={handleDeleteRow}
              handleClearRow={handleClearRow}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8">Total Amount</td>
            <td>{totalAmount.toLocaleString()}</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <button onClick={handleAddRow}>Add Row</button>

      <div>
        <label htmlFor="expenseDate">Expense Date: </label>
        <input type="text" id="expenseDate" value={expenseDate} onChange={handleExpenseDateChange} />
      </div>

      <div>
        <label htmlFor="storeName">Store Name: </label>
        <input type="text" id="storeName" value={storeName} onChange={handleStoreNameChange} />
      </div>

      <div>
        <label htmlFor="advancementEnabled">Advancement Enabled: </label>
        <input type="checkbox" id="advancementEnabled" checked={advancementEnabled} onChange={handleAdvancementEnabledChange} />
      </div>

      {advancementEnabled && (
        <div>
          <label htmlFor="advancer">Advancer: </label>
          <select id="advancer" value={advancer} onChange={handleAdvancerChange}>
            <option value="system">System</option>
            <option value="user">User</option>
          </select>
        </div>
      )}

      {advancementEnabled && (
        <div>
          <label htmlFor="advancementAmount">Advancement Amount: </label>
          <input type="text" id="advancementAmount" value={advancementAmount} onChange={handleAdvancementAmountChange} />
        </div>
      )}

      <div>
        <label htmlFor="notes">Notes: </label>
        <textarea id="notes" value={notes} onChange={handleNotesChange}></textarea>
      </div>

      <button onClick={handleOutputButtonClick}>Output Data</button>
    </div>
  );
};

export default EditableTable;