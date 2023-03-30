import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
import './index.scss';

const UserMaintenance = () => {
  return (
    <div id='user-maintenance'>
      <FlexDiv id='user-maintenance-input'>
        <LabelInput label='ユーザー名' type='text'/>
        <button className='button-primary'>登録</button>
      </FlexDiv>
      <table>
        <thead>
          <tr>
            <th className='col-cd'>CD</th>
            <th className='col-user'>ユーザー名</th>
            <th className='col-image-button'></th>
            <th className='col-image-button'></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='col-cd'>1</td>
            <td className='col-user'>user1</td>
            <td className='col-image-button'><img src={edit} alt='edit'/></td>
            <td className='col-image-button'><img src={del} alt='delete'/></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserMaintenance;