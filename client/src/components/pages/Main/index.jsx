import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import FlexDiv from '../../atoms/FlexDiv';
import LabelInput from '../../molecules/LabelInput';
import YearMonthChanger from '../../molecules/YearMonthChanger';
import Modal from '../../orgasms/Modal';
import Charge from '../../templates/Charge';
import money from '../../../img/charge.png';
import attention from '../../../img/attention.png';
import del from '../../../img/delete.png';
import recipt from '../../../img/recipt.png';
import './index.scss';
import { formatComma, formatMoney } from '../../utils';

const Table = ({year, month, data, selectRow, setSelectRow}) => {
  const navigate = useNavigate();

  return (
    <table id='home-table'>
      <thead>
        <tr>
          <th className='col-checkbox'></th>
          <th colSpan={2} className='col-date'>日</th>
          <th className='col-shop-name'>店名</th>
          <th className='col-amount'>金額</th>
          <th className='col-image-button'></th>
          <th className='col-image-button'></th>
        </tr>
      </thead>
      <tbody>
        {getCompleteRow(data, year, month, selectRow, setSelectRow, navigate)}
      </tbody>
    </table>
  );
}

const getCompleteRow = (data, year, month, selectRow, setSelectRow, navigate) => {

  const lastDate = new Date(year, month + 1, 0).getDate();
  
  let rows = [];
  let next = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].date > next) {
      for (let j = next; j < data[i].date; j++) {
        rows.push(
          {
            "date":j.toString(),
            "shop_name":"",
            "amount":"",
            "advancesPaidAmount":""
          }
        )
      }
    }
    rows.push(data[i]);
    next = Number(data[i].date) + 1;
  }
  if (next <= lastDate) {
    for (let i = next; i <= lastDate; i++) {
      rows.push(
        {
          "date":i.toString(),
          "shop_name":"",
          "amount":"",
          "advancesPaidAmount":""
        }
      )
    }
  }

  let countMap = countDate(rows);
  let displayRows = formatRow(rows, countMap, year, month, selectRow, setSelectRow, navigate);

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

const formatRow = (original, count, year, month, selectRow, setSelectRow, navigate) => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];

  const undoPayment = (key) => {

    if (!window.confirm('伝票を削除しますか？')) return;

    fetch('http://localhost:5000/home_undo', {
      method: 'POST',
      body: JSON.stringify({
        "key": key
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(() => window.location.reload())
    .catch(err => alert(err))
  }

  let rows = [];
  let index = 1;
  let day = '';
  let className = '';
  for (let i = 0; i < original.length; i++) {
    if (original[i].date > index) index++; 
    if (count[index] !== 0) {

      day = new Date(year, month, original[i].date).getDay();
      if (day === 0) className = 'sunday-row';
      else if (day === 6) className = 'saturday-row';
      else className  = 'other-day-row';

      if (selectRow !== undefined && original[i].key === selectRow) className += ' selected-row';

      rows.push(
        <tr key={i} className={className} onClick={()=>setSelectRow(original[i].key)}>
          <td rowSpan={count[index.toString()]} className='col-checkbox'>
            <input type='checkbox'/>
          </td>
          <td rowSpan={count[index.toString()]} className='col-date' onClick={()=>navigate('/payment', { state: {year: year, month: month+1, date: original[i].date }})}>{original[i].date}</td>
          <td rowSpan={count[index.toString()]} className='col-day' onClick={()=>navigate('/payment', { state: {year: year, month: month+1, date: original[i].date }})}>
            {`(${days[new Date(year, month, original[i].date).getDay()]})`}
          </td>
          <td className='col-shop-name'>{original[i].shop_name}</td>
          <td className='col-amount'>{original[i].shop_name === 'チャージ' ? formatMoney(original[i].advancesPaidAmount) : formatMoney(original[i].amount)}</td>
          <td className='col-image-button'>
            {!(original[i].category_name === '' || original[i].shop_name === '' || original[i].amount === '') && (
              <img onClick={()=>navigate('/payment', { state: {year: year, month: month+1, date: original[i].date, no: original[i].payment_number }})} src={recipt} alt='recipt'/>
            )}
          </td>
          <td className='col-image-button'>
            {!(original[i].category_name === '' || original[i].shop_name === '' || original[i].amount === '') && (
              <img onClick={()=>undoPayment(original[i].key)} src={del} alt='delete'/>
            )}
          </td>
        </tr>
      )
      count[index] = 0;
     }
    else {
      rows.push(
        <tr key={i} className={className} onClick={()=>setSelectRow(original[i].key)}>
          <td className='col-shop-name'>{original[i].shop_name}</td>
          <td className='col-amount'>{original[i].shop_name === 'チャージ' ? formatMoney(original[i].advancesPaidAmount) : formatMoney(original[i].amount)}</td>
          <td className='col-image-button'>
            {!(original[i].category_name === '' || original[i].shop_name === '' || original[i].amount === '') && (
              <img onClick={()=>navigate('/payment', { state: {year: year, month: month+1, date: original[i].date, no: original[i].payment_number }})} src={recipt} alt='recipt'/>
            )}
          </td>
          <td className='col-image-button'>
            <img onClick={()=>undoPayment(original[i].key)} src={del} alt='delete'/>
          </td>
        </tr>
      )
    }
  }

  return rows
}

const Main = () => {

  const date = new Date();
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  const [isOpen, setIsOpen] = useState(false);
  const [reference, setReference] = useState({
    budget: '',
    deposit: '',
    payment: '',
    balance: '',
    advancesPaid: 0
  })

  const [data, setData] = useState([]);
  const [noFilter, setNoFilter] = useState([]);
  const [filter, setFilter] = useState([]);

  const [selectRow, setSelectRow] = useState('');
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    setReference({...reference, budget: ''});

    fetch('http://localhost:5000/home', {
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
    .then(json => {
      let budget = 0;
      let deposit = 0;
      let payment = 0;
      let balance = 0;
      let advancesPaid = 0;
      if (JSON.parse(json['refarance'])[0].budget !== null) budget = JSON.parse(json['refarance'])[0].budget
      if (JSON.parse(json['refarance'])[0].deposit !== null) deposit = JSON.parse(json['refarance'])[0].deposit
      if (JSON.parse(json['refarance'])[0].payment !== null) payment = JSON.parse(json['refarance'])[0].payment
      if (JSON.parse(json['refarance'])[0].advances_paid !== null) advancesPaid = JSON.parse(json['refarance'])[0].advances_paid
      balance = deposit - payment;
      setReference({...reference, budget: budget, deposit: deposit, payment: payment, balance: balance, advancesPaid: advancesPaid});
      setNoFilter(JSON.parse(json['data']));

      let filter = [];
      for(let i = 0; i < JSON.parse(json['data']).length; i++) {
        
        if (JSON.parse(json['data'])[i].shop_name === 'チャージ') continue;

        filter.push(JSON.parse(json['data'])[i]);
      }

      setFilter(filter);
      setData(filter);
    })
    .catch(err => alert(err))
  }, [selected]);

  useEffect(() => {
    console.log(selectRow);
    if (selectRow === undefined || selectRow === '') return;
    fetch('http://localhost:5000/detail_select', {
      method: 'POST',
      body: JSON.stringify({
        "key": selectRow,
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => {setDetail(JSON.parse(json['detail']))})
    .catch(err => alert(err))
  }, [selectRow])

  const handleFilter = () => {
    let checkbox = document.getElementById('display-charge');
    let data = checkbox.checked? noFilter : filter;

    setData(data);
  }

  return (
    <>
      <FlexDiv id='main'>
        <div>
            <FlexDiv id='display-handler'>
              <YearMonthChanger state={{selected, setSelected}}/>
              <input type='checkbox' id='display-charge' onClick={handleFilter}/>
              <label htmlFor='display-charge'>チャージを含む</label>
            </FlexDiv>
          <div id='home-table-area'>
            <Table year={selected.year} month={selected.month} data={data} selectRow={selectRow} setSelectRow={setSelectRow}/>
          </div>
          <FlexDiv>
            <button className='button-primary home-button' onClick={()=>setIsOpen(true)}>
              <img src={money} alt='money'/>
              WAON
            </button>
            {/* <button className='button-primary home-button'>一括チャージ</button> */}
            <LabelInput id='subtotal' label='小計' type='text' isReadOnly={true}/>
          </FlexDiv>
        </div>
        {
          selectRow !== '' &&
          selectRow !== undefined &&
          detail.length !== 0 &&
          <div>
            <table id='sub-table'>
              <thead>
                <tr>
                  <th className='col-shop-name'>商品名</th>
                  <th className='col-count'>数量</th>
                  <th className='col-amount'>金額</th>
                </tr>
              </thead>
              <tbody>
                {
                  detail.map((value) => (
                    <tr>
                      <td className='col-shop-name'>{value.name}</td>
                      <td className='col-count'>{value.count}</td>
                      <td className='col-amount'>{formatMoney(value.price)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
        <div id='flex-right'>
          <LabelInput label='予算' type='text' isReadOnly={true} value={formatComma(reference.budget)}/>
          <LabelInput label='入金' type='text' isReadOnly={true} value={formatComma(reference.deposit)}/>
          <LabelInput label='支出' type='text' isReadOnly={true} value={formatComma(reference.payment)}/>
          <LabelInput label='収支' type='text' isReadOnly={true} value={formatComma(reference.balance)} id='balance'/>
          <div id='message-table'>
            <label>メッセージ</label>
            <table style={{borderCollapse:'collapse', border: '1px solid #AAA'}}>
              <tbody>
                {reference.budget === 0 &&
                  <tr>
                    <td><img src={attention} alt='attention'/>予算が設定されていません</td>
                  </tr>
                }
                {reference.budget > reference.deposit &&
                  <tr>
                    <td><img src={attention} alt='attention'/>入金額が不足しています</td>
                  </tr>
                }
                {reference.advancesPaid > 0 &&
                  <tr>
                    <td><img src={attention} alt='attention'/>立替が発生しています</td>
                  </tr>
                }
                {reference.budget !== 0 && reference.budget <= reference.deposit && reference.advancesPaid === 0 &&
                  <tr>
                    <td>メッセージはありません</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </FlexDiv>
      {
        isOpen &&
        <Modal title='カードチャージ登録' closeMethod={()=>setIsOpen(false)}>
          <Charge year={selected.year} month={selected.month+1}/>
        </Modal>
      }
    </>
  );
}

export default Main;