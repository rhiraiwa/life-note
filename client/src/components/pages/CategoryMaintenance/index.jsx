import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";

const CategoryMaintenance = () => {
  return (
    <div>
      <FlexDiv>
        <LabelInput label='分類名' type='text'/>
        <button style={{height:'25px'}}>登録</button>
      </FlexDiv>
      <table>
        <thead>
          <tr>
            <th>CD</th>
            <th>分類名</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>食費</td>
            <td><button>編集</button></td>
            <td><button>削除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CategoryMaintenance;