import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const Budget = () => {

  const categorylist = [
    {cd:'0', name: '食費'},
    {cd:'1', name: '雑費'},
    {cd:'2', name: '水道代'},
    {cd:'3', name: '電気代'}
  ]

  const list2 = [
    {user: 'user1'},
    {user: 'user2'}
  ]

  const [burden, setBurden] = React.useState(2);

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
            {j === 0 && <td rowSpan={burden}>{categorylist[i].name}</td>}
            <td>
              <select>
                {
                  list2.map((value) => (
                    <option>{value.user}</option>
                  ))
                }
              </select>
            </td>
            <td>
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

  return (
    <FlexDiv>
      <div>
        <FlexDiv>
          <LabelInput label='年' type='text'/>
          <LabelInput label='月' type='text'/>
          <LabelInput label='負担人数' type='text' value={burden} setValue={setBurden}/>
          <button>新規作成</button>
          <button>前月引継</button>
          <button>修正</button>
        </FlexDiv>
        <table>
          <thead>
            <tr>
              <th>カテゴリ</th>
              <th>ユーザー</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {getRows()}
          </tbody>
        </table>
      </div>
      <div>
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
        <button>登録</button>
      </div>
    </FlexDiv>
  );
}

export default Budget;