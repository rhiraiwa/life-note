import React, { useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";

const AdvancesPaid = () => {

  const {userlist} = useMasterFileData();
  const [advancesPaidlist, setAdvancesPaidlist] = React.useState([]);
  const [sum, setSum] = React.useState(0);

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth(),
    user: ''
  })

  React.useEffect(() => {
    fetch('http://localhost:5000/advances_paid_select', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1,
        "user": selected.user
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      setAdvancesPaidlist(JSON.parse(json['data']))
    })
    .catch(err => alert(err))
  }, [selected]);

  React.useEffect(() => {
    let sum = 0;

    for (let i = 0; i < advancesPaidlist.length; i++) {
      sum += Number(advancesPaidlist[i].amount);
    }

    setSum(sum);
  }, [advancesPaidlist]);

  const setAdvancesPaid = (advancesPaid) => {
    document.getElementById('advances-paid_input').value = advancesPaid;
  }

  const clear = () => {
    document.getElementById('advances-paid_input').value = '';
  }

  const resetAdvancesPaidFlag = () => {
    fetch('http://localhost:5000/advances_paid_flag_reset', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1,
        "user": selected.user
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(setAdvancesPaidlist([]))
    .catch(err => alert(err))
  }

  return (
    <div id='advances-paid'>
      <div className='black-underline-2'>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          <div>
            <label>ユーザー</label>
            <select value={selected.user} onChange={(e)=>setSelected({...selected, user: e.target.value})}>
              <option value=''>選択してください</option>
              {
                userlist.map((user) => (
                  <option value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
        </FlexDiv>
        <FlexDiv id='bulk-return-area'>
          <LabelInput id='bulk-sum' label='立替額合計' type='text' value={sum} isReadOnly={true}/>
          <button className='button-primary' onClick={resetAdvancesPaidFlag}>一括返金登録</button>
        </FlexDiv>
      </div>
      <FlexDiv id='return-area'>
        <div id='advances-paid-list'>
          <span>立替一覧</span>
          <table>
            <thead>
              <tr>
                <th className='col-category'>カテゴリ</th>
                <th className='col-amount'>立替額</th>
                <th className='col-shop-name'>店名</th>
                <th className='col-year-month-date'>立替日</th>
              </tr>
            </thead>
            <tbody>
              {
                advancesPaidlist.map((history) => (
                  <tr onClick={()=>setAdvancesPaid(history.amount)}>
                    <td className='col-category'>{history.category}</td>
                    <td className='col-amount'>{history.amount}</td>
                    <td className='col-shop-name'>{history.shop_name}</td>
                    <td className='col-year-month-date'>{history.payment_date}</td>
                  </tr>                  
                ))
              }
            </tbody>
          </table>
        </div>
        <div>
          <LabelInput id='advances-paid' label='立替額' type='text' isReadOnly={true}/>
          <FlexDiv>
            <button className='button-primary'>返金登録</button>
            <button className='button-cancel' onClick={clear}>キャンセル</button>
          </FlexDiv>
        </div>
      </FlexDiv>
    </div>
  );
}

export default AdvancesPaid;