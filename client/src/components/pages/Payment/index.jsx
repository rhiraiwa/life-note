import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';
import ReceiptPreview from "../../templates/ReceiptPreview";
import Modal from "../../orgasms/Modal";
import { useMasterFileData } from "../../../context/MasterFileContext";

const Payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [initialdate] = React.useState(location.state);

  const {userlist, categorylist} = useMasterFileData();
  const [isDisable, setIsDisable] = React.useState(true);
  const [form, setForm] = React.useState({
    year: initialdate? initialdate.year : '',
    month: initialdate? initialdate.month : '',
    date: initialdate? initialdate.date : '',
    category: '',
    shopName: '',
    amount: '',
    isAdvancePaid: 0,
    advancePaidUser: '',
    advancePaidAmount: '',
    note: '',
    filename: ''
  })

  const [isOpen, setIsOpen] = React.useState(false);
  const [preview, setPreview] = React.useState('');

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

  // const processing_image = () => {
  //   fetch('http://localhost:5000/image_processing', { method: 'POST' })
  //   .then(response => response.json())
  //   .catch(err => alert(err))
  // }

  const web_image = () => {

    let filename = Math.floor( Math.random() * 1000000 );
    setPreview(filename);
    
    fetch('http://localhost:5000/image_web', {
      method: 'POST',
      body: JSON.stringify({
        "filename": filename
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(() => setIsOpen(true))
    .then(() => console.log('setTrue'))
    .catch(err => alert(err))
  }

  return (
    <>
      <FlexDiv id='payment'>
        <div id='payment-input-area'>
          <FlexDiv id='payment-year-month-date'>
            <LabelInput id='payment-year' label='' type='text' value={form.year} setValue={(e)=>setForm({...form, year: e.target.value})}/>
            <LabelInput id='payment-month' label='/' type='text' value={form.month} setValue={(e)=>setForm({...form, month: e.target.value})}/>
            <LabelInput id='payment-date' label='/' type='text' value={form.date} setValue={(e)=>setForm({...form, date: e.target.value})}/>
          </FlexDiv>
          <div className='label-input'>
            <label>カテゴリ</label>
            <select value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})}>
              <option value=''>選択してください</option>
              {
                categorylist.map((category, index) => (
                  <option key={index} value={category.cd}>{category.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='payment-shop-name' label='店名' type='text' value={form.shopName} setValue={(e)=>setForm({...form, shopName: e.target.value})}/>
          <LabelInput id='payment-amount' label='金額' type='text' value={form.amount} setValue={(e)=>setForm({...form, amount: e.target.value})}/>
          <LabelInput id='payment-receipt' label='レシート' type='file'/>
          {/* <button onClick={processing_image}>画像処理</button>
          <button onClick={()=>setIsOpen(true)}>プレビュー</button> */}
          <button onClick={web_image}>WEBcamera</button>
          <LabelInput id='payment-advances-paid-check' label='立替' type='checkbox' clickEvent={handleAdvancePaid}/>
          <div className='label-input'>
            <label>ユーザー</label>
            <select value={form.advancePaidUser} onChange={(e)=>setForm({...form, advancePaidUser: e.target.value})} disabled={isDisable}>
              <option value=''>選択してください</option>
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='payment-advances-paid-amount' label='立替額' type='text' value={form.advancePaidAmount} setValue={(e)=>setForm({...form, advancePaidAmount: e.target.value})} isDisabled={isDisable}/>
          <LabelInput id='payment-note' label='備考' type='textarea' value={form.note} setValue={(e)=>setForm({...form, note: e.target.value})}/>
          <button className='button-primary' onClick={insert_payment}>登録</button>
        </div>
        <div id='payment-receipt-preview'>
          {
            form.filename !== '' &&
            <img src={'../receipt/preview/' + form.filename} alt='プレビュー' />
          }
        </div>
      </FlexDiv>
      {
        isOpen &&
        <Modal title='レシート画像プレビュー' closeMethod={()=>setIsOpen(false)}>
          <ReceiptPreview setPreview={(value)=>setForm({...form, filename: value})} closeMethod={()=>setIsOpen(false)} filename={preview}/>
        </Modal>
      }
    </>
  );
}

export default Payment;