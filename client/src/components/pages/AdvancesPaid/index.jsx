import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const AdvancesPaid = () => {

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
          <label>ユーザー</label>
          <select>
            {
              userlist.map((user) => (
                <option value={user.cd}>{user.name}</option>
              ))
            }
          </select>
        </FlexDiv>
        <FlexDiv>
          <LabelInput label='立替額合計' type='text' isReadOnly={true}/>
          <button>一括返金登録</button>
        </FlexDiv>
      </div>
      <FlexDiv>
        <div>
          <span>立替一覧</span>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>立替額</th>
                <th>立替日</th>
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
          <LabelInput label='立替額' type='text' isReadOnly={true}/>
          <button>返金登録</button>
        </div>
      </FlexDiv>
    </div>
  );
}

export default AdvancesPaid;