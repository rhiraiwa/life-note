import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";

const Budget = () => {

  const date = new Date();
  const [selected, setSelected] = React.useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })
  const {userlist, categorylist} = useMasterFileData();
  const [budgetlist, setBudgetlist] = React.useState([]);
  const [sumlist, setSumlist] = React.useState([]);
  const [allSum, setAllsum] = React.useState(0);
  const [modifyflag, setModifyflag] = React.useState(false);

  React.useEffect(() => {
    setModifyflag(false);

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
      setBudgetlist(JSON.parse(json['budget']));
      setSumlist(JSON.parse(json['sum']));
    })
    .catch(err => alert(err))
  }, [selected]);

  React.useEffect(() => {
    let sum = 0;
    for (let i = 0; i < sumlist.length; i++) {
      sum += Number(sumlist[i].sum);
    }
    setAllsum(sum);
  }, [sumlist]);

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

  const insertBudget = () => {
    let forms = [];
    let budget = 0;
    for (let i = 0; i < categorylist.length; i++) {
      for (let j = 0; j < userlist.length; j++) {
        budget = document.getElementById(`amount-${i}-${j}`).value;
        budget = budget === '' ? 0 : budget;
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
    
    setModifyflag(false);
  }

  const inheritBudget = () => {
    if (!window.confirm('前月と同じ予算で登録しますか？')) return;

    fetch('http://localhost:5000/budget_inherit', {
      method: 'POST',
      body: JSON.stringify({
        "year": selected.year,
        'month': selected.month + 1,
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
          <button className='button-primary' onClick={inheritBudget} disabled={budgetlist.length !== 0 && !modifyflag}>前月引継</button>
          {!modifyflag && 
            <button className='button-primary' disabled={budgetlist.length === 0} onClick={()=>setModifyflag(true)}>修正</button>
          }
          {modifyflag && 
            <button className='button-cancel' onClick={()=>setModifyflag(false)}>キャンセル</button>
          }
        </FlexDiv>
        <table id='budget-table'>
          <thead>
            <tr>
              <th className='col-category'>カテゴリ</th>
              <th className='col-user'>ユーザー</th>
              <th className='col-amount'>金額</th>
            </tr>
          </thead>
          <tbody>
          {(budgetlist.length !== 0 && !modifyflag) && (
            budgetlist.map((budget, index) => (
              <tr key={index}>
                <td className='col-category'>{budget.category}</td>
                <td className='col-user'>{budget.user}</td>
                <td className='col-amount'>{budget.budget}</td>
              </tr>
            ))
          )}
          {(budgetlist.length === 0 || modifyflag) && (
            categorylist.map((category, i) => (
              userlist.map((user, j) => (
                <tr key={i}>
                  {j === 0 && <td className='col-category' rowSpan={userlist.length}>{category.name}</td>}
                  <td className='col-user'>
                    {user.name}
                  </td>
                  <td className='col-amount'>
                    <input
                      className={`category category_${category.cd}`}
                      id={`amount-${i}-${j}`}
                      type='text'
                      onChange={()=>calcSum(`category_${category.cd}`)}
                      />
                  </td>
                </tr>
              ))
            ))
          )}
          </tbody>
        </table>
      </div>
      <div id='budget-right'>
          {(budgetlist.length === 0 || modifyflag) && (
            <>
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
            </>
            )
          }
          {(budgetlist.length !== 0 && !modifyflag) && (
            <>
              {
                sumlist.map((value) => (
                  <LabelInput
                    label={value.category_name}
                    type='text'
                    id={`category_${value.category_cd}_sum`}
                    value={value.sum}
                    isReadOnly={true}/>
                ))                
              }
              <LabelInput label='合計' type='text' id='sum' value={allSum} isReadOnly={true}/>
            </>
            )
          }
        <button className='button-primary' onClick={insertBudget} disabled={budgetlist.length !== 0 && !modifyflag}>登録</button>
      </div>
    </FlexDiv>
  );
}

export default Budget;