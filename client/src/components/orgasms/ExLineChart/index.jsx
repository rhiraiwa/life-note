import { useEffect } from 'react';
import { LineChart, ResponsiveContainer, Tooltip, moment, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const ExLineChart = ({data}) => {

  useEffect(() => {
    console.log(data);
  },[]);

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
          // ticks={[0,5000,10000,15000,20000,25000,30000,35000,40000,45000,50000]} // Y軸に表示する温度
          ticks={[0,5000,10000,15000,20000,25000,30000]} // Y軸に表示する金額
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