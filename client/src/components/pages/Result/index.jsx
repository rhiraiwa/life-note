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
    cdList: [],
    largeClassCd: ''
  });

  const [detail, setDetail] = useState([]);

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
      setPieChartData({...pieChartData, data: data, cdList: cdList, largeClassCd: largeClassCd});
    })
    .catch(err => alert(err))
  }

  return (
    <div id='result'>
      <FlexDiv>
        <div id='main-table-area'>
          <YearMonthChanger state={{selected, setSelected}}/>
          <table id='main-table'>
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
        </div>
        <div id='result-detail-area'>
          {
            detail.length !== 0 && (
              <table id='result-detail-table'>
                <thead>
                  <tr>
                    <th className='col-result-date'>日付</th>
                    <th className='col-shop'>店名</th>
                    <th className='col-item-name'>商品名</th>
                    <th className='col-count'>数量</th>
                    <th className='col-amount'>金額</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    detail.map((value, index) => (
                      <tr key={index}>
                        <td className='col-result-date'>{value.date}</td>
                        <td className='col-shop'>{value.shop}</td>
                        <td className='col-item-name'>{value.name}</td>
                        <td className='col-count'>{value.count}</td>
                        <td className='col-amount'>{formatMoney(value.price)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </FlexDiv>
      <div id='pie-chart-area'>
        <ExPieChart year={selected.year}
                    month={selected.month} 
                    data={pieChartData.data} 
                    cdList={pieChartData.cdList} 
                    largeClassCd={pieChartData.largeClassCd}
                    setDetail={setDetail}
                    />
      </div>
    </div>
  );
}

export default Result;