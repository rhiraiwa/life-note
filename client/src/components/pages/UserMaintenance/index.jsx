import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
import './index.scss';

const UserMaintenance = () => {

  const [userlist, setUserlist] = React.useState([]);
  const [username, setUsername] = React.useState('');

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  React.useEffect(() => {
    fetch('http://localhost:5000/user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => setUserlist(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }, []);

  const insert_user = () => {

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
    .catch(err => alert(err))
  }

  return (
    <div id='user-maintenance'>
      <FlexDiv id='user-maintenance-input'>
        <LabelInput id='user-name' label='ユーザー名' type='text' value={username} setValue={handleUsername}/>
        <button className='button-primary' onClick={insert_user}>登録</button>
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
                <td className='col-image-button'><img src={edit} alt='edit'/></td>
                <td className='col-image-button'><img src={del} alt='delete'/></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default UserMaintenance;