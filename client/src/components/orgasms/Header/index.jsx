import FlexDiv from '../../atoms/FlexDiv';
import calc from '../../../img/calc.png';
import './index.scss';

const Header = ({title}) => {
  return (
    <FlexDiv id='header'>
      <span>{title}</span>
      <img src={calc} alt="calcrator"/>
    </FlexDiv>
  )
}

export default Header;