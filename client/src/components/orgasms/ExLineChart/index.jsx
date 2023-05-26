import { LineChart, ResponsiveContainer, Tooltip, moment, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const ExLineChart = () => {

  const data = [
    { date: '1', 最高気温: 10, 最低気温: 1 },
    { date: '2', 最高気温: 12, 最低気温: 4 },
    { date: '3', 最高気温: 18, 最低気温: 8 },
    { date: '4', 最高気温: 10, 最低気温: 0 },
    { date: '5', 最高気温: 9, 最低気温: 1 },
    { date: '6', 最高気温: 13, 最低気温: 2 },
    { date: '7', 最高気温: 16, 最低気温: 5 },
  ]

  return (
    <ResponsiveContainer width="95%">
      <LineChart
          data={data} // 表示するデータ  
          margin={{top: 10, right: 50, left: 50, bottom: 25}}>
        <XAxis // X軸
          dataKey="date" // X軸の基準となるデータ項目名
          // tickFormatter={(props) => props.format('YYYY/MM/DD')} // X軸を YYYY/MM/DD 形式で表示します
          unit='月'
        />
        <YAxis // Y軸
          domain={['dataMin', 'dataMax']}
          ticks={[-10,-5,0,5,10,15,20,25,30]} // Y軸に表示する温度
          unit="℃" // Y軸の単位
        />
        <CartesianGrid // ガイド線の表示
          stroke="#ccc"
          strokeDasharray="3 3"
        />
        <Tooltip // ツールチップの表示
          // labelFormatter={(props) => props.date.format('YYYY/MM/DD(ddd)')} // ラベルの表示フォーマット（日付）
        />
        <Line // 最高気温のデータを表示
          name="最高気温"
          dataKey="最高気温" // data のキー
          stroke="salmon" // 線の色
          unit="℃" //単位
        />
        <Line // 最低気温のデータを表示
          name="最低気温"
          dataKey="最低気温" // data のキー
          stroke="skyblue" // 線の色
          unit="℃" //単位
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ExLineChart;