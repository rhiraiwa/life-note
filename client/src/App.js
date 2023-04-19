import React from "react";
import { Routes, Route } from "react-router-dom";
import PageTemplate from "./components/templates/PageTemplate";
import Main from "./components/pages/Main";
import Budget from "./components/pages/Budget";
import Deposit from "./components/pages/Deposit";
import Payment from "./components/pages/Payment";
import AdvancesPaid from "./components/pages/AdvancesPaid";
import Result from "./components/pages/Result";
import CategoryMaintenance from "./components/pages/CategoryMaintenance";
import UserMaintenance from "./components/pages/UserMaintenance"
import { useMasterFileData } from "./context/MasterFileContext";

function App() {

  const {userlist, setUserlist, categorylist, setCategorylist} = useMasterFileData();

  React.useEffect(() => {
    console.log(userlist);
    console.log(categorylist);
    console.log('list取得')
    fetch('http://localhost:5000/category_and_user_select', { method: 'POST' })
    .then(response => response.json())
    .then(json => {
      setCategorylist(JSON.parse(json['category']))
      setUserlist(JSON.parse(json['user']))
    })
    .catch(err => alert(err))
  },[]);

  return (
    <div className="App">
      <Routes>
        {
          userlist.length !== 0 && categorylist.length !== 0 &&
          <>
            <Route path='/' element={
              <PageTemplate title='ホーム'>
                <Main/>
              </PageTemplate>
            }/>
            <Route path='/Budget' element={
              <PageTemplate title='予算管理'>
                <Budget/>
              </PageTemplate>
            }/>
            <Route path='/Deposit' element={
              <PageTemplate title='入金入力'>
                <Deposit/>
              </PageTemplate>
            }/>
            <Route path='/Payment' element={
              <PageTemplate title='支払入力'>
                <Payment/>
              </PageTemplate>
            }/>
            <Route path='/AdvancesPaid' element={
              <PageTemplate title='立替管理'>
                <AdvancesPaid/>
              </PageTemplate>
            }/>
            <Route path='/Result' element={
              <PageTemplate title='実績照会'>
                <Result/>
              </PageTemplate>
            }/>
          </>
        }
        {
          userlist.length === 0 && categorylist.length === 0 &&
          <Route path='/' element={
            <PageTemplate title='ユーザーマスタメンテナンス'>
              <UserMaintenance/>
            </PageTemplate>
          }/>
        }
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
