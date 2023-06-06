import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import clear from '../../../img/undo.png';
import del from '../../../img/delete.png';

const Payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [initial] = useState(location.state);

  const {userlist, categorylist} = useMasterFileData();
  const [middleClasslist, setMiddleClasslist] = useState([]);
  const taxRateOptions = [
    { label: '8%', value: 0.08 },
    { label: '10%', value: 0.1 },
    { label: '税込', value: 0 },
  ];
  const [isDisable, setIsDisable] = useState(true);
  
  const [header, setHeader] = useState([])
  const [detail, setDetail] = useState([]);

  const initialRowCount = 10;
  const [currentId, setCurrentId] = useState(initialRowCount);

  const uniqueId = () => {
    const newId = currentId + 1;
    setCurrentId(newId);
    return newId;
  };

  const getInitialHeader = () => {
    let year = '';
    let month = '';
    let date = '';
    let shopName = '';
    let amount = '';
    let isAdvancePaid = 0;
    let advancePaidUser = userlist[0].cd;
    let advancePaidAmount = '';
    let note = '';

    if (initial) {
      year = initial.year;
      month = initial.month;
      date = initial.date;
      if (initial.header) {
        shopName = initial.header.shop_name;
        amount = initial.header.amount;
        isAdvancePaid = initial.header.advancesPaidFlag;
        advancePaidAmount = initial.header.advancesPaidAmount;
        advancePaidUser = initial.header.advancesPaidUserCd;
        note = initial.header.note;
      }
    }
    setHeader({
      year: year,
      month: month,
      date: date,
      shopName: shopName,
      amount: amount,
      isAdvancePaid: isAdvancePaid,
      advancePaidUser: advancePaidUser,
      advancePaidAmount: advancePaidAmount,
      note: note
    });

    if (isAdvancePaid === '1') {
      document.getElementById('payment-advances-paid-check_input').checked = true;
      setIsDisable(false);
    }
  }
  
  const getInitialDetails = () => {
    let details = [];
    for (let i = 0; i < initialRowCount; i++) {
      details.push({
        detailNumber: i,
        largeClass: categorylist[0].cd,
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 0.08,
        itemCount: '',
        price: ''
      })
    }
    setDetail(details);
  }

  useEffect(() => {
    fetch('http://localhost:5000/middle_class_select', {method: 'POST'})
    .then(response => response.json())
    .then(json => {
      let middleClass = JSON.parse(json['data']);
      setMiddleClasslist(middleClass);
    })
    .then(getInitialHeader())
    .then(getInitialDetails())
    .catch(err => alert(err))
  }, [])

  useEffect(() => {
    if (!initial) return;
    if (initial.key === undefined) return;
    console.log(initial.key);
    fetch('http://localhost:5000/detail_select', {
      method: 'POST',
      body: JSON.stringify({
        "key": initial.key,
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {setDetail(JSON.parse(json['detail']))})
    .catch(err => alert(err))
  }, [])

  const handleAdvancePaid = () => {
    setIsDisable(!isDisable)

    let checkbox = document.getElementById('payment-advances-paid-check_input');

    if (!checkbox.checked) {
      setHeader({...header, isAdvancePaid: 0, advancePaidUser: '', advancePaidAmount: ''});
      return;
    }

    setHeader({...header, isAdvancePaid: 1});
  }

  const insert_payment = () => {
    let sendDetail = [];
    let work = detail;
    for (let i = 0; i < work.length; i++) {
      if (work[i].price === '' || work[i].price === 0) continue;
      if (work[i].discount === '') work[i].discount = 0;
      if (work[i].middleClass === '') work[i].middleClass = null;
      sendDetail.push(work[i]);
    }

    console.log(header);
    console.log(sendDetail);
    console.log(totalAmount);

    // fetch('http://localhost:5000/payment_insert', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "header": header,
    //     "sum": totalAmount,
    //     "detail": sendDetail
    //   }),
    //   headers: {
    //     "Content-type": "application/json; charset=utf-8"
    //   }
    // })
    // .then(response => response.json())
    // .catch(err => alert(err))

    // navigate('/');
  }

  const edit_payment = () => {
    let sendDetail = [];
    let work = detail;
    for (let i = 0; i < work.length; i++) {
      if (work[i].price === '' || work[i].price === 0) continue;
      if (work[i].discount === '') work[i].discount = 0;
      if (work[i].middleClass === '') work[i].middleClass = null;
      sendDetail.push(work[i]);
    }

    fetch('http://localhost:5000/payment_edit', {
      method: 'POST',
      body: JSON.stringify({
        "header": header,
        "sum": totalAmount,
        "detail": sendDetail,
        "key": initial.header.key
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .catch(err => alert(err))

    navigate('/');
  }

  const handleCellEdit = (rowIndex, columnName, value) => {
    
    setDetail((prevData) => {
      const updatedData = prevData.map((row, index) => {
        
        let unitPrice = columnName === 'unitPrice'? value : Number(row.unitPrice);
        let discount = columnName === 'discount'? value : Number(row.discount);
        let itemCount = columnName === 'itemCount'? value : Number(row.itemCount);
        let taxRate = columnName === 'taxRate'? value : Number(row.taxRate);
        let subtotal = Math.round((unitPrice - discount) * itemCount * (1 + taxRate));
        
        if (index === rowIndex) {
          return { ...row, [columnName]: value, price: subtotal}
        }
        return row;
      });
      return updatedData;
    });
  };

  // 金額計算
  const calculateAmount = (price, discount, quantity, taxRate) => {
    const subtotal = Math.round((price - discount) * quantity * (1 + taxRate));
    return subtotal;
  };

  const totalAmount = detail.reduce((sum, row) => sum + calculateAmount(row.unitPrice, row.discount, row.itemCount, row.taxRate), 0);

  const handleAddRow = () => {
    const newRow = {
      detailNumber: uniqueId(),
      largeClass: categorylist[0].cd,
      middleClass: '',
      itemClass: '',
      itemName: '',
      unitPrice: '',
      discount: '',
      itemCount: '',
      taxRate: 0.08,
      price: ''
    };
    setDetail((prevTableData) => [...prevTableData, newRow]);
  };

  const handleClearRow = (rowId) => {
    const updatedData = detail.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          largeClass: categorylist[0].cd,
          middleClass: '',
          itemClass: '',
          itemName: '',
          unitPrice: '',
          discount: '',
          itemCount: '',
          taxRate: 0.08,
          price: ''
        };
      }
      return row;
    });

    setDetail(updatedData);
  };

  const handleDeleteRow = (rowId) => {
    const updatedData = detail.filter((row) => row.id !== rowId);
    setDetail(updatedData);
  };

  const formatNumber = (e) => {
    // カンマを除去して数値だけを取得
    let inputValue = e.target.value.replace(/,/g, '');

    // 数値以外の文字を削除
    let formattedValue = inputValue.replace(/[^\d.-]/g, '');

    if (formattedValue === '') {
      setHeader({...header, [e.target.name]: ''});
      return;
    }
  
    let formattedString = '';

    // カンマを追加してフォーマット
    // if (e.target.name === 'advancePaidAmount') {
    //   formattedString = parseFloat(formattedValue).toLocaleString();
    // }
    // else {
      formattedString = parseFloat(formattedValue);
    // }
    setHeader({...header, [e.target.name]: formattedString});
  }

  return (
    <>
      <FlexDiv id='payment'>
        <div className='payment-input-area'>
          <FlexDiv id='payment-year-month-date'>
            <input id='payment-year_input' name='year' type='text' value={header.year} onChange={formatNumber} maxLength={4}/>
            /
            <input id='payment-month_input' name='month' type='text' value={header.month} onChange={formatNumber} maxLength={2}/>
            /
            <input id='payment-date_input' name='date' type='text' value={header.date} onChange={formatNumber} maxLength={2}/>
          </FlexDiv>
          <LabelInput id='payment-shop-name' label='店名' type='text' value={header.shopName} setValue={(e)=>setHeader({...header, shopName: e.target.value})}/>
        </div>
        <div className='payment-input-area'>
          <LabelInput id='payment-advances-paid-check' label='立替' type='checkbox' clickEvent={handleAdvancePaid}/>
          <div className='label-input'>
            <label>ユーザー</label>
            <select value={header.advancePaidUser} onChange={(e)=>setHeader({...header, advancePaidUser: e.target.value})} disabled={isDisable}>
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='payment-advances-paid-amount' label='立替額' type='text' value={header.advancePaidAmount} setValue={(e)=>setHeader({...header, advancePaidAmount: e.target.value})} isDisabled={isDisable}/>
        </div>
      </FlexDiv>
      <div id='detail-table-area'>
        <table id='detail-table'>
          <thead>
            <tr>
              <th className='col-class'>大分類</th>
              <th className='col-class'>中分類</th>
              <th className='col-class'>商品分類</th>
              <th className='col-item'>商品名</th>
              <th className='col-payment'>単価</th>
              <th className='col-payment'>割引</th>
              <th className='col-item-count'>数量</th>
              <th className='col-tax-rate'>税率</th>
              <th className='col-payment'>金額</th>
              <th colSpan={2} className='col-button'>
                <button className='button-cancel' onClick={handleAddRow}>行＋</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {detail.map((row, rowIndex) => {
              const amount = calculateAmount(row.unitPrice, row.discount, row.itemCount, row.taxRate, rowIndex);
              
              let filter = [];
              for (let i = 0; i < middleClasslist.length; i++) {
                if (middleClasslist[i].large_class_cd === Number(row.largeClass)) {
                  filter.push(middleClasslist[i]);
                }
              }

              // フィルタリングされたmiddleClassリストが存在し、かつrow.middleClassがnullの場合、最初の値を設定する
              if (filter.length > 0 && (row.middleClass === null || row.middleClass === '')) {
                {/* row.middleClass = filter[0].middle_class_cd; */}
                debugger;
                handleCellEdit(rowIndex, 'middleClass', filter[0].middle_class_cd);
              }

              return (
                <tr key={row.detailNumber}>
                  <td className='col-class'>
                    <select
                      value={row.largeClass}
                      onChange={(e) => handleCellEdit(rowIndex, 'largeClass', e.target.value)}
                    >
                      {
                        categorylist.map((category, index) => (
                          <option key={index} value={category.cd}>{category.name}</option>
                        ))
                      }
                    </select>
                  </td>
                  <td className='col-class'>
                    <select
                      value={row.middleClass}
                      onChange={(e) => handleCellEdit(rowIndex, 'middleClass', e.target.value)}
                    >
                      {filter.map((middleClass, index) => (
                        <option key={index} value={middleClass.middle_class_cd}>{middleClass.middle_class_name}</option>
                      ))}
                    </select>
                  </td>
                  <td className='col-class'>
                    <input
                      type="text"
                      value={row.itemClass}
                      onChange={(e) => handleCellEdit(rowIndex, 'itemClass', e.target.value)}
                    />
                  </td>
                  <td className='col-item'>
                    <input
                      type="text"
                      value={row.itemName}
                      onChange={(e) => handleCellEdit(rowIndex, 'itemName', e.target.value)}
                    />
                  </td>
                  <td className="hidden-step-wrapper col-payment">
                    <input
                      type="number"
                      step="0.01"
                      value={row.unitPrice}
                      onChange={(e) => handleCellEdit(rowIndex, 'unitPrice', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="hidden-step-wrapper col-payment">
                    <input
                      type="number"
                      step="0.01"
                      value={row.discount}
                      onChange={(e) => handleCellEdit(rowIndex, 'discount', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="hidden-step-wrapper col-item-count">
                    <input
                      type="number"
                      value={row.itemCount}
                      onChange={(e) => handleCellEdit(rowIndex, 'itemCount', parseInt(e.target.value))}
                    />
                  </td>
                  <td className='col-tax-rate'>
                    <select
                      value={row.taxRate}
                      onChange={(e) => handleCellEdit(rowIndex, 'taxRate', parseFloat(e.target.value))}
                    >
                      {taxRateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='col-payment'>{amount === 0? '' : amount.toLocaleString()}</td>
                  <td className='col-image-button'>
                    <img onClick={() => handleClearRow(row.id)} src={clear} alt='clear' className='payment-img'/>
                  </td>
                  <td className='col-image-button'>
                    <img onClick={() => handleDeleteRow(row.id)} src={del} alt='delete' className='payment-img'/>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={7}>
                <textarea id='payment-note' value={header.note} onChange={(e)=>setHeader({...header, note: e.target.value})} placeholder="備 考" autoComplete='off'/>
              </td>
              <td id='sum-label'><label>合計</label></td>
              <td id='sum-amount' className='col-payment'>
                {totalAmount.toLocaleString()}
              </td>
              <td colSpan={2} className='col-button'>
                {
                  initial ? 
                    initial.header ? 
                    <>
                      <button className='button-primary' id='button-payment-registar' onClick={edit_payment}>修正</button>
                      <button className='button-cancel' id='button-payment-registar' onClick={()=>navigate('/')}>戻る</button>
                    </>
                    :
                    <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button>
                  : 
                    <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Payment;