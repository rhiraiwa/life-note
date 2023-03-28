import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const Payment = () => {

  const categorylist = [
    {cd:'0', name: '食費'},
    {cd:'1', name: '雑費'},
    {cd:'2', name: '水道代'},
    {cd:'3', name: '電気代'}
  ]

  const userlist = [
    {cd: '0', name: 'user1'},
    {cd: '1', name: 'user2'}
  ]

  const [isDisable, setIsDisable] = React.useState(true);

  return (
    <FlexDiv>
      <div>
        <FlexDiv>
          <LabelInput label='年' type='text'/>
          <LabelInput label='月' type='text'/>
          <LabelInput label='日' type='text'/>
        </FlexDiv>
        <select>
          {
            categorylist.map((category) => (
              <option>{category.name}</option>
            ))
          }
        </select>
        <LabelInput label='金額' type='text'/>
        <LabelInput label='レシート' type='file'/>
        <LabelInput label='立替' type='checkbox' clickEvent={()=>setIsDisable(!isDisable)}/>
        <label>ユーザー</label>
        <select disabled={isDisable}>
          {
            userlist.map((user) => (
              <option>{user.name}</option>
            ))
          }
        </select>
        <LabelInput label='立替額' type='text' isDisabled={isDisable}/>
        <LabelInput label='備考' type='textarea'/>
        <button>登録</button>
      </div>
      <div style={{border:'1px solid #AAA', width:'300px'}}></div>
    </FlexDiv>
  );
}

export default Payment;