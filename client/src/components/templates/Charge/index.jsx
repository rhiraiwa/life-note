import React, { useState, useEffect } from "react";
import { useMasterFileData } from "../../../context/MasterFileContext";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import del from '../../../img/delete.png';
import { formatMoney } from "../../utils";
import './index.scss';

const Charge = ({year, month}) => {
  const {userlist} = useMasterFileData();
  const [form, setForm] = useState({
    year: year,
    month: month,
    date: '',
    user: userlist[0].cd,
    amount: ''
  })

  const [list, setList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/charge_history_select', {
      method: 'POST',
      body: JSON.stringify({
        "year": year,
        "month": month
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setList(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }, []);

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
    .then(json => setList(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }

  const chargeHistorydelete = (key) => {
    fetch('http://localhost:5000/charge_history_delete', {
      method: 'POST',
      body: JSON.stringify({
        "year": year,
        "month": month,
        "key": key
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setList(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }

  return (
    <>
      <FlexDiv id='charge'>
        <span>{`${year}/${month}/`}</span>
        <input type='text' id='charge-date' value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})}/>
        <div id='charge-user'>
          <label>ユーザー</label>
          <select value={form.user} onChange={(e)=>setForm({...form, user: e.target.value})}>
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
      <div id='charge-table-area'>
        <label id='charge-table-title'>履歴</label>
        {
          list.length !== 0 && 
          <table id='charge-table'>
            <thead>
              <tr>
                <th className='col-date'>日付</th>
                <th className='col-amount'>金額</th>
                <th className='col-charge-user'>ユーザー</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((value, index) => (
                  <tr key={index}>
                    <td className='col-date'>{value.date}</td>
                    <td className='col-amount'>{formatMoney(value.amount)}</td>
                    <td className='col-charge-user'>{value.user}</td>
                    <td className='col-image-button'>
                      <img onClick={()=>chargeHistorydelete(value.key)} src={del} alt='delete'/>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
      </div>
    </>
  );
}

export default Charge;