import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';

const Budget = () => {

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })
  const [categorylist, setCategorylist] = React.useState([]);
  const [userlist, setUserlist] = React.useState([]);
  const [budgetlist, setBudgetlist] = React.useState([]);
  // const [burden, setBurden] = React.useState(2);

  React.useEffect(() => {
    fetch('http://localhost:5000/budget_init', {
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
      setBudgetlist(JSON.parse(json['budget']))
      setCategorylist(JSON.parse(json['category']))
      setUserlist(JSON.parse(json['user']))
    })
    .catch(err => alert(err))
  }, [selected]);

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
      // for (let j = 0; j < burden; j++) {
      for (let j = 0; j < userlist.length; j++) {
        rows.push(
          <tr key={i}>
            {/* {j === 0 && <td className='col-category' rowSpan={burden}>{categorylist[i].name}</td>} */}
            {j === 0 && <td className='col-category' rowSpan={userlist.length}>{categorylist[i].name}</td>}
            <td className='col-user'>
              {/* <select value={userlist.length >= burden? userlist[j].cd : ''}>
                {
                  userlist.map((user) => (
                    <option value={user.cd}>{user.name}</option>
                  ))
                }
              </select> */}
              {userlist[j].name}
            </td>
            <td className='col-amount'>
              <input
                className={`category category_${categorylist[i].cd}`}
                id={`amount-${i}-${j}`}
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

  const insertBudget = () => {
    let forms = [];
    let budget = '';
    for (let i = 0; i < categorylist.length; i++) {
      for (let j = 0; j < userlist.length; j++) {
        budget = document.getElementById(`amount-${i}-${j}`).value;
        forms.push(
          {
            'year': selected.year,
            'month': selected.month + 1,
            'category': categorylist[i].cd,
            'user': userlist[j].cd,
            'budget': budget
          }
        );
      }
    }

    fetch('http://localhost:5000/budget_insert', {
      method: 'POST',
      body: JSON.stringify({
        "forms": forms
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setBudgetlist(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }

  return (
    <FlexDiv id='budget'>
      <div>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          <button className='button-primary'>前月引継</button>
          <button className='button-primary' disabled>修正</button>
        </FlexDiv>
        {/* <LabelInput id='burden' label='負担人数' type='text' value={burden} setValue={setBurden}/> */}
        {/* <label>{`負担人数${userlist.length}人`}</label> */}
        <table id='budget-table'>
          <thead>
            <tr>
              <th className='col-category'>カテゴリ</th>
              <th className='col-user'>ユーザー</th>
              <th className='col-amount'>金額</th>
            </tr>
          </thead>
          {budgetlist.length === 0 && (
            <tbody>
              {getRows()}
            </tbody>
          )}
          {budgetlist.length !== 0 && (
            <tbody>
              {budgetlist.map((budget, index) => (
                <tr key={index}>
                  <td className='col-category'>{budget.category}</td>
                  <td className='col-user'>{budget.user}</td>
                  <td className='col-amount'>{budget.budget}</td>
                </tr>
              ))}
            </tbody>
          )}
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
        <button className='button-primary' onClick={insertBudget}>登録</button>
      </div>
    </FlexDiv>
  );
}

export default Budget;