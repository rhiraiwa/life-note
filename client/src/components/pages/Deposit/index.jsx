import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import undo from '../../../img/undo.png';
import './index.scss';

const Deposit = () => {

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

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  return (
    <div id='deposit'>
      <div className='black-underline-2'>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          <div>
            <label>ユーザー</label>
            <select>
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
            <select>
              {
                categorylist.map((category) => (
                  <option>{category.name}</option>
                ))
              }
            </select>
          </div>
          <LabelInput id='deposit-amount' label='金額' type='text'/>
          <button className='button-primary'>登録</button>
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