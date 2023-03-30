import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
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
            <td className='col-image-button'><img src={edit} alt='edit'/></td>
            <td className='col-image-button'><img src={del} alt='delete'/></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CategoryMaintenance;