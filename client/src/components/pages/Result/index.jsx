import React from "react";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { formatMoney } from "../../utils";

const Result = () => {
  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })
  const [resultlist, setResultlist] = React.useState([]);
  const [sum, setSum] = React.useState({
    budget: 0,
    payment: 0
  })

  React.useEffect(() => {
    fetch('http://localhost:5000/result_select', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {setResultlist(JSON.parse(json['data']))})
    .catch(err => alert(err))
  }, [selected]);

  React.useEffect(() => {
    let budgetSum = 0;
    let paymentSum = 0;
    for (let i = 0; i < resultlist.length; i++) {
      budgetSum += Number(resultlist[i].budget);
      paymentSum += Number(resultlist[i].payment);
    }
    setSum({...sum, budget: budgetSum, payment: paymentSum});
  }, [resultlist]);

  return (
    <div id='result'>
      <YearMonthChanger state={{selected, setSelected}}/>
      <table>
        <thead>
          <tr>
            <th className='col-category'>カテゴリ</th>
            <th className='col-amount'>予算</th>
            <th className='col-amount'>実績</th>
            <th className='col-amount'>収支</th>
          </tr>
        </thead>
        <tbody>
          {
            resultlist.map((result, index) => (
              <tr key={index}>
                <td className='col-category'>{result.category}</td>
                <td className='col-amount'>{formatMoney(result.budget)}</td>
                <td className='col-amount'>{formatMoney(result.payment)}</td>
                <td className='col-amount'>{formatMoney(result.budget - result.payment)}</td>
              </tr>
            ))
          }
          <tr id='sum-row'>
            <td className='col-category'>合計</td>
            <td className='col-amount'>{formatMoney(sum.budget)}</td>
            <td className='col-amount'>{formatMoney(sum.payment)}</td>
            <td className='col-amount'>{formatMoney(sum.budget - sum.payment)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Result;