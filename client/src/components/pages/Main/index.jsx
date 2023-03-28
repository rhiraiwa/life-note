import React from 'react';
import testdata from '../../../Data.json';
import FlexDiv from '../../atoms/FlexDiv';
import LabelInput from '../../molecules/LabelInput';
import './index.scss';

const Table = ({year, month}) => {
  return (
    <table id='home-table'>
      <thead>
        <tr>
          <th>日</th>
          <th>曜日</th>
          <th>カテゴリ</th>
          <th>店名</th>
          <th>金額</th>
        </tr>
      </thead>
      <tbody>
        {getCompleteRow(testdata, year, month)}
      </tbody>
    </table>
  );
}

const getCompleteRow = (data, year, month) => {

  const lastDate = new Date(year, month + 1, 0).getDate();

  let rows = [];
  let next = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].date > next) {
      for (let j = next; j < data[i].date; j++) {
        rows.push(
          {
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
  if (next < lastDate) {
    for (let i = next; i <= lastDate; i++) {
      rows.push(
        {
          "date":i.toString(),
          "category":"",
          "shop_name":"",
          "amount":""
        }
      )
    }
  }

  let countMap = countDate(rows);
  let displayRows = formatRow(rows, countMap, year, month);

  return displayRows;
}

const countDate = (rows) => {
  let countMap = {
    "1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,
    "9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,
    "17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,
    "25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0
  }
  for (let i = 0; i < rows.length; i++) {
    switch (rows[i].date) {
      case "1" : countMap["1"] += 1;  break;
      case "2" : countMap["2"] += 1;  break;
      case "3" : countMap["3"] += 1;  break;
      case "4" : countMap["4"] += 1;  break;
      case "5" : countMap["5"] += 1;  break;
      case "6" : countMap["6"] += 1;  break;
      case "7" : countMap["7"] += 1;  break;
      case "8" : countMap["8"] += 1;  break;
      case "9" : countMap["9"] += 1;  break;
      case "10" : countMap["10"] += 1;  break;
      case "11" : countMap["11"] += 1;  break;
      case "12" : countMap["12"] += 1;  break;
      case "13" : countMap["13"] += 1;  break;
      case "14" : countMap["14"] += 1;  break;
      case "15" : countMap["15"] += 1;  break;
      case "16" : countMap["16"] += 1;  break;
      case "17" : countMap["17"] += 1;  break;
      case "18" : countMap["18"] += 1;  break;
      case "19" : countMap["19"] += 1;  break;
      case "20" : countMap["20"] += 1;  break;
      case "21" : countMap["21"] += 1;  break;
      case "22" : countMap["22"] += 1;  break;
      case "23" : countMap["23"] += 1;  break;
      case "24" : countMap["24"] += 1;  break;
      case "25" : countMap["25"] += 1;  break;
      case "26" : countMap["26"] += 1;  break;
      case "27" : countMap["27"] += 1;  break;
      case "28" : countMap["28"] += 1;  break;
      case "29" : countMap["29"] += 1;  break;
      case "30" : countMap["30"] += 1;  break;
      case "31" : countMap["31"] += 1;  break;
    }
  }
  
  return countMap;
}

const formatRow = (original, count, year, month) => {

  const days = ['日', '月', '火', '水', '木', '金', '土'];

  let rows = [];
  let index = 1;
  for (let i = 0; i < original.length; i++) {
    if (original[i].date > index) index++; 
    if (count[index] !== 0) {
      rows.push(
        <tr>
          <td rowSpan={count[index.toString()]}>{original[i].date}</td>
          <td rowSpan={count[index.toString()]}>{
            days[new Date(year, month, original[i].date).getDay()]
          }</td>
          <td>{original[i].category}</td>
          <td>{original[i].shop_name}</td>
          <td>{original[i].amount}</td>
        </tr>
      )
      count[index] = 0;
     }
    else {
      rows.push(
        <tr>
          <td>{original[i].category}</td>
          <td>{original[i].shop_name}</td>
          <td>{original[i].amount}</td>
        </tr>
      )
    }
  }

  return rows
}

export const YearMonthHandler = ({state}) => {

  const changeYearMonth = (type) => {
    let year = Number(state.selected.year);
    let month = Number(state.selected.month);

    if(type==='up') {
        if(month === 11) {
            year += 1;
            month = -1;
        }
        month += 1;
    }

    if(type==='down') {
        if(month === 0) {
            year -= 1;
            month = 12;
        }
        month -= 1;
    }

    state.setSelected({...state.selected, year:year, month:month});
  }

  return (
    <>
      <button onClick={()=>changeYearMonth('down')}>先月</button>
      <input type='text' value={state.selected.year}/>
      /
      <input type='text' value={state.selected.month + 1}/>
      <button onClick={()=>changeYearMonth('up')}>翌月</button>
    </>
  );
}

const Main = () => {

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  return (
    <>
      <FlexDiv>
        <div>
          <YearMonthHandler state={{selected, setSelected}}/>
          <div id='home-table-area'>
            <Table year={selected.year} month={selected.month}/>
          </div>
          <FlexDiv>
            <button>チャージ</button>
            <button>一括チャージ</button>
            <LabelInput label='小計' type='text' isReadOnly={true}/>
          </FlexDiv>
        </div>
        <div>
          <LabelInput label='予算' type='text' isReadOnly={true}/>
          <LabelInput label='入金' type='text' isReadOnly={true}/>
          <LabelInput label='支出' type='text' isReadOnly={true}/>
          <LabelInput label='収支' type='text' isReadOnly={true}/>
          <div>
            <label>メッセージ</label>
            <table style={{borderCollapse:'collapse', border: '1px solid #AAA'}}>
              <tbody>
                <tr>
                  <td>message</td>
                </tr>
                <tr>
                  <td>message</td>
                </tr>
                <tr>
                  <td>message</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </FlexDiv>
    </>
  );
}

export default Main;