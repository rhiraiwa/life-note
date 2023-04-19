import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import undo from '../../../img/undo.png';
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import { formatDate, formatTime } from "../../utils/"

const Deposit = () => {

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  const {userlist, categorylist} = useMasterFileData();
  const [deposit, setDeposit] = React.useState({
    user: '',
    category: '',
    amount: ''
  });
  const [statuslist, setStatuslist] = React.useState([]);
  const [historylist, setHistorylist] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/deposit_init', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1,
        "user": deposit.user
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      setStatuslist(JSON.parse(json['status']));
      setHistorylist(JSON.parse(json['history']));
    })
    .catch(err => alert(err))
  }, [selected, deposit.user]);

  const insert_deposit = () => {
    let category = deposit.category === ''? categorylist[0].cd : deposit.category;

    fetch('http://localhost:5000/deposit_insert', {
      method: 'POST',
      body: JSON.stringify({
        "year": date.getFullYear(),
        "month": date.getMonth() + 1,
        "date": date.getDate(),
        "user": deposit.user,
        "category": category,
        "amount": deposit.amount
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      setStatuslist(JSON.parse(json['status']));
      setHistorylist(JSON.parse(json['history']));
    })
    .then(setDeposit({...deposit, amount: ''}))
    .catch(err => alert(err))
  }

  return (
    <div id='deposit'>
      <div className='black-underline-2'>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          <div>
            <label>ユーザー</label>
            <select value={deposit.user} onChange={(e)=>setDeposit({...deposit, user: e.target.value})}>
              <option value=''>選択してください</option>
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
        </FlexDiv>
        <FlexDiv id='deposit-input-area'>
          <div>
            <label>カテゴリ</label>
            <select value={deposit.category} onChange={(e)=>setDeposit({...deposit, category: e.target.value})}>
              {
                categorylist.map((category, index) => (
                  <option key={index} value={category.cd}>{category.name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <LabelInput id='deposit-amount' label='金額' type='text' value={deposit.amount} setValue={(e)=>setDeposit({...deposit, amount: e.target.value})}/>            
          </div>
          <button className='button-primary' onClick={insert_deposit}>登録</button>
        </FlexDiv>
      </div>
      <FlexDiv id='deposit-table-area'>
        <div id='deposit-status-table'>
          <span>入金状況</span>
          <table>
            <thead>
              <tr>
                <th className='col-category'>カテゴリ</th>
                <th className='col-amount'>予算</th>
                <th className='col-amount'>入金額</th>
              </tr>
            </thead>
            <tbody>
              {statuslist.map((status, index) => (
                <tr key={index}>
                  <td className='col-category'>{status.category_name}</td>
                  <td className='col-amount'>{status.budget}</td>
                  <td className='col-amount'>{status.deposit}</td>
                </tr>                
              ))}
            </tbody>
          </table>
        </div>
        <div id='deposit-history-table'>
          <span>入金履歴</span>
          <table>
            <thead>
              <tr>
                <th className='col-category'>カテゴリ</th>
                <th className='col-amount'>入金額</th>
                <th className='col-year-month-date'>入金日</th>
                <th className='col-year-month-date'>入金時刻</th>
                <th className='col-image-button'></th>
              </tr>
            </thead>
            <tbody>
                {
                  historylist.map((history, index) => (
                    <tr key={index}>
                      <td className='col-category'>{history.category_name}</td>
                      <td className='col-amount'>{history.deposit}</td>
                      <td className='col-year-month-date'>{formatDate(history.insert_date)}</td>
                      <td className='col-year-month-date'>{formatTime(history.insert_time)}</td>
                      <td className='col-image-button'><img src={undo} alt='undo'/></td>
                    </tr>                    
                  ))
                }
            </tbody>
          </table>
        </div>
      </FlexDiv>
    </div>
  );
}

export default Deposit;