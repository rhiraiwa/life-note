import React from "react";
import { YearMonthHandler } from "../Main";

const Result = () => {
  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  return (
    <div>
      <YearMonthHandler state={{selected, setSelected}}/>
      <table>
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>予算</th>
            <th>実績</th>
            <th>収支</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
          </tr>
          <tr>
            <td>合計</td>
            <td>sum</td>
            <td>sum</td>
            <td>sum</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Result;