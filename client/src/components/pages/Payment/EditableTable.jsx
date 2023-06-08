import React, { useEffect, useState } from 'react';
import { useMasterFileData } from '../../../context/MasterFileContext';
import clear from '../../../img/undo.png';
import del from '../../../img/delete.png';
import './index.scss';

const EditableTable = ({detail, setDetail, totalAmount}) => {

  const { categorylist } = useMasterFileData();
  const [middleClasslist, setMiddleClasslist] = useState([]);

  const taxRates = [
    { label: '8%', value: 0.08 },
    { label: '10%', value: 0.1 },
    { label: '税込', value: 0 }
  ];

  const initialRowCount = 10;
  const [currentId, setCurrentId] = useState(initialRowCount);

  useEffect(() => {
    fetch('http://localhost:5000/middle_class_select', {method: 'POST'})
    .then(response => response.json())
    .then(json => {
      let middleClass = JSON.parse(json['data']);
      setMiddleClasslist(middleClass);
      getInitialDetails(middleClass)
    })
    .catch(err => alert(err))
  }, [])

  const filterCategories2 = (category1) => {
    return middleClasslist.filter((category) => category.large_class_cd === Number(category1));
  };

  const getInitialDetails = (middleClass) => {
    let details = [];
    for (let i = 0; i < initialRowCount; i++) {
      details.push({
        detailNumber: i,
        largeClass: categorylist[0].cd,
        middleClass: middleClass[0].middle_class_cd,  // largeClassでorderbyしているので問題ないはず
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: taxRates[0].value,
        itemCount: '',
        price: ''
      })
    }
    setDetail(details);
  }

  const uniqueId = () => {
    const newId = currentId + 1;
    setCurrentId(newId);
    return newId;
  };

  const handleCellEdit = (rowIndex, columnName, value) => {
    if (columnName === 'unitPrice' || columnName === 'discount' || columnName === 'itemCount') {
      value = isNaN(value) ? '' : parseInt(value);
    }
    const updatedData = detail.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, [columnName]: value };
        updatedRow.price = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setDetail(updatedData);
  };

  const calculateAmount = (row) => {
    const amount = Math.round((row.unitPrice - row.discount) * row.itemCount * (1 + row.taxRate));
    return isNaN(amount) ? 0 : amount;
  };

  const handleCategory1Change = (rowIndex, value) => {
    const filteredCategories2 = filterCategories2(value);
    const updatedData = detail.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, 'largeClass': value, 'middleClass': filteredCategories2[0]?.middle_class_cd || '' };
        updatedRow.price = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setDetail(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      detailNumber: uniqueId(),
      largeClass: categorylist[0].cd,
      middleClass: middleClasslist[0].middle_class_cd,
      itemClass: '',
      itemName: '',
      unitPrice: '',
      discount: '',
      itemCount: '',
      taxRate: taxRates[0].value,
      Price: ''
    };
    setDetail([...detail, newRow]);
  };

  const handleClearRow = (rowIndex) => {
    const updatedData = detail.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = {
          ...row,
          largeClass: categorylist[0].value,
          middleClass: middleClasslist[0].middle_class_cd,
          itemClass: '',
          itemName: '',
          unitPrice: '',
          discount: '',
          itemCount: '',
          taxRate: taxRates[0].value,
          price: ''
        };
        updatedRow.amount = calculateAmount(updatedRow);
        return updatedRow;
      }
      return row;
    });
    setDetail(updatedData);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = detail.filter((_, index) => index !== rowIndex);
    setDetail(updatedData);
  };

  return (
    <table id='detail-table'>
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
          <th colSpan={2} className='col-button'>
            <button className='button-cancel' onClick={handleAddRow}>行＋</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {detail.map((row, rowIndex) => (
          <tr key={row.detailNumber}>
            <td>
              <select
                value={row.largeClass}
                onChange={(e) =>
                  handleCategory1Change(rowIndex, e.target.value)
                }
              >
                {categorylist.map((category) => (
                  <option key={category.cd} value={category.cd}>
                    {category.name}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={row.middleClass}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'middleClass', e.target.value)
                }
              >
                {filterCategories2(row.largeClass).map((category) => (
                  <option key={category.middle_class_cd} value={category.middle_class_cd}>
                    {category.middle_class_name}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                value={row.itemClass}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'itemClass', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={row.itemName}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'itemName', e.target.value)
                }
              />
            </td>
            <td className="hidden-step-wrapper col-payment">
              <input
                type="number"
                value={row.unitPrice}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'unitPrice', parseInt(e.target.value))
                }
              />
            </td>
            <td className="hidden-step-wrapper col-payment">
              <input
                type="number"
                value={row.discount}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'discount', parseInt(e.target.value))
                }
              />
            </td>
            <td className="hidden-step-wrapper col-item-count">
              <input
                type="number"
                value={row.itemCount}
                onChange={(e) =>
                  handleCellEdit(rowIndex, 'itemCount', parseInt(e.target.value))
                }
              />
            </td>
            <td className='col-tax-rate'>
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
            <td className='col-price'>{isNaN(row.price) ? '' : row.price.toLocaleString()}</td>
            <td className='col-image-button'>
              <img onClick={() => handleClearRow(row.id)} src={clear} alt='clear' className='payment-img'/>
            </td>
            <td className='col-image-button'>
              <img onClick={() => handleDeleteRow(row.id)} src={del} alt='delete' className='payment-img'/>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={7}></td>
          <td>合計</td>
          <td className='col-price'>{totalAmount.toLocaleString()}</td>
          <td colSpan={2}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default EditableTable;
