import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';

const Budget = () => {

  const [categorylist, setCategorylist] = React.useState([]);
  const [userlist, setUserlist] = React.useState([]);
  const [burden, setBurden] = React.useState(2);

  React.useEffect(() => {
    fetch('http://localhost:5000/category_and_user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      setCategorylist(JSON.parse(json['category']))
      setUserlist(JSON.parse(json['user']))
    })
    .catch(err => alert(err))
  }, []);

  const calcSum = (target) => {
    let elements = document.getElementsByClassName(target);
    let sum = 0;
    for (let i = 0; i < elements.length; i++) {
      sum += Number(elements[i].value);
    }
    document.getElementById(`${target}_sum_input`).value = sum;

    let allElements = document.getElementsByClassName('category');
    let allSum = 0;
    for (let i = 0; i < allElements.length; i++) {
      allSum += Number(allElements[i].value);
    }
    document.getElementById('sum_input').value = allSum;
  }

  const getRows = () => {
    let rows = [];
    for (let i = 0; i < categorylist.length; i++) {
      for (let j = 0; j < burden; j++) {
        rows.push(
          <tr key={i}>
            {j === 0 && <td className='col-category' rowSpan={burden}>{categorylist[i].name}</td>}
            <td className='col-user'>
              <select value={userlist[j].cd}>
                {
                  userlist.map((user) => (
                    <option value={user.cd}>{user.name}</option>
                  ))
                }
              </select>
            </td>
            <td className='col-amount'>
              <input
                className={`category category_${categorylist[i].cd}`}
                type='text'
                onChange={()=>calcSum(`category_${categorylist[i].cd}`)}
                />
            </td>
          </tr>
        )
      }
    }
    
    return rows;
  }

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })

  return (
    <FlexDiv id='budget'>
      <div>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          <button className='button-primary'>前月引継</button>
          <button className='button-primary' disabled>修正</button>
        </FlexDiv>
        <LabelInput id='burden' label='負担人数' type='text' value={burden} setValue={setBurden}/>
        <table>
          <thead>
            <tr>
              <th className='col-category'>カテゴリ</th>
              <th className='col-user'>ユーザー</th>
              <th className='col-amount'>金額</th>
            </tr>
          </thead>
          <tbody>
            {getRows()}
          </tbody>
        </table>
      </div>
      <div id='budget-right'>
          {
            categorylist.map((value) => (
              <LabelInput
                label={value.name}
                type='text'
                id={`category_${value.cd}_sum`}
                isReadOnly={true}/>
            ))
          }
        <LabelInput label='合計' type='text' id='sum' isReadOnly={true}/>
        <button className='button-primary'>登録</button>
      </div>
    </FlexDiv>
  );
}

export default Budget;