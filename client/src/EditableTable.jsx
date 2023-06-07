import React, { useState } from 'react';

const EditableTable = () => {
  const [tableData, setTableData] = useState([
    { id: 1, category1: 'Category A', category2: 'Subcategory 1', category3: 'Product 1', productName: 'Item 1', price: 10, discount: '', quantity: 3, taxRate: 0.1, amount: 0 },
    { id: 2, category1: 'Category A', category2: 'Subcategory 1', category3: 'Product 2', productName: 'Item 2', price: 15, discount: '', quantity: 2, taxRate: 0.1, amount: 0 },
    { id: 3, category1: 'Category B', category2: 'Subcategory 2', category3: 'Product 3', productName: 'Item 3', price: 20, discount: '', quantity: 1, taxRate: 0.1, amount: 0 }
  ]);

  const categories1 = [
    { label: 'Category A', value: 'Category A' },
    { label: 'Category B', value: 'Category B' },
    { label: 'Category C', value: 'Category C' }
  ];

  const categories2 = [
    { label: 'Subcategory 1', value: 'Subcategory 1', category1: 'Category A' },
    { label: 'Subcategory 2', value: 'Subcategory 2', category1: 'Category A' },
    { label: 'Subcategory 3', value: 'Subcategory 3', category1: 'Category B' },
    { label: 'Subcategory 4', value: 'Subcategory 4', category1: 'Category B' },
    { label: 'Subcategory 5', value: 'Subcategory 5', category1: 'Category C' },
    { label: 'Subcategory 6', value: 'Subcategory 6', category1: 'Category C' }
  ];

  const taxRates = [
    { label: '8%', value: 0.08 },
    { label: '10%', value: 0.1 },
    { label: '税込', value: 0 }
  ];

  const initialRowCount = 10;
  const [currentId, setCurrentId] = useState(initialRowCount);

  const uniqueId = () => {
    const newId = currentId + 1;
    setCurrentId(newId);
    return newId;
  };

  const handleCellEdit = (rowIndex, columnName, value) => {
    if (columnName === 'price' || columnName === 'discount' || columnName === 'quantity') {
      value = isNaN(value) ? '' : parseInt(value);
    }
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, [columnName]: value };
        updatedRow.amount = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setTableData(updatedData);
  };

  const calculateAmount = (row) => {
    const amount = Math.round((row.price - row.discount) * row.quantity * (1 + row.taxRate));
    return isNaN(amount) ? 0 : amount;
  };

  // 金額計算
  const calculateTotal = (price, discount, quantity, taxRate) => {
    const subtotal = Math.round((price - discount) * quantity * (1 + taxRate));
    return subtotal;
  };

  const totalAmount = tableData.reduce((sum, row) => sum + calculateTotal(row.price, row.discount, row.quantity, row.taxRate), 0);

  const filterCategories2 = (category1) => {
    return categories2.filter((category) => category.category1 === category1);
  };

  const handleCategory1Change = (rowIndex, value) => {
    const filteredCategories2 = filterCategories2(value);
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, 'category1': value, 'category2': filteredCategories2[0]?.value || '' };
        updatedRow.amount = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleAddRow = () => {
    const initialCategroy2 = filterCategories2(categories1[0].value);
    const newRow = {
      id: uniqueId(),
      category1: categories1[0].value,
      category2: initialCategroy2[0]?.value || '',
      category3: '',
      productName: '',
      price: '',
      discount: '',
      quantity: '',
      taxRate: taxRates[0].value,
      amount: ''
    };
    setTableData([...tableData, newRow]);
  };

  const handleClearRow = (rowIndex) => {
    const initialCategroy2 = filterCategories2(categories1[0].value);
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = {
          ...row,
          category1: categories1[0].value,
          category2: initialCategroy2[0]?.value || '',
          category3: '',
          productName: '',
          price: '',
          discount: '',
          quantity: '',
          taxRate: taxRates[0].value,
          amount: ''
        };
        updatedRow.amount = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>大分類</th>
          <th>中分類</th>
          <th>商品分類</th>
          <th>商品名</th>
          <th>単価</th>
          <th>割引額</th>
          <th>数量</th>
          <th>税率</th>
          <th>金額</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={row.id}>
            <td>
              <select
                value={row.category1}
                onChange={(e) =>
                  handleCategory1Change(rowIndex, e.target.value)
                }
              >
                {categories1.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={row.category2}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'category2', e.target.value)
                }
              >
                {filterCategories2(row.category1).map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                value={row.category3}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'category3', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={row.productName}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'productName', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={row.price}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'price', parseInt(e.target.value))
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={row.discount}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'discount', parseInt(e.target.value))
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={row.quantity}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'quantity', parseInt(e.target.value))
                }
              />
            </td>
            <td>
              <select
                value={row.taxRate}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'taxRate', parseFloat(e.target.value))
                }
              >
                {taxRates.map((taxRate) => (
                  <option key={taxRate.value} value={taxRate.value}>
                    {taxRate.label}
                  </option>
                ))}
              </select>
            </td>
            <td>{isNaN(row.amount) ? '' : row.amount.toLocaleString()}</td>
            <td>
              <button onClick={() => handleClearRow(rowIndex)}>クリア</button>
              <button onClick={() => handleDeleteRow(rowIndex)}>削除</button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan="8">合計</td>
          <td>{totalAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <button onClick={handleAddRow}>行を追加する</button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={()=>console.log(totalAmount)}>console</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default EditableTable;
