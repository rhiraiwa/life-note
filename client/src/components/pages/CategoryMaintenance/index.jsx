import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import './index.scss';

const CategoryMaintenance = () => {
  return (
    <div id='category-maintenance'>
      <FlexDiv id='category-maintenance-input'>
        <LabelInput label='カテゴリ名' type='text'/>
        <button className='button-primary'>登録</button>
      </FlexDiv>
      <table>
        <thead>
          <tr>
            <th className='col-cd'>CD</th>
            <th className='col-category'>カテゴリ名</th>
            <th className='col-image-button'></th>
            <th className='col-image-button'></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='col-cd'>1</td>
            <td className='col-category'>食費</td>
            <td className='col-image-button'><button>編集</button></td>
            <td className='col-image-button'><button>削除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CategoryMaintenance;