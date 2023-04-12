import FlexDiv from '../../atoms/FlexDiv';
import calc from '../../../img/calc.png';
import './index.scss';
import Calculator from '../../templates/Calculator';
import React from 'react';

const Header = ({title}) => {
  const [isOpen, setIsOpen] = React.useState(false);

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