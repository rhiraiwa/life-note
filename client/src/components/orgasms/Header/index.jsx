import { useState } from 'react';
import FlexDiv from '../../atoms/FlexDiv';
import Calculator from '../../templates/Calculator';
import calc from '../../../img/calc.png';
import './index.scss';

const Header = ({title}) => {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FlexDiv id='header'>
      <span>{title}</span>
      <img src={calc} alt="calcrator" onClick={()=>setIsOpen(!isOpen)}/>
      {
        isOpen && <Calculator/>
      }
    </FlexDiv>
  )
}

export default Header;