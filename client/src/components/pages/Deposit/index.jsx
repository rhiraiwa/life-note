import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';

const Deposit = () => {

  const categorylist = [
    {cd:'0', name: '食費'},
    {cd:'1', name: '雑費'},
    {cd:'2', name: '水道代'},
    {cd:'3', name: '電気代'}
  ]

  const userlist = [
    {cd: '0', name: 'user1'},
    {cd: '1', name: 'user2'}
  ]

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
                <th className='col-date'>入金日</th>
                <th className='col-delete'></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='col-category'>test</td>
                <td className='col-amount'>test</td>
                <td className='col-date'>test</td>
                <td className='col-delete'><button>訂正</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </FlexDiv>
    </div>
  );
}

export default Deposit;