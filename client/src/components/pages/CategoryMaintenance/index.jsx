import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import LabelInput from "../../molecules/LabelInput";
import edit from '../../../img/edit.png';
import del from '../../../img/delete.png';
import './index.scss';

const CategoryMaintenance = () => {

  const [categorylist, setCategorylist] = React.useState([]);
  const [categoryname, setCategoryname] = React.useState('');

  const handleCategoryname = (e) => {
    setCategoryname(e.target.value);
  }

  React.useEffect(() => {
    fetch('http://localhost:5000/category_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => setCategorylist(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }, []);

  const insert_category = () => {

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
    .catch(err => alert(err))
  }

  const delete_category = (cd) => {

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
    .catch(err => alert(err))
  }

  return (
    <div id='category-maintenance'>
      <FlexDiv id='category-maintenance-input'>
        <LabelInput label='カテゴリ名' type='text' value={categoryname} setValue={handleCategoryname}/>
        <button className='button-primary' onClick={insert_category}>登録</button>
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
                <td className='col-image-button'><img src={edit} alt='edit'/></td>
                <td className='col-image-button'>
                  <img onClick={()=>delete_category(category.cd)} src={del} alt='delete'/>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default CategoryMaintenance;