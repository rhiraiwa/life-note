import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const UserMaintenance = () => {
  return (
    <div>
      <FlexDiv>
        <LabelInput label='ユーザー名' type='text'/>
        <button style={{height:'25px'}}>登録</button>
      </FlexDiv>
      <table>
        <thead>
          <tr>
            <th>CD</th>
            <th>ユーザー名</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>test_user</td>
            <td><button>編集</button></td>
            <td><button>削除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserMaintenance;