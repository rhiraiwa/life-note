import React from "react";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';

const Result = () => {
  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

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
          <tr>
            <td className='col-category'>test</td>
            <td className='col-amount'>test</td>
            <td className='col-amount'>test</td>
            <td className='col-amount'>test</td>
          </tr>
          <tr>
            <td className='col-category'>合計</td>
            <td className='col-amount'>sum</td>
            <td className='col-amount'>sum</td>
            <td className='col-amount'>sum</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Result;