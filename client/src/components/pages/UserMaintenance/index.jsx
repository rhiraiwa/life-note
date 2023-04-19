import { useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import NameEditor from "../../molecules/NameEditor";

const UserMaintenance = () => {

  const {userlist, setUserlist} = useMasterFileData();
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editor, setEditor] = useState(<></>);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const insertUser = () => {

    fetch('http://localhost:5000/user_insert', {
      method: 'POST',
      body: JSON.stringify({
        "username": username
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setUserlist(JSON.parse(json['data'])))
    .then(setUsername(''))
    .then(alert('登録しました')) //いらないかも
    .catch(err => alert(err))
  }

  const deleteUser = (cd, name) => {

    let isCancel = !window.confirm(`${cd}：${name} を削除しますか？`);
    if (isCancel) return;

    fetch('http://localhost:5000/user_delete', {
      method: 'POST',
      body: JSON.stringify({
        "usercd": cd
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setUserlist(JSON.parse(json['data'])))
    .then(setUsername(''))
    .then(alert('削除しました')) //いらないかも
    .catch(err => alert(err))
  }

  const editerOpen = (cd, name) => {
    setIsOpen(true);
    setEditor(<NameEditor cd={cd} name={name} close={()=>setIsOpen(false)} url='user_edit' reload={(list)=>setUserlist(list)}/>);
  }

  return (
    <div id='user-maintenance'>
      <FlexDiv id='user-maintenance-input'>
        <LabelInput id='user-name' label='ユーザー名' type='text' value={username} setValue={handleUsername}/>
        <button className='button-primary' onClick={insertUser}>登録</button>
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
          {
            userlist.map((user, index) => (
              <tr key={index}>
                <td className='col-cd'>{user.cd}</td>
                <td className='col-user'>{user.name}</td>
                <td className='col-image-button'>
                  <img onClick={()=>editerOpen(user.cd, user.name)} src={edit} alt='edit'/>
                </td>
                <td className='col-image-button'>
                  <img onClick={()=>deleteUser(user.cd, user.name)} src={del} alt='delete'/>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {isOpen && editor}
    </div>
  );
}

export default UserMaintenance;