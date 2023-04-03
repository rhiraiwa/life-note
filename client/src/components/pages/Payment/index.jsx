import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';

const Payment = () => {
  
  const [categorylist, setCategorylist] = React.useState([]);
  const [userlist, setUserlist] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/category_and_user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      setCategorylist(JSON.parse(json['category']))
      setUserlist(JSON.parse(json['user']))
    })
    .catch(err => alert(err))
  }, []);

  const [isDisable, setIsDisable] = React.useState(true);

  return (
    <FlexDiv id='payment'>
      <div id='payment-input-area'>
        <FlexDiv id='payment-year-month-date'>
          <LabelInput id='payment-year' label='年' type='text'/>
          <LabelInput id='payment-month' label='月' type='text'/>
          <LabelInput id='payment-date' label='日' type='text'/>
        </FlexDiv>
        <div className='label-input'>
          <label>カテゴリ</label>
          <select>
            {
              categorylist.map((category) => (
                <option>{category.name}</option>
              ))
            }
          </select>
        </div>
        <LabelInput id='payment-amount' label='金額' type='text'/>
        <LabelInput id='payment-receipt' label='レシート' type='file'/>
        <LabelInput id='payment-advances-paid-check' label='立替' type='checkbox' clickEvent={()=>setIsDisable(!isDisable)}/>
        <div className='label-input'>
          <label>ユーザー</label>
          <select disabled={isDisable}>
            {
              userlist.map((user) => (
                <option>{user.name}</option>
              ))
            }
          </select>
        </div>
        <LabelInput id='payment-advances-paid-amount' label='立替額' type='text' isDisabled={isDisable}/>
        <LabelInput id='payment-note' label='備考' type='textarea'/>
        <button className='button-primary'>登録</button>
      </div>
      <div id='payment-receipt-preview'></div>
    </FlexDiv>
  );
}

export default Payment;