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
  const [isDisable, setIsDisable] = useState(true);
  
  const [header, setHeader] = useState([])
  const [detail, setDetail] = useState([]);

  const initialRowCount = 10;

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

    document.getElementById('sum-amount-input').value = Number(amount).toLocaleString();
  }
  
  const getInitialDetails = () => {
    let details = [];
    for (let i = 0; i < initialRowCount; i++) {
      details.push({
        detailNumber: i,
        largeClass: '',
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 1.10,
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
    .catch(err => alert(err))

    getInitialHeader();
    getInitialDetails();
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
    setDetail(getCurrentRows());
    setIsDisable(!isDisable)

    let checkbox = document.getElementById('payment-advances-paid-check_input');

    if (!checkbox.checked) {
      setHeader({...header, isAdvancePaid: 0, advancePaidUser: '', advancePaidAmount: ''});
      return;
    }

    setHeader({...header, isAdvancePaid: 1});
  }

  const insert_payment = () => {
    let detail = [];
    let work = getCurrentRows();
    for (let i = 0; i < work.length; i++) {
      if (work[i].price === '') continue;
      if (work[i].discount === '') work[i].discount = 0;
      detail.push(work[i]);
    }

    fetch('http://localhost:5000/payment_insert', {
      method: 'POST',
      body: JSON.stringify({
        "header": header,
        "sum": document.getElementById('sum-amount-input').value.replace(',', ''),
        "detail": detail
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .catch(err => alert(err))

    navigate('/');
  }

  const edit_payment = () => {
    let detail = [];
    let work = getCurrentRows();
    for (let i = 0; i < work.length; i++) {
      if (work[i].price === '') continue;
      if (work[i].discount === '') work[i].discount = 0;
      detail.push(work[i]);
    }

    fetch('http://localhost:5000/payment_edit', {
      method: 'POST',
      body: JSON.stringify({
        "header": header,
        "sum": document.getElementById('sum-amount-input').value.replace(',', ''),
        "detail": detail,
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

  // ヘッダー：「合計」計算　（detailの入力内容は保存されていないためsetStateしない）
  const calcSum = (idx, price) => {
    let sum = 0;
    let value = 0;

    for (let i = 0; i < detail.length; i++) {
      value = i === idx? price : Number(document.getElementById(`price-${i}`).value);
      sum += value;
    }
    
    document.getElementById('sum-amount-input').value = sum.toLocaleString();
  }

  const Row = ({idx}) => {

    const [detailForm, setDetailForm] = useState({
      detailNumber: idx,
      largeClass: detail[idx].largeClass,
      middleClass: detail[idx].middleClass,
      itemClass: detail[idx].itemClass,
      itemName: detail[idx].itemName,
      unitPrice: detail[idx].unitPrice,
      discount: detail[idx].discount,
      taxRate: detail[idx].taxRate,
      itemCount: detail[idx].itemCount,
      price: detail[idx].price
    })

    const [filter, setFilter] = useState([]);

    useEffect(() => {
      let filter = [];
      for (let i = 0; i < middleClasslist.length; i++) {
        if (middleClasslist[i].large_class_cd === Number(detailForm.largeClass)) {
          filter.push(middleClasslist[i]);
        }
      }
      setFilter(filter);
    }, [detailForm.largeClass])

    //明細：「金額」計算　（Tab移動が壊れるためdetailにはsetStateしない）
    const calcPrice = (e) => {
      let target = e.target.name;
      let value = e.target.value;

      let unitPrice = target==='unitPrice'? value : detailForm.unitPrice;
      let discount = target==='discount'? value : detailForm.discount;
      let taxRate = target==='taxRate'? value : detailForm.taxRate;
      let itemCount = target==='itemCount'? value : detailForm.itemCount;
      let wPrice = '';

      if (unitPrice !== '' && itemCount !== '') {
        wPrice = (unitPrice - discount) * taxRate * itemCount;
        wPrice = parseInt(wPrice);
      }
      setDetailForm({...detailForm, [target]: value, price: wPrice});

      calcSum(idx, wPrice);
    }

    return (
      <tr key={idx} id={`row-${idx}`}>
        <td className='col-class'>
          <select id={`large-class-${idx}`} value={detailForm.largeClass} onChange={(e)=>setDetailForm({...detailForm, largeClass: e.target.value})}>
            {
              categorylist.map((category, index) => (
                <option key={index} value={category.cd}>{category.name}</option>
              ))
            }
          </select>
        </td>
        <td className='col-class'>
          <select id={`middle-class-${idx}`} value={detailForm.middleClass} onChange={(e)=>setDetailForm({...detailForm, middleClass: e.target.value})}>
            {
              filter.map((middleClass, index) => (
                <option key={index} value={middleClass.middle_class_cd}>{middleClass.middle_class_name}</option>
              ))
            }
          </select>
        </td>
        <td className='col-class'>
          <input type='text'
                 id={`item-class-${idx}`}
                 value={detailForm.itemClass} 
                 onChange={(e)=>setDetailForm({...detailForm, itemClass: e.target.value})}
                 />
        </td>
        <td className='col-item'>
          <input type='text' 
                 id={`item-name-${idx}`}
                 value={detailForm.itemName} 
                 onChange={(e)=>setDetailForm({...detailForm, itemName: e.target.value})}
                 />
        </td>
        <td className='col-payment'>
          <input type='text' id={`unit-price-${idx}`} name='unitPrice' value={detailForm.unitPrice} onChange={(e)=>calcPrice(e)}/>
        </td>
        <td className='col-payment'>
          <input type='text' id={`discount-${idx}`} name='discount' value={detailForm.discount} onChange={(e)=>calcPrice(e)}/>
        </td>
        <td className='col-tax-rate'>
          <select id={`tax-rate-${idx}`} name='taxRate' value={detailForm.taxRate} onChange={(e)=>calcPrice(e)}>
            <option value={1.10}>10%</option>
            <option value={1.08}>8%</option>
            <option value={1.00}>税込</option>
          </select>
        </td>
        <td className='col-item-count'>
          <input type='text' id={`item-count-${idx}`} name='itemCount' value={detailForm.itemCount} onChange={(e)=>calcPrice(e)}/>
        </td>
        <td className='col-payment'>
          <input type='text' id={`price-${idx}`} value={detailForm.price} onChange={()=>alert('change!')} tabIndex={-1} readOnly/>
        </td>
        <td className='col-image-button'>
          <img onClick={()=>resetRow(idx)} src={clear} alt='clear' className='payment-img'/>
        </td>
        <td className='col-image-button'>
          <img onClick={()=>deleteRow(idx)} src={del} alt='delete' className='payment-img'/>
        </td>
      </tr>
    )
  }

  const getCurrentRows = () => {
    let rows = [];

    for (let i = 0; i < detail.length; i++) {

      let row = {
        detailNumber: 0,
        largeClass: '',
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 1.10,
        itemCount: '',
        price: ''
      }

      row.detailNumber = i;
      row.largeClass = document.getElementById(`large-class-${i}`).value;
      row.middleClass = document.getElementById(`middle-class-${i}`).value;
      row.itemClass = document.getElementById(`item-class-${i}`).value;
      row.itemName = document.getElementById(`item-name-${i}`).value;
      row.unitPrice = document.getElementById(`unit-price-${i}`).value;
      row.discount = document.getElementById(`discount-${i}`).value;
      row.taxRate = document.getElementById(`tax-rate-${i}`).value;
      row.itemCount = document.getElementById(`item-count-${i}`).value;
      row.price =  document.getElementById(`price-${i}`).value;

      rows.push(row);
    }

    return rows;
  }

  const addRow = () => {
    let rows = getCurrentRows();

    setDetail([
      ...rows, {
      detailNumber: detail.length,
      largeClass: '',
      middleClass: '',
      itemClass: '',
      itemName: '',
      unitPrice: '',
      discount: '',
      taxRate: 1.10,
      itemCount: '',
      price: ''
    }]);
  }

  const resetRow = (rowNo) => {
    let rows = [];

    for (let i = 0; i < detail.length; i++) {

      let row = {
        detailNumber: 0,
        largeClass: '',
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 1.10,
        itemCount: '',
        price: ''
      }

      if (i !== rowNo) {
        row.detailNumber = i;
        row.largeClass = document.getElementById(`large-class-${i}`).value;
        row.middleClass = document.getElementById(`middle-class-${i}`).value;
        row.itemClass = document.getElementById(`item-class-${i}`).value;
        row.itemName = document.getElementById(`item-name-${i}`).value;
        row.unitPrice = document.getElementById(`unit-price-${i}`).value;
        row.discount = document.getElementById(`discount-${i}`).value;
        row.taxRate = document.getElementById(`tax-rate-${i}`).value;
        row.itemCount = document.getElementById(`item-count-${i}`).value;
        row.price =  document.getElementById(`price-${i}`).value;
      }

      rows.push(row);
    }

    setDetail(rows);
  }

  
  const deleteRow = (rowNo) => {
    let rows = [];

    for (let i = 0; i < detail.length; i++) {
      
      if (i === rowNo) continue;
      
      let row = {
        detailNumber: 0,
        largeClass: '',
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 1.10,
        itemCount: '',
        price: ''
      }

      row.detailNumber = i > rowNo? i - 1: i;
      row.largeClass = document.getElementById(`large-class-${i}`).value;
      row.middleClass = document.getElementById(`middle-class-${i}`).value;
      row.itemClass = document.getElementById(`item-class-${i}`).value;
      row.itemName = document.getElementById(`item-name-${i}`).value;
      row.unitPrice = document.getElementById(`unit-price-${i}`).value;
      row.discount = document.getElementById(`discount-${i}`).value;
      row.taxRate = document.getElementById(`tax-rate-${i}`).value;
      row.itemCount = document.getElementById(`item-count-${i}`).value;
      row.price =  document.getElementById(`price-${i}`).value;

      rows.push(row);
    }

    setDetail(rows);
  }

  const focusOnHeader = () => {
    setDetail(getCurrentRows());
  }

  return (
    <>
      <FlexDiv id='payment'>
        <div className='payment-input-area'>
          <FlexDiv id='payment-year-month-date'>
            <LabelInput id='payment-year' label='' type='text' value={header.year} setValue={(e)=>setHeader({...header, year: e.target.value})} focusEvent={focusOnHeader}/>
            <LabelInput id='payment-month' label='/' type='text' value={header.month} setValue={(e)=>setHeader({...header, month: e.target.value})} focusEvent={focusOnHeader}/>
            <LabelInput id='payment-date' label='/' type='text' value={header.date} setValue={(e)=>setHeader({...header, date: e.target.value})} focusEvent={focusOnHeader}/>
          </FlexDiv>
          <LabelInput id='payment-shop-name' label='店名' type='text' value={header.shopName} setValue={(e)=>setHeader({...header, shopName: e.target.value})} focusEvent={focusOnHeader}/>
        </div>
        <div className='payment-input-area'>
          <LabelInput id='payment-advances-paid-check' label='立替' type='checkbox' clickEvent={handleAdvancePaid}/>
          <div className='label-input'>
            <label>ユーザー</label>
            <select value={header.advancePaidUser} onChange={(e)=>setHeader({...header, advancePaidUser: e.target.value})} disabled={isDisable} onFocus={focusOnHeader}>
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='payment-advances-paid-amount' label='立替額' type='text' value={header.advancePaidAmount} setValue={(e)=>setHeader({...header, advancePaidAmount: e.target.value})} isDisabled={isDisable} focusEvent={focusOnHeader}/>
        </div>
      </FlexDiv>
      <table id='detail-table'>
        <thead>
          <tr>
            <th className='col-class'>大分類</th>
            <th className='col-class'>中分類</th>
            <th className='col-class'>商品分類</th>
            <th className='col-item'>商品名</th>
            <th className='col-payment'>単価</th>
            <th className='col-payment'>割引</th>
            <th className='col-tax-rate'>税率</th>
            <th className='col-item-count'>数量</th>
            <th className='col-payment'>金額</th>
            <th colSpan={2} className='col-button'>
              <button className='button-cancel' onClick={addRow}>行＋</button>
            </th>
          </tr>
        </thead>
        <tbody id='test'>
          {detail.map((row, idx) => 
            <Row key={idx} idx={idx}/>
          )}
          <tr>
            <td colSpan={7}>
              <textarea id='payment-note' value={header.note} onChange={(e)=>setHeader({...header, note: e.target.value})} placeholder="備 考" onFocus={focusOnHeader}/>
            </td>
            <td id='sum-label'><label>合計</label></td>
            <td id='sum-amount' className='col-payment'>
              <input type="text" id="sum-amount-input" readOnly tabIndex={-1}/>
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
    </>
  );
}

export default Payment;