import React, { useState, useEffect } from "react";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { formatMoney } from "../../utils";
import FlexDiv from "../../atoms/FlexDiv";
import ExPieChart from "../../orgasms/ExPieChart";

const Result = () => {
  const date = new Date();
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })
  const [resultlist, setResultlist] = useState([]);
  const [sum, setSum] = useState({
    budget: 0,
    payment: 0
  })

  const [pieChartData, setPieChartData] = useState({
    data: [],
    cdList: []
  });

  useEffect(() => {
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

  useEffect(() => {
    let budgetSum = 0;
    let paymentSum = 0;
    for (let i = 0; i < resultlist.length; i++) {
      budgetSum += Number(resultlist[i].budget);
      paymentSum += Number(resultlist[i].payment);
    }
    setSum({...sum, budget: budgetSum, payment: paymentSum});
  }, [resultlist]);

  const getPieChartData = (largeClassCd) => {
    fetch('http://localhost:5000/pie_chart_select', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        "month": selected.month + 1,
        "large_class_cd": largeClassCd
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      let data = [];
      let cdList = [];

      let jd = JSON.parse(json['data'])
      for (let i = 0; i < JSON.parse(json['data']).length; i++) {

        data.push({
          name: jd[i].middleClassName,
          value: Number(jd[i].sum)
        })

        cdList.push({
          middleClassCd: jd[i].middleClassCd
        });
      }
      setPieChartData({...pieChartData, data: data, cdList: cdList});
    })
    .catch(err => alert(err))
  }

  return (
    <div id='result'>
      <YearMonthChanger state={{selected, setSelected}}/>
      <FlexDiv id='main-table'>
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
                <tr key={index} onClick={()=>getPieChartData(result.categoryCd)}>
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
        <div id='pie-chart-area' style={{width:'300px', height:'300px'}}>
          <ExPieChart data={pieChartData.data} cdList={pieChartData.cdList}/>
        </div>
      </FlexDiv>
    </div>
  );
}

export default Result;