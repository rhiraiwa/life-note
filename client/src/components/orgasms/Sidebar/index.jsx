import { useMasterFileData } from '../../../context/MasterFileContext';
import './index.scss';

const Sidebar = () => {

  const {userlist, categorylist} = useMasterFileData();

  return (
    <>
      <nav>
        <h2><a href='/'>APP Title</a></h2>
        <ul>
          {
            userlist.length !== 0 && categorylist.length !== 0 &&
            <>
              <li><a href='/'>ホーム</a></li>
              <li className='headline'>管理</li>
              <li><a href='/Budget'>予算</a></li>
              <li><a href='/AdvancesPaid'>立替</a></li>
              <li className='headline'>入力</li>
              <li><a href='/Deposit'>入金</a></li>
              <li><a href='/Payment'>支払</a></li>
              <li className='headline'>照会</li>
              <li><a href='/Result'>実績</a></li>
            </>
          }
          <li className='headline'>メンテナンス</li>
          <li><a href='/UserMaintenance'>ユーザー</a></li>
          <li><a href='/CategoryMaintenance'>カテゴリ</a></li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;