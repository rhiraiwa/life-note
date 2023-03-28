import './index.scss';

const Sidebar = () => {
  return (
    <>
      <nav>
        <ul>
          <li className='headline'>管理</li>
          <li>予算</li>
          <li>立替</li>
          <li className='headline'>入力</li>
          <li>入金</li>
          <li>支払</li>
          <li className='headline'>照会</li>
          <li>実績照会</li>
          <li className='headline'>マスタメンテナンス</li>
          <li>ユーザー</li>
          <li>カテゴリ</li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;