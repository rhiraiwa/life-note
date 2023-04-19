import { useState } from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
import './index.scss';
import { useMasterFileData } from "../../../context/MasterFileContext";
import NameEditor from "../../molecules/NameEditor";

const CategoryMaintenance = () => {

  const {categorylist, setCategorylist} = useMasterFileData();
  const [categoryname, setCategoryname] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editor, setEditor] = useState(<></>);

  const handleCategoryname = (e) => {
    setCategoryname(e.target.value);
  }

  const insertCategory = () => {

    fetch('http://localhost:5000/category_insert', {
      method: 'POST',
      body: JSON.stringify({
        "categoryname": categoryname
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setCategorylist(JSON.parse(json['data'])))
    .then(setCategoryname(''))
    .then(alert('登録しました')) //いらないかも
    .catch(err => alert(err))
  }

  const deleteCategory = (cd, name) => {

    let isCancel = !window.confirm(`${cd}：${name} を削除しますか？`);
    if (isCancel) return;

    fetch('http://localhost:5000/category_delete', {
      method: 'POST',
      body: JSON.stringify({
        "categorycd": cd
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setCategorylist(JSON.parse(json['data'])))
    .then(setCategoryname(''))
    .then(alert('削除しました')) //いらないかも
    .catch(err => alert(err))
  }

  const editerOpen = (cd, name) => {
    setIsOpen(true);
    setEditor(<NameEditor cd={cd} name={name} close={()=>setIsOpen(false)} url='category_edit' reload={(list)=>setCategorylist(list)}/>);
  }

  return (
    <div id='category-maintenance'>
      <FlexDiv id='category-maintenance-input'>
        <LabelInput label='カテゴリ名' type='text' value={categoryname} setValue={handleCategoryname}/>
        <button className='button-primary' onClick={insertCategory}>登録</button>
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
        {
            categorylist.map((category, index) => (
              <tr key={index}>
                <td className='col-cd'>{category.cd}</td>
                <td className='col-category'>{category.name}</td>
                <td className='col-image-button'>
                  <img onClick={()=>editerOpen(category.cd, category.name)} src={edit} alt='edit'/>
                </td>
                <td className='col-image-button'>
                  <img onClick={()=>deleteCategory(category.cd, category.name)} src={del} alt='delete'/>
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

export default CategoryMaintenance;