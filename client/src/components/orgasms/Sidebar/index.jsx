import './index.scss';

const Sidebar = () => {
  return (
    <>
      <nav>
        <h2>TitleLogo</h2>
        <ul>
          <li><a href='/'>ホーム</a></li>
          <li className='headline'>管理</li>
          <li><a href='/Budget'>予算</a></li>
          <li><a href='/AdvancesPaid'>立替</a></li>
          <li className='headline'>入力</li>
          <li><a href='/Deposit'>入金</a></li>
          <li><a href='/Payment'>支払</a></li>
          <li className='headline'>照会</li>
          <li><a href='/Result'>実績</a></li>
          <li className='headline'>メンテナンス</li>
          <li><a href='/UserMaintenance'>ユーザー</a></li>
          <li><a href='/CategoryMaintenance'>カテゴリ</a></li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;