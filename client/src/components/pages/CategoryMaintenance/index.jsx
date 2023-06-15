import { useEffect, useState } from "react";
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
  const [middleClassList, setMiddleClassList] = useState([]);
  const [largeClass, setLargeClass] = useState('');
  const [middleClassName, setMiddleClassName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/middle_class_select', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(json => setMiddleClassList(JSON.parse(json['data'])))
    .catch(err => alert(err))
  }, [categorylist])

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

  const insertMiddleClass = () => {

    fetch('http://localhost:5000/middle_class_insert', {
      method: 'POST',
      body: JSON.stringify({
        "largeClassCd": largeClass===''? categorylist[0].cd : largeClass,
        "middleClassName": middleClassName
      }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
      }
    })
    .then(response => response.json())
    .then(json => setCategorylist(JSON.parse(json['data'])))
    // .then(setLargeClass(''))
    .then(setMiddleClassName(''))
    .then(alert('登録しました')) //いらないかも
    .catch(err => alert(err))
  }

  const deleteCategory = (url, cd, name) => {

    let isCancel = !window.confirm(`${cd}：${name} を削除しますか？`);
    if (isCancel) return;

    fetch(`http://localhost:5000/${url}`, {
      method: 'POST',
      body: JSON.stringify({
        "cd": cd
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

  const editerOpen = (url, cd, name) => {
    setIsOpen(true);
    setEditor(<NameEditor cd={cd} name={name} close={()=>setIsOpen(false)} url={url} reload={(list)=>setCategorylist(list)}/>);
  }

  return (
    <div id='category-maintenance'>
      <FlexDiv className='category-maintenance-input'>
        <LabelInput label='大分類' type='text' value={categoryname} setValue={handleCategoryname}/>
        <button className='button-primary' onClick={insertCategory}>登録</button>
      </FlexDiv>
      {
        categorylist.length !== 0 &&
          <FlexDiv className='category-maintenance-input'>
            <label>中分類</label>
            <select value={largeClass} onChange={(e)=>setLargeClass(e.target.value)}>
              {
                categorylist.map((category, index) => (
                  <option key={index} value={category.cd}>{category.name}</option>
                ))
              }
            </select>
            <input type='text' value={middleClassName} onChange={(e)=>setMiddleClassName(e.target.value)}/>
            <button className='button-primary' onClick={insertMiddleClass}>登録</button>
          </FlexDiv>
      }
      <table>
        <thead>
          <tr>
            <th className='col-cd' colSpan={4}>大分類</th>
            <th className='col-cd' colSpan={4}>中分類</th>
          </tr>
        </thead>
        <tbody>
          {
            categorylist.map((category, i) => (
              middleClassList.filter((m) => {
                return m.large_class_cd === category.cd;
              }).map((middleClass, j) => (
                <tr key={`${i}_${j}`}>
                  {j === 0 && (
                    <>
                      <td className='col-cd' rowSpan={middleClassList.filter((m) => {
                        return m.large_class_cd === category.cd;
                      }).length}>{category.cd}</td>
                      <td className='col-category' rowSpan={middleClassList.filter((m) => {
                        return m.large_class_cd === category.cd;
                      }).length}>{category.name}</td>
                      <td className='col-image-button' rowSpan={middleClassList.filter((m) => {
                        return m.large_class_cd === category.cd;
                      }).length}>
                        <img onClick={()=>editerOpen('category_edit', category.cd, category.name)} src={edit} alt='edit'/>
                      </td>
                      <td className='col-image-button' rowSpan={middleClassList.filter((m) => {
                        return m.large_class_cd === category.cd;
                      }).length}>
                        <img onClick={()=>deleteCategory('category_delete', category.cd, category.name)} src={del} alt='delete'/>
                      </td>
                    </>
                  )}
                  <td className='col-cd'>
                    {middleClass.middle_class_cd}
                  </td>
                  <td className='col-category'>
                    {middleClass.middle_class_name}
                  </td>
                  <td className='col-image-button'>
                    {
                      middleClass.middle_class_name !== '' &&
                        <img onClick={()=>editerOpen('middle_class_edit', middleClass.middle_class_cd, middleClass.middle_class_name)} src={edit} alt='edit'/>
                    }
                  </td>
                  <td className='col-image-button'>
                    {
                      middleClass.middle_class_name !== '' &&
                      <img onClick={()=>deleteCategory('middle_class_delete', middleClass.middle_class_cd, middleClass.middle_class_name)} src={del} alt='delete'/>
                    }
                  </td>
                </tr>
              ))
            ))
          }
        </tbody>
      </table>
      {isOpen && editor}
    </div>
  );
}

export default CategoryMaintenance;