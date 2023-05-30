import React, { useEffect, useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import undo from '../../../img/undo.png';
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import { formatDate, formatMoney, formatTime, formatComma } from "../../utils/"
import NumberInput from "../../atoms/NumberInput";

const Deposit = () => {

  const date = new Date();
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  const {userlist, categorylist} = useMasterFileData();
  const [deposit, setDeposit] = useState({
    user: userlist[0].cd,
    category: categorylist[0].cd,
    amount: ''
  });
  const [statuslist, setStatuslist] = useState([]);
  const [historylist, setHistorylist] = useState([]);

  useEffect(() => {
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

  const undoDeposit = (category, date, amount, key) => {
    if (!window.confirm(`${formatDate(date)}の${category}, ${formatComma(amount)}円　の入金を取り消しますか？`)) {
      return;
    }
    
    fetch('http://localhost:5000/deposit_undo', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1,
        "user": deposit.user,
        "key": key
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
            <div id='deposit-amount'>
              <label>金額</label>
              <NumberInput id='deposit-amount-input' changeEvent={(e)=>setDeposit({...deposit, amount: e.target.value})}/>
            </div>
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
                  <td className='col-amount'>{formatMoney(status.budget)}</td>
                  <td className='col-amount'>{formatMoney(status.deposit)}</td>
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
                      <td className='col-amount'>{formatMoney(history.deposit)}</td>
                      <td className='col-year-month-date'>{formatDate(history.insert_date)}</td>
                      <td className='col-year-month-date'>{formatTime(history.insert_time)}</td>
                      <td className='col-image-button'>
                        <img src={undo} alt='undo' onClick={()=>undoDeposit(history.category_name, history.insert_date, history.deposit, history.key)}/>
                      </td>
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