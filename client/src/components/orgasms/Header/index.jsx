import FlexDiv from '../../atoms/FlexDiv';
import './index.scss';

const Header = ({title}) => {
  return (
    <FlexDiv id='header'>
      <span>{title}</span>
      <button>電卓</button>
    </FlexDiv>
  )
}

export default Header;