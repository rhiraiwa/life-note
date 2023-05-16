import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";

const Payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [initialdate] = useState(location.state);

  const {userlist, categorylist} = useMasterFileData();
  const [isDisable, setIsDisable] = useState(true);
  const [form, setForm] = useState({
    year: initialdate? initialdate.year : '',
    month: initialdate? initialdate.month : '',
    date: initialdate? initialdate.date : '',
    category: categorylist[0].cd,
    shopName: '',
    amount: '',
    isAdvancePaid: 0,
    advancePaidUser: userlist[0].cd,
    advancePaidAmount: '',
    note: '',
    filename: ''
  })
  const [rowCount, setRowCount] = useState(8);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // setRows(getRows());
    setDetailForms(getDetailForms());
  }, [])

  const handleAdvancePaid = () => {
    setIsDisable(!isDisable)

    let checkbox = document.getElementById('payment-advances-paid-check_input');

    if (!checkbox.checked) {
      setForm({...form, isAdvancePaid: 0, advancePaidUser: '', advancePaidAmount: ''});
      return;
    }

    setForm({...form, isAdvancePaid: 1});
  }

  const insert_payment = () => {
    fetch('http://localhost:5000/payment_insert', {
      method: 'POST',
      body: JSON.stringify({
        "form": form
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .catch(err => alert(err))

    navigate('/');
  }

  const [detailForms, setDetailForms] = useState([]);

  const Row = ({idx}) => {

    const calcPrice = (idx) => {
      let unitPrice = document.getElementById(`unit-price-${idx}`).value;
      let discount = document.getElementById(`discount-${idx}`).value;
      let taxRate = document.getElementById(`tax-rate-${idx}`).value;
      let itemCount = document.getElementById(`item-count-${idx}`).value;
      let wPrice = '';

      if (unitPrice !== '' && itemCount !== '') {
        wPrice = (unitPrice - discount) * taxRate * itemCount;
      }

      document.getElementById(`price-${idx}`).value = parseInt(wPrice);
    }

    return (
      <tr key={idx} id={`row-${idx}`}>
        <td className='col-class'>
          <select id={`large-class-${idx}`}>
            {
              categorylist.map((category, index) => (
                <option key={index} value={category.cd}>{category.name}</option>
              ))
            }
          </select>
        </td>
        <td className='col-class'>
          <select id={`middle-class-${idx}`}>
            {
              categorylist.map((category, index) => (
                <option key={index} value={category.cd}>{category.name}</option>
              ))
            }
          </select>
        </td>
        <td className='col-class'>
          <input type='text' id={`item-class-${idx}`} value={detailForms[idx].itemClass} onChange={(e)=>setDetailForms({...detailForms[idx], itemClass: e.target.value})}/>
        </td>
        <td className='col-item'>
          <input type='text' id={`item-name-${idx}`}/>
        </td>
        <td className='col-payment' onChange={()=>calcPrice(idx)}>
          <input type='text' id={`unit-price-${idx}`}/>
        </td>
        <td className='col-payment' onChange={()=>calcPrice(idx)}>
          <input type='text' id={`discount-${idx}`}/>
        </td>
        <td className='col-tax-rate' onChange={()=>calcPrice(idx)}>
          <select id={`tax-rate-${idx}`}>
            <option value={1.08}>8%</option>
            <option value={1.10}>10%</option>
            <option value={1.00}>税込</option>
          </select>
        </td>
        <td className='col-item-count'>
          <input type='text' id={`item-count-${idx}`} onChange={()=>calcPrice(idx)}/>
        </td>
        <td className='col-payment'>
          <input type='text' id={`price-${idx}`} readOnly/>
        </td>
      </tr>
    )
  }

  const getDetailForms = () => {
    let forms = [];
    for (let i = 0; i < rowCount; i++) {
      forms.push({
        detailNumber: i,
        largeClass: '',
        middleClass: '',
        itemClass: '',
        itemName: '',
        unitPrice: '',
        discount: '',
        taxRate: 1.08,
        itemCount: '',
        price: ''
      })
    }
    return forms;
  }

  // const getRows = () => {
  //   let rows = [];
  //   for (let i = 0; i < rowCount; i++) {
  //     rows.push(<Row key={i} idx={i}/>)
  //   }
  //   return rows;
  // }

  const addRows = () => {
    let wRows = [];
    let wRow;

    for (let i = 0; i < rows.length; i++) {
      wRow = document.getElementById(`row-${i}`);
      wRows.push(wRow);
    }
    
    wRows.push(<Row key={rows.length} idx={rows.length}/>);
    setRows(wRows);
  }

  return (
    <>
      <FlexDiv id='payment'>
        <div className='payment-input-area'>
          <FlexDiv id='payment-year-month-date'>
            <LabelInput id='payment-year' label='' type='text' value={form.year} setValue={(e)=>setForm({...form, year: e.target.value})}/>
            <LabelInput id='payment-month' label='/' type='text' value={form.month} setValue={(e)=>setForm({...form, month: e.target.value})}/>
            <LabelInput id='payment-date' label='/' type='text' value={form.date} setValue={(e)=>setForm({...form, date: e.target.value})}/>
          </FlexDiv>
          <LabelInput id='payment-shop-name' label='店名' type='text' value={form.shopName} setValue={(e)=>setForm({...form, shopName: e.target.value})}/>
          <LabelInput id='payment-amount' label='金額' type='text' value={form.amount} setValue={(e)=>setForm({...form, amount: e.target.value})}/>
        </div>
        <div className='payment-input-area'>
          <LabelInput id='payment-advances-paid-check' label='立替' type='checkbox' clickEvent={handleAdvancePaid}/>
          <div className='label-input'>
            <label>ユーザー</label>
            <select value={form.advancePaidUser} onChange={(e)=>setForm({...form, advancePaidUser: e.target.value})} disabled={isDisable}>
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='payment-advances-paid-amount' label='立替額' type='text' value={form.advancePaidAmount} setValue={(e)=>setForm({...form, advancePaidAmount: e.target.value})} isDisabled={isDisable}/>
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
          </tr>
        </thead>
        <tbody id='test'>
          {detailForms.map((row, idx) => 
            <Row key={idx} idx={idx}/>
          ) }
        </tbody>
      </table>
      <FlexDiv id='note-area'>
        <label>備考</label>
        <textarea id='payment-note' value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})}/>
      </FlexDiv>
      <FlexDiv id='payment-button-area'>
        <button className='button-cancel' onClick={addRows}>行の追加</button>
        <button className='button-primary' onClick={insert_payment}>登録</button>
      </FlexDiv>
    </>
  );
}

export default Payment;