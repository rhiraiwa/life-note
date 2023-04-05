import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import undo from '../../../img/undo.png';
import './index.scss';

const Deposit = () => {

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  const [categorylist, setCategorylist] = React.useState([]);
  const [userlist, setUserlist] = React.useState([]);
  const [deposit, setDeposit] = React.useState({
    user: '',
    category: '',
    amount: ''
  });
  const [statuslist, setStatuslist] = React.useState([]);
  const [historylist, setHistorylist] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/category_and_user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      setCategorylist(JSON.parse(json['category']))
      setUserlist(JSON.parse(json['user']))
      setDeposit({...deposit, user: JSON.parse(json['user'])[0].cd, category: JSON.parse(json['category'])[0].cd})
      //ここでふたつのリストを取得する
      //もしくはcategery_anduser_select以外の専用メソッドでふたつのリストも一緒に取得する
    })
    .catch(err => alert(err))
  }, []);

  //二つのリストはselectedが更新される度に取り直す

  const insert_deposit = () => {
    fetch('http://localhost:5000/deposit_insert', {
      method: 'POST',
      body: JSON.stringify({
        "year": date.getFullYear(),
        "month": date.getMonth() + 1,
        "date": date.getDate(),
        "user": deposit.user,
        "category": deposit.category,
        "amount": deposit.amount
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    // .then(json => setUserlist(JSON.parse(json['data'])))
    // .then(setUsername(''))
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
                userlist.map((user) => (
                  <option value={user.cd}>{user.name}</option>
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
                categorylist.map((category) => (
                  <option value={category.cd}>{category.name}</option>
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
              <tr>
                <td className='col-category'>test</td>
                <td className='col-amount'>test</td>
                <td className='col-amount'>test</td>
              </tr>
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
                <th className='col-image-button'></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='col-category'>test</td>
                <td className='col-amount'>test</td>
                <td className='col-year-month-date'>test</td>
                <td className='col-image-button'><img src={undo} alt='undo'/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </FlexDiv>
    </div>
  );
}

export default Deposit;