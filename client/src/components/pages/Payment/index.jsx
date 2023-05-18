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

  const initialRowCount = 10;

  useEffect(() => {
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

    const [detailForm, setDetailForm] = useState({
      detailNumber: idx,
      largeClass: detailForms[idx].largeClass,
      middleClass: detailForms[idx].middleClass,
      itemClass: detailForms[idx].itemClass,
      itemName: detailForms[idx].itemName,
      unitPrice: detailForms[idx].unitPrice,
      discount: detailForms[idx].discount,
      taxRate: detailForms[idx].taxRate,
      itemCount: detailForms[idx].itemCount,
      price: detailForms[idx].price
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
          <input type='text'
                 id={`item-class-${idx}`}
                 value={detailForm.itemClass} 
                 onChange={(e)=>setDetailForm({...detailForm, itemClass: e.target.value})}
                 onBlur={()=>setDetailForms(detailForms.map((form, index) => (index === idx ? detailForm : form)))}
                 />
        </td>
        <td className='col-item'>
          <input type='text' id={`item-name-${idx}`}/>
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
          <input type='text' id={`price-${idx}`} value={detailForm.price} readOnly/>
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

  const addRows = () => {
    setDetailForms([
      ...detailForms, {
      detailNumber: detailForms.length,
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
        <div>
          <textarea id='payment-note' value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})} placeholder="備 考"/>
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
            <th>
          <button className='button-cancel' onClick={addRows}>行追加＋</button></th>
          </tr>
        </thead>
        <tbody id='test'>
          {detailForms.map((row, idx) => 
            <Row key={idx} idx={idx}/>
          )}
          <tr>
            <td colSpan={7}></td>
            <td id='sum-label'>合計</td>
            <td id='sum-amount'>1,000</td>
            <td>
          <button className='button-primary' id='button-payment-registar' onClick={insert_payment}>登録</button></td>
          </tr>
        </tbody>
      </table>
      {/* <FlexDiv id='note-area'>
        <textarea id='payment-note' value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})} placeholder="備 考"/>
        <div id='sum-area'>
        <FlexDiv id='payment-button-area'>
          <button className='button-cancel' onClick={addRows}>行追加＋</button>
          <button className='button-primary' onClick={insert_payment}>登録</button>
          <LabelInput id='payment-amount' label='合計' type='text' value={form.amount} setValue={(e)=>setForm({...form, amount: e.target.value})}/>
        </FlexDiv>
        </div>
      </FlexDiv> */}
    </>
  );
}

export default Payment;