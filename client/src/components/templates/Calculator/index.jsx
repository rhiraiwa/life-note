import React from "react";
import './index.scss';

const Calculator = () => {

  const [display, setDisplay] = React.useState('');

  const clickNumerButton = (number) => {
    setDisplay(display + number);
  }

  return (
    <div id='calculator' style={{zIndex: 2}}>
      <table>
        <thead>
          <tr>
            <th colSpan={4}><input type='text' value={display}/></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><button value='C' onClick={()=>setDisplay('')}>C</button></td>
            <td><button value='BS' onClick={(e)=>clickNumerButton(e.target.value)}>←</button></td>
            <td><button value='×' onClick={(e)=>clickNumerButton(e.target.value)}>×</button></td>
            <td><button value='÷' onClick={(e)=>clickNumerButton(e.target.value)}>÷</button></td>
          </tr>
          <tr>
            <td><button value='7' onClick={(e)=>clickNumerButton(e.target.value)}>7</button></td>
            <td><button value='8' onClick={(e)=>clickNumerButton(e.target.value)}>8</button></td>
            <td><button value='9' onClick={(e)=>clickNumerButton(e.target.value)}>9</button></td>
            <td><button value='+' onClick={(e)=>clickNumerButton(e.target.value)}>+</button></td>
          </tr>
          <tr>
            <td><button value='4' onClick={(e)=>clickNumerButton(e.target.value)}>4</button></td>
            <td><button value='5' onClick={(e)=>clickNumerButton(e.target.value)}>5</button></td>
            <td><button value='6' onClick={(e)=>clickNumerButton(e.target.value)}>6</button></td>
            <td><button value='-' onClick={(e)=>clickNumerButton(e.target.value)}>-</button></td>
          </tr>
          <tr>
            <td><button value='1' onClick={(e)=>clickNumerButton(e.target.value)}>1</button></td>
            <td><button value='2' onClick={(e)=>clickNumerButton(e.target.value)}>2</button></td>
            <td><button value='3' onClick={(e)=>clickNumerButton(e.target.value)}>3</button></td>
            <td rowSpan={2}><button value='=' onClick={(e)=>clickNumerButton(e.target.value)}>=</button></td>
          </tr>
          <tr>
            <td><button value='0' onClick={(e)=>clickNumerButton(e.target.value)}>0</button></td>
            <td><button value='00' onClick={(e)=>clickNumerButton(e.target.value)}>00</button></td>
            <td><button value='.' onClick={(e)=>clickNumerButton(e.target.value)}>.</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Calculator;