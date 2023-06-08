import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import EditableTable from "./EditableTable";

const Payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [initial] = useState(location.state);

  const {userlist} = useMasterFileData();
  const [isDisable, setIsDisable] = useState(true);
  
  const [header, setHeader] = useState([]);
  const [detail, setDetail] = useState([]);
  
  // 金額計算
  const calculateTotal = (price, discount, quantity, taxRate) => {
    const subtotal = Math.round((Number(price) - Number(discount)) * Number(quantity) * (1 + Number(taxRate)));
    return subtotal;
  };
  
  const totalAmount = detail.reduce((sum, row) => sum + calculateTotal(row.unitPrice, row.discount, row.itemCount, row.taxRate), 0);

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

  useEffect(() => {

    getInitialHeader();

    if (!initial) return;
    if (initial.key === undefined) return;
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
      if (work[i].price === '') continue;
      if (work[i].discount === '') work[i].discount = 0;
      if (work[i].middleClass === '') work[i].middleClass = null;
      sendDetail.push(work[i]);
    }

    fetch('http://localhost:5000/payment_insert', {
      method: 'POST',
      body: JSON.stringify({
        "header": header,
        "sum": totalAmount,
        "detail": sendDetail
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
    let sendDetail = [];
    let work = detail;
    for (let i = 0; i < work.length; i++) {
      if (work[i].price === '') continue;
      if (work[i].discount === '') work[i].discount = 0;
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

    formattedString = parseFloat(formattedValue);

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
        <div className='payment-input-area'>
          <textarea id='payment-note' value={header.note} onChange={(e)=>setHeader({...header, note: e.target.value})} placeholder="備 考" autoComplete='off'/>
        </div>
        <div className='payment-input-area'>
          {
            initial ? 
              initial.header ? 
              <>
                <button className='button-primary' id='button-payment-registar' onClick={edit_payment}>修正</button>
                <button className='button-cancel' id='button-payment-back' onClick={()=>navigate('/')}>戻る</button>
              </>
              :
              <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button>
            : 
              <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button>
          }
        </div>
      </FlexDiv>
      <div id='detail-table-area'>
        <EditableTable detail={detail} setDetail={setDetail} totalAmount={totalAmount}/>
      </div>
    </>
  );
}

export default Payment;