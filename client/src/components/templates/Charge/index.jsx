import React from "react";
import { useMasterFileData } from "../../../context/MasterFileContext";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';

const Charge = ({year, month}) => {
  const {userlist} = useMasterFileData();
  const [form, setForm] = React.useState({
    year: year,
    month: month,
    date: '',
    user: '',
    amount: ''
  })

  const chargeHistoryInsert = () => {
    fetch('http://localhost:5000/charge_history_insert', {
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
  }

  return (
    <FlexDiv id='charge'>
      <span>{`${year}/${month}/`}</span>
      <input type='text' id='charge-date' value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})}/>
      <div id='charge-user'>
        <label>ユーザー</label>
        <select value={form.user} onChange={(e)=>setForm({...form, user: e.target.value})}>
          <option value=''>選択してください</option>
          {
            userlist.map((user, index) => (
              <option key={index} value={user.cd}>{user.name}</option>
            ))
          }
        </select>
      </div>
      <LabelInput id='charge-amount' label='金額' type='text' value={form.amount} setValue={(e)=>setForm({...form, amount: e.target.value})}/>
      <button className='button-primary' onClick={chargeHistoryInsert}>登録</button>
    </FlexDiv>
  );
}

export default Charge;