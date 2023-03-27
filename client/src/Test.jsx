import React from 'react';
import testdata from './Data.json';

const Row = ({data}) => {
  return (
    <tr>
      <td>{data.date}</td>
      <td>{data.category}</td>
      <td>{data.shop_name}</td>
      <td>{data.amount}</td>
    </tr>
  )
}

const Table = () => {

  return (
    <table>
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <Row/>
      </tbody>
    </table>
  );
}

const getCompleteRow = (data) => {
  let rows = [];
  let next = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].date > next) {
      for (let j = next; j < data[i].date; j++) {
        rows.push(
          {
            "year":"2023",
            "month":"1",
            "date":j.toString(),
            "category":"",
            "shop_name":"",
            "amount":""
          }
        )
      }
    }
    rows.push(data[i]);
    next = Number(data[i].date) + 1;
  }
  // 31は要変更
  if (next < 31) {
    for (let i = next; i <= 31; i++) {
      rows.push(
        {
          "year":"2023",
          "month":"1",
          "date":i.toString(),
          "category":"",
          "shop_name":"",
          "amount":""
        }
      )
    }
  }

  let countMap = countDate(rows);
  formatRow(rows);

  return rows;
}

const countDate = (rows) => {
  let countMap = {
    "a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0,"h":0,
    "i":0,"j":0,"k":0,"l":0,"m":0,"n":0,"o":0,"p":0,
    "q":0,"r":0,"s":0,"t":0,"u":0,"v":0,"w":0,"x":0,
    "y":0,"z":0,"aa":0,"ab":0,"ac":0,"ad":0,"ae":0
  }
  for (let i = 0; i < rows.length; i++) {
    switch (rows[i].date) {
      case "1" : countMap["a"] += 1;  break;
      case "2" : countMap["b"] += 1;  break;
      case "3" : countMap["c"] += 1;  break;
      case "4" : countMap["d"] += 1;  break;
      case "5" : countMap["e"] += 1;  break;
      case "6" : countMap["f"] += 1;  break;
      case "7" : countMap["g"] += 1;  break;
      case "8" : countMap["h"] += 1;  break;
      case "9" : countMap["i"] += 1;  break;
      case "10" : countMap["j"] += 1;  break;
      case "11" : countMap["k"] += 1;  break;
      case "12" : countMap["l"] += 1;  break;
      case "13" : countMap["m"] += 1;  break;
      case "14" : countMap["n"] += 1;  break;
      case "15" : countMap["o"] += 1;  break;
      case "16" : countMap["p"] += 1;  break;
      case "17" : countMap["q"] += 1;  break;
      case "18" : countMap["r"] += 1;  break;
      case "19" : countMap["s"] += 1;  break;
      case "20" : countMap["t"] += 1;  break;
      case "21" : countMap["u"] += 1;  break;
      case "22" : countMap["v"] += 1;  break;
      case "23" : countMap["w"] += 1;  break;
      case "24" : countMap["x"] += 1;  break;
      case "25" : countMap["y"] += 1;  break;
      case "26" : countMap["z"] += 1;  break;
      case "27" : countMap["aa"] += 1;  break;
      case "28" : countMap["ab"] += 1;  break;
      case "29" : countMap["ac"] += 1;  break;
      case "30" : countMap["ad"] += 1;  break;
      case "31" : countMap["ae"] += 1;  break;
    }
  }
  
  return countMap;
}

const formatRow = (originalRows) => {
  let rows = [];
  let count = 0;
  for (let i = 0; i < originalRows.length; i++) {
    for (let j = i; j < originalRows.length - 1; j++) {
      if (originalRows[j].date === originalRows[j+1].date) {
        count++;
      }
    }
    for (let k = count; k > 0; k--) {
      if (k === count) {
        rows.push(
          <tr>
            <td rowSpan={count}>{originalRows[i].date}</td>
            <td>{originalRows[i].category}</td>
            <td>{originalRows[i].shop_name}</td>
            <td>{originalRows[i].amount}</td>
          </tr>
        )
      }
      else {
        rows.push(
          <tr>
            <td>{originalRows[i].category}</td>
            <td>{originalRows[i].shop_name}</td>
            <td>{originalRows[i].amount}</td>
          </tr>
        )
      }
    }   
    count = 0; 
  }
  return rows
}

const Test = () => {
    return (
      <>
        <button>先月</button>
        <input type='text'/>
        /
        <input type='text'/>
        <button>翌月</button>
        <table>
          <thead>
            <tr>
              <th>日</th>
              <th>カテゴリ</th>
              <th>店名</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {getCompleteRow(testdata)}
          </tbody>
        </table>
      </>
    );
  }
  
  export default Test;