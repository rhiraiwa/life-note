import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useMasterFileData } from "./context/MasterFileContext";
import PageTemplate from "./components/templates/PageTemplate";
import Main from "./components/pages/Main";
import Budget from "./components/pages/Budget";
import Deposit from "./components/pages/Deposit";
import Payment from "./components/pages/Payment";
import AdvancesPaid from "./components/pages/AdvancesPaid";
import Result from "./components/pages/Result";
import UserMaintenance from "./components/pages/UserMaintenance"
import CategoryMaintenance from "./components/pages/CategoryMaintenance";

function App() {

  const {setUserlist, setCategorylist} = useMasterFileData();
  const [elements, setElements] = useState({
    main: <UserMaintenance/>,
    budget: <></>,
    deposit: <></>,
    payment: <></>,
    advancesPaid: <></>,
    result: <></>
  })

  useEffect(() => {
    fetch('http://localhost:5000/category_and_user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      let user = JSON.parse(json['user']);
      let category = JSON.parse(json['category']);

      setUserlist(user);
      setCategorylist(category);
      
      if (user.length !== 0 && category.length !== 0) {
        setElements({
          ...elements,
          main: <Main/>,
          budget: <Budget/>,
          deposit: <Deposit/>,
          payment: <Payment/>,
          advancesPaid: <AdvancesPaid/>,
          result: <Result/>
        })
      }
    })
    .catch(err => alert(err))
  },[]);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={
          <PageTemplate title='ホーム'>
            {elements.main}
          </PageTemplate>
        }/>
        <Route path='/Budget' element={
          <PageTemplate title='予算管理'>
            {elements.budget}
          </PageTemplate>
        }/>
        <Route path='/Deposit' element={
          <PageTemplate title='入金入力'>
            {elements.deposit}
          </PageTemplate>
        }/>
        <Route path='/Payment' element={
          <PageTemplate title='支払入力'>
            {elements.payment}
          </PageTemplate>
        }/>
        <Route path='/AdvancesPaid' element={
          <PageTemplate title='立替管理'>
            {elements.advancesPaid}
          </PageTemplate>
        }/>
        <Route path='/Result' element={
          <PageTemplate title='実績照会'>
            {elements.result}
          </PageTemplate>
        }/>
        <Route path='/UserMaintenance' element={
          <PageTemplate title='ユーザーマスタメンテナンス'>
            <UserMaintenance/>
          </PageTemplate>
        }/>
        <Route path='/CategoryMaintenance' element={
          <PageTemplate title='カテゴリマスタメンテナンス'>
            <CategoryMaintenance/>
          </PageTemplate>
        }/>
      </Routes>
    </div>
  );
}

export default App;
