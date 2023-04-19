import React, { useEffect, useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import YearMonthChanger from "../../molecules/YearMonthChanger";
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import { formatComma, formatMoney } from "../../utils";
import Modal from "../../orgasms/Modal";

const Budget = () => {

  const date = new Date();
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date. getMonth()
  })
  const {userlist, categorylist} = useMasterFileData();
  const [budgetlist, setBudgetlist] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [sumlist, setSumlist] = useState([]);
  const [allSum, setAllsum] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [editor, setEditor] = useState(<></>);

  useEffect(() => {

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
      if (JSON.parse(json['budget']).length !== 0) {
        setUserCount(JSON.parse(json['budget'])[0]['userCount']);
      }
    })
    .catch(err => alert(err))
  }, [selected]);

  useEffect(() => {
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
    .then(setIsOpen(false))
    // .then(alert('予算を設定しました'))
    .catch(err => alert(err))
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
    // .then(alert('予算を設定しました'))
    .catch(err => alert(err))
  }
  
  const Editor = () => {
    return (
      <Modal title='予算設定' closeMethod={()=>setIsOpen(false)}>
        <FlexDiv>
          <table id='budget-table'>
            <thead>
              <tr>
                <th className='col-category'>カテゴリ</th>
                <th className='col-user'>ユーザー</th>
                <th className='col-amount'>金額</th>
              </tr>
            </thead>
            <tbody>
            {
              categorylist.map((category, i) => (
                userlist.map((user, j) => (
                  <tr key={`${i}_${j}`}>
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
            }
            </tbody>
          </table>
          <div className='budget-right'>
            {
              categorylist.map((value, index) => (
                <LabelInput
                  key={index}
                  label={value.name}
                  type='text'
                  id={`category_${value.cd}_sum`}
                  isReadOnly={true}/>
              ))
            }
            <LabelInput label='合計' type='text' id='sum' isReadOnly={true}/>
            <FlexDiv>
              <button className='button-primary' onClick={insertBudget}>登録</button>
              <button className='button-cancel' onClick={()=>setIsOpen(false)}>キャンセル</button>
            </FlexDiv>
          </div>
        </FlexDiv>
      </Modal>
    );
  }

  const openEditor = () => {
    setIsOpen(true);
    setEditor(<Editor/>);
  }

  return (
    <FlexDiv id='budget'>
      <div>
        <FlexDiv>
          <YearMonthChanger state={{selected, setSelected}}/>
          {
            budgetlist.length !== 0 ? (
              <button className='button-primary' onClick={openEditor}>修正</button>
            )
            : (
              <FlexDiv id='new-budget-button-area'>
                <button className='button-primary' onClick={inheritBudget}>前月引継</button>
                <button className='button-primary' onClick={openEditor}>新規設定</button>
              </FlexDiv>
            )
          }
        </FlexDiv>
        {
          budgetlist.length !== 0 ?
          (
            <table id='budget-table'>
              <thead>
                <tr>
                  <th className='col-category'>カテゴリ</th>
                  <th className='col-user'>ユーザー</th>
                  <th className='col-amount'>金額</th>
                </tr>
              </thead>
              <tbody>
              {
                budgetlist.map((budget, index) => (
                  index % userCount === 0 ?
                  (<tr key={index}>
                      <td rowSpan={userCount} className='col-category'>{budget.category}</td>
                      <td className='col-user'>{budget.user}</td>
                      <td className='col-amount'>{formatMoney(budget.budget)}</td>
                    </tr>
                  )
                  : (
                      <tr key={index}>
                        <td className='col-user'>{budget.user}</td>
                        <td className='col-amount'>{formatMoney(budget.budget)}</td>
                      </tr>
                    )
                ))
              }
              </tbody>
            </table>
          )
          : (
          <div>
            <span>予算が設定されていません</span>
          </div>
          )
        }
      </div>
      <div className='budget-right'>
        {(budgetlist.length !== 0) && (
          <>
            {
              sumlist.map((value, index) => (
                <LabelInput
                  key={index}
                  label={value.category_name}
                  type='text'
                  // id={`category_${value.category_cd}_sum`}
                  value={formatComma(value.sum)}
                  isReadOnly={true}/>
              ))
            }
            <LabelInput label='合計' type='text' id='sum' value={formatComma(allSum)} isReadOnly={true}/>
          </>
          )
        }
      </div>
      {isOpen && editor}
    </FlexDiv>
  );
}

export default Budget;