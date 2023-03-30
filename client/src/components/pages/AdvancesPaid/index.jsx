import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';

const AdvancesPaid = () => {

  const adlist = [
    {categary:'0', amount: '1500', shopName: 'AEON', date: '2023/2/23'},
    {categary:'0', amount: '1500', shopName: 'AEON', date: '2023/2/23'},
    {categary:'0', amount: '1500', shopName: 'AEON', date: '2023/2/23'},
    {categary:'0', amount: '1500', shopName: 'AEON', date: '2023/2/23'}
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

  const setAdvancesPaid = (advancesPaid) => {
    document.getElementById('advances-paid_input').value = advancesPaid;
  }

  const clear = () => {
    document.getElementById('advances-paid_input').value = '';
  }

  return (
    <div id='advances-paid'>
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
        <FlexDiv id='bulk-return-area'>
          <LabelInput id='bulk-sum' label='立替額合計' type='text' isReadOnly={true}/>
          <button className='button-primary'>一括返金登録</button>
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
                <th className='col-date'>立替日</th>
              </tr>
            </thead>
            <tbody>
              {
                adlist.map((history) => (
                  <tr onClick={()=>setAdvancesPaid(history.amount)}>
                    <td className='col-category'>{history.categary}</td>
                    <td className='col-amount'>{history.amount}</td>
                    <td className='col-shop-name'>{history.shopName}</td>
                    <td className='col-date'>{history.date}</td>
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