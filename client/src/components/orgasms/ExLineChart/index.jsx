import { useEffect, useState } from 'react';
import { LineChart, ResponsiveContainer, Tooltip, moment, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const ExLineChart = ({data}) => {

  const [yAxis, setYAxis] = useState([]);

  useEffect(() => {
    if (data.length !== 0) getYAxis();
  },[data]);

  const getYAxis = () => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].sum) > max) {
        max = Number(data[i].sum) * 1.2;
      }
    }

    let yMax = parseInt((max + 1000) / 1000) * 1000;
    let axis = [];

    for (let i = 0; i < yMax + 5000; i += 5000) {
      axis.push(i);
    }

    setYAxis(axis);
  }

  return (
    <ResponsiveContainer width="95%">
      <LineChart
          data={data} // 表示するデータ  
          margin={{top: 10, right: 50, left: 50, bottom: 25}}>
        <XAxis // X軸
          dataKey="month" // X軸の基準となるデータ項目名
          // tickFormatter={(props) => props.format('YYYY/MM/DD')} // X軸を YYYY/MM/DD 形式で表示します
          unit='月'
        />
        <YAxis // Y軸
          domain={['dataMin', 'dataMax']}
          ticks={yAxis} // Y軸に表示する金額
          unit="円" // Y軸の単位
        />
        <CartesianGrid // ガイド線の表示
          stroke="#ccc"
          strokeDasharray="3 3"
        />
        <Tooltip // ツールチップの表示
          // labelFormatter={(props) => props.date.format('YYYY/MM/DD(ddd)')} // ラベルの表示フォーマット（日付）
        />
        <Line // 最高気温のデータを表示
          name="sum"
          dataKey="sum" // data のキー
          stroke="salmon" // 線の色
          unit="円" //単位
        />
        {/* <Line // 最低気温のデータを表示
          name="最低気温"
          dataKey="最低気温" // data のキー
          stroke="skyblue" // 線の色
          unit="℃" //単位
        /> */}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ExLineChart;