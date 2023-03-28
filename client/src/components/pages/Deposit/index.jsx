import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const Deposit = () => {

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

  return (
    <div>
      <div>
        <FlexDiv>
          <LabelInput label='年' type='text'/>
          <LabelInput label='月' type='text'/>
          <select>
            {
              userlist.map((user) => (
                <option value={user.cd}>{user.name}</option>
              ))
            }
          </select>
        </FlexDiv>
        <FlexDiv>
          <select>
            {
              categorylist.map((category) => (
                <option>{category.name}</option>
              ))
            }
          </select>
          <LabelInput label='金額' type='text'/>
          <button>登録</button>
        </FlexDiv>
      </div>
      <FlexDiv>
        <div>
          <span>入金状況</span>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>予算</th>
                <th>入金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <span>入金履歴</span>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>入金額</th>
                <th>入金日</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
                <td><button>訂正</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </FlexDiv>
    </div>
  );
}

export default Deposit;