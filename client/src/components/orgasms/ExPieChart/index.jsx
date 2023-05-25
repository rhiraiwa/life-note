import { useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ExPieChart = ({data, cdList}) => {

  //円グラフの各領域の色を定義
  const COLORS = [
    '#3f8799',
    '#993f3f',
    // '#3f87f4',
    // '#3f995d',
    // '#42993f'
  ];

    const RADIAN = Math.PI / 180;

    //円グラフのラベルの内容や表示場所を定義
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
          {/* {`${data[index].name}`} */}
        </text>
      );
    };
    

  return (
    <>
    <ResponsiveContainer>
      <PieChart //円グラフのhoverの設定などをする
        // onMouseEnter={this.onPieEnter} //hoverした時に。。。
      >
        <Pie //円グラフの位置や大きさ、データやラベルの内容を指定
          data={data}  //Array型のデータを指定
          nameKey="name" //データで表示させるタイトルを指定
          dataKey="value" //データで表示させる値(数値)を指定
          cx="50%"  //要素の左を基準に全体の50%移動
          cy="50%"  //要素の上を基準に全体の50%移動
          labelLine={false}  //ラベルの線の表示を消す
          label={renderCustomizedLabel} //ラベルの中身を指定。何も指定しなければパラメーターの値が表示される
          style={{userSelect:'none'}}
          tabIndex={-1}
        >
          { //円グラフの色を各領域ごとに分けるように指定
            cdList.map((entry, index) =>
            <Cell fill={COLORS[index % COLORS.length]} onClick={()=>alert(entry.middleClassCd)} style={{userSelect:'none'}} tabIndex={-1}/>)
          }
        </Pie>
        <Legend/>
        <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
    </>

  );
}

export default ExPieChart;