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
    detail: []
  })

  const initialRowCount = 10;

  useEffect(() => {
    setForm({...form, detail: getDetailForms()});
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
    // fetch('http://localhost:5000/payment_insert', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "form": form
    //   }),
    //   headers: {
    //     "Content-type": "application/json; charset=utf-8"
    //   }
    // })
    // .then(response => response.json())
    // .catch(err => alert(err))

    // navigate('/');
    // setForm({...form, detail: getDetailForms()});
    console.log(getCurrentRow());
  }

  const calcSum = (idx, price) => {
    let sum = 0;
    let value = 0;

    for (let i = 0; i < form.detail.length; i++) {
      value = i === idx? price : Number(document.getElementById(`price-${i}`).value);
      sum += value;
    }
    
    document.getElementById('sum-amount-input').value = sum.toLocaleString();
  }

  const Row = ({idx}) => {

    const [detailForm, setDetailForm] = useState({
      detailNumber: idx,
      largeClass: form.detail[idx].largeClass,
      middleClass: form.detail[idx].middleClass,
      itemClass: form.detail[idx].itemClass,
      itemName: form.detail[idx].itemName,
      unitPrice: form.detail[idx].unitPrice,
      discount: form.detail[idx].discount,
      taxRate: form.detail[idx].taxRate,
      itemCount: form.detail[idx].itemCount,
      price: form.detail[idx].price
    })

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
              categorylist.map((category, index) => (
                <option key={index} value={category.cd}>{category.name}</option>
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
          <img onClick={()=>alert('click clear')} src={clear} alt='clear' className='payment-img'/>
        </td>
        <td className='col-image-button'>
          <img onClick={()=>alert('click delete')} src={del} alt='delete' className='payment-img'/>
        </td>
      </tr>
    )
  }

  const getDetailForms = () => {
    let forms = [];
    for (let i = 0; i < initialRowCount; i++) {
      forms.push({
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
    return forms;
  }

  const getCurrentRow = () => {
    let forms = [];

    for (let i = 0; i < form.detail.length; i++) {

      let form = {
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

      form.detailNumber = i;
      form.largeClass = document.getElementById(`large-class-${i}`).value;
      form.middleClass = document.getElementById(`middle-class-${i}`).value;
      form.itemClass = document.getElementById(`item-class-${i}`).value;
      form.itemName = document.getElementById(`item-name-${i}`).value;
      form.unitPrice = document.getElementById(`unit-price-${i}`).value;
      form.discount = document.getElementById(`discount-${i}`).value;
      form.taxRate = document.getElementById(`tax-rate-${i}`).value;
      form.itemCount = document.getElementById(`item-count-${i}`).value;
      form.price =  document.getElementById(`price-${i}`).value;

      forms.push(form);
    }

    return forms;
  }

  const addRows = () => {
    let forms = getCurrentRow();

    setForm({
      ...form, detail:[
      ...forms, {
      detailNumber: form.detail.length,
      largeClass: '',
      middleClass: '',
      itemClass: '',
      itemName: '',
      unitPrice: '',
      discount: '',
      taxRate: 1.10,
      itemCount: '',
      price: ''
    }]});
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
            <th colSpan={2} className='col-button'>
              <button className='button-cancel' onClick={addRows}>行＋</button>
            </th>
          </tr>
        </thead>
        <tbody id='test'>
          {form.detail.map((row, idx) => 
            <Row key={idx} idx={idx}/>
          )}
          <tr>
            <td colSpan={7}>
              <textarea id='payment-note' value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})} placeholder="備 考"/>
            </td>
            <td id='sum-label'><label>合計</label></td>
            <td id='sum-amount' className='col-payment'>
              <input type="text" id="sum-amount-input"/>
            </td>
            <td colSpan={2} className='col-button'>
              <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Payment;