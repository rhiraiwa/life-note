import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';

const Charge = ({year, month}) => {

  const userlist = [
    {cd: '0', name: 'user1'},
    {cd: '1', name: 'user2'}
  ]

  return (
    <FlexDiv id='charge'>
      <span>{`${year}/${month}/`}</span>
      <input type='text' id='charge-date'/>
      <div id='charge-user'>
        <label>ユーザー</label>
        <select>
          {
            userlist.map((user) => (
              <option value={user.cd}>{user.name}</option>
            ))
          }
        </select>
      </div>
      <LabelInput id='charge-amount' label='金額' type='text'/>
      <button className='button-primary'>登録</button>
    </FlexDiv>
  );
}

export default Charge;