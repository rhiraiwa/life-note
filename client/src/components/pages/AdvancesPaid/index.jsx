import React, { useEffect, useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import { formatComma, formatMoney } from "../../utils";

const AdvancesPaid = () => {

  const {userlist} = useMasterFileData();
  const [advancesPaidlist, setAdvancesPaidlist] = useState([]);
  const [sum, setSum] = useState(0);

  const date = new Date();
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date. getMonth(),
    user: userlist[0].cd
  })

  useEffect(() => {
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

  useEffect(() => {
    let sum = 0;

    for (let i = 0; i < advancesPaidlist.length; i++) {
      if (advancesPaidlist[i].refund_flag === 0) {
        sum += Number(advancesPaidlist[i].amount);
      }
    }

    setSum(sum);
  }, [advancesPaidlist]);

  // const setAdvancesPaid = (advancesPaid) => {
  //   document.getElementById('advances-paid_input').value = advancesPaid;
  // }

  // const clear = () => {
  //   document.getElementById('advances-paid_input').value = '';
  // }

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
    .then(json => {
      setAdvancesPaidlist(JSON.parse(json['data']))
    })
    .then(() => alert('返金処理を登録しました'))
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
              {
                userlist.map((user, index) => (
                  <option key={index} value={user.cd}>{user.name}</option>
                ))
              }
            </select>
          </div>
        </FlexDiv>
        <FlexDiv id='bulk-return-area'>
          <LabelInput id='bulk-sum' label='立替額合計' type='text' value={formatComma(sum)} isReadOnly={true}/>
          <button className='button-primary' onClick={resetAdvancesPaidFlag}>一括返金</button>
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
                <th>返金</th>
              </tr>
            </thead>
            <tbody>
              {
                advancesPaidlist.map((history, index) => (
                  <tr key={index}>
                    <td className='col-category'>{history.category}</td>
                    <td className='col-amount'>{formatMoney(history.amount)}</td>
                    <td className='col-shop-name'>{history.shop_name}</td>
                    <td className='col-year-month-date'>{history.payment_date}</td>
                    {
                      history.refund_flag === 1 ?
                        <td>済</td>
                      : <td>未</td>
                    }
                    {/* <td>{history.refund_flag === 1? '' : '済'}</td> */}
                    {/* <td><button className='button-primary'>返金</button></td> */}
                  </tr>                  
                ))
              }
            </tbody>
          </table>
        </div>
        {/* <div>
          <LabelInput id='advances-paid' label='立替額' type='text' isReadOnly={true}/>
          <FlexDiv>
            <button className='button-primary'>返金</button>
            <button className='button-cancel' onClick={clear}>キャンセル</button>
          </FlexDiv>
        </div> */}
      </FlexDiv>
    </div>
  );
}

export default AdvancesPaid;