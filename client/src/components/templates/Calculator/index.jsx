import React, { useState } from 'react';
import './index.scss';

const Calculator = () => {
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleEvaluate = () => {
    try {
      const result = evaluateExpression(expression);
      setExpression(result.toString());
    } catch (error) {
      // エラー処理
      setExpression('Error');
    }
  };

  const handleClear = () => {
    setExpression('');
  };

  //パーサー
  const evaluateExpression = (expression) => {
    let result = null;
  
    try {
      const tokens = tokenize(expression);
      const parsedExpression = parse(tokens);
      result = evaluate(parsedExpression);
    } catch (error) {
      console.error('Error evaluating expression:', error);
    }
  
    return result;
  };
  
  const tokenize = (expression) => {
    const tokens = [];
    let currentToken = '';
  
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
  
      if (char === ' ') {
        // 空白文字は無視する
        continue;
      } else if (isNumeric(char)) {
        // 数字をトークンとして認識する
        currentToken += char;
  
        // 次の文字が数字でない場合、現在のトークンを追加してリセットする
        if (!isNumeric(expression[i + 1])) {
          tokens.push(currentToken);
          currentToken = '';
        }
      } else if (isOperator(char)) {
        // 演算子をトークンとして認識する
        tokens.push(char);
      } else if (char === '(' || char === ')') {
        // 括弧をトークンとして認識する
        tokens.push(char);
      } else {
        throw new Error('Invalid character: ' + char);
      }
    }
  
    return tokens;
  };
  
  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };
  
  const isOperator = (value) => {
    return ['+', '-', '*', '/'].includes(value);
  };
  
  const parse = (tokens) => {
    let currentIndex = 0;
  
    const parseExpression = () => {
      let left = parseTerm();
  
      while (currentIndex < tokens.length) {
        const operator = tokens[currentIndex];
  
        if (operator === '+' || operator === '-') {
          currentIndex++;
          const right = parseTerm();
  
          left = {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right,
          };
        } else {
          break;
        }
      }
  
      return left;
    };
  
    const parseTerm = () => {
      let left = parseFactor();
  
      while (currentIndex < tokens.length) {
        const operator = tokens[currentIndex];
  
        if (operator === '*' || operator === '/') {
          currentIndex++;
          const right = parseFactor();
  
          left = {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right,
          };
        } else {
          break;
        }
      }
  
      return left;
    };
  
    const parseFactor = () => {
      const token = tokens[currentIndex];
      currentIndex++;
  
      if (isNumeric(token)) {
        return {
          type: 'NumericLiteral',
          value: parseInt(token),
        };
      } else if (token === '(') {
        const expression = parseExpression();
  
        if (tokens[currentIndex] !== ')') {
          throw new Error('Missing closing parenthesis');
        }
  
        currentIndex++;
        return expression;
      } else {
        throw new Error('Invalid token: ' + token);
      }
    };
  
    return parseExpression();
  };
  
  const evaluate = (parsedExpression) => {
    if (parsedExpression.type === 'BinaryExpression') {
      const left = evaluate(parsedExpression.left);
      const right = evaluate(parsedExpression.right);
  
      switch (parsedExpression.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) {
            throw new Error('Division by zero');
          }
          return left / right;
        default:
          throw new Error('Invalid operator');
      }
    } else if (parsedExpression.type === 'NumericLiteral') {
      return parsedExpression.value;
    } else {
      throw new Error('Invalid expression');
    }
  };
  
  return (
  <div className="calculator-container">
    <input
      type="text"
      value={expression}
      className="expression-input"
      readOnly
    />

    <div className="button-container">
      {['7', '8', '9', '/'].map((value) => (
        <button key={value} className="button" onClick={() => handleButtonClick(value)}>
          {value}
        </button>
      ))}
      {['4', '5', '6', '*'].map((value) => (
        <button key={value} className="button" onClick={() => handleButtonClick(value)}>
          {value}
        </button>
      ))}
      {['1', '2', '3', '-'].map((value) => (
        <button key={value} className="button" onClick={() => handleButtonClick(value)}>
          {value}
        </button>
      ))}
      {['0', '.', '=', 'Clear'].map((value) => (
        <button
          key={value}
          className={`button ${value === '=' ? 'equals-button' : (value === 'Clear' ? 'clear-button' : '')}`}
          onClick={value === '=' ? handleEvaluate : (value === 'Clear' ? handleClear : () => handleButtonClick(value))}
        >
          {value}
        </button>
      ))}
    </div>
  </div>
  );
};

export default Calculator;