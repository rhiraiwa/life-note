import { useEffect, useState } from "react";
import Modal from "../../orgasms/Modal";
import FlexDiv from "../../atoms/FlexDiv";
import './index.scss';

const NameEditor = ({cd, name, close, url, reload}) => {
    
  const [newName, setNewName] = useState(name);

  useEffect(() => {document.getElementById('newName-input').focus()},[]);
  
  const editUser = (cd) => {

    let isCancel = !window.confirm(`${cd}：${name} を変更しますか？`);
    if (isCancel) return;

    fetch(`http://localhost:5000/${url}`, {
      method: 'POST',
      body: JSON.stringify({
        "cd": cd,
        "name": newName
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => reload(JSON.parse(json['data'])))
    .then(setNewName(''))
    .then(close)
    .then(alert('変更しました'))
    .catch(err => alert(err))
  }

  return (
    <Modal title='名称変更' closeMethod={close}>
      <div id='name-editor'>
        <div id='name-editor-input-area'>
          <label>{cd}</label>：
          <input type='text' id='newName-input' value={newName} onChange={(e)=>setNewName(() => e.target.value)}/>          
        </div>
        <FlexDiv id='name-editor-button-area'>
          <button className='button-primary' onClick={()=>editUser(cd)}>変更</button>
          <button className='button-cancel' onClick={close}>キャンセル</button>
        </FlexDiv>
      </div>
    </Modal>
  )
}

export default NameEditor;