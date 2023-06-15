import './index.scss';

const YearMonthChanger = ({state}) => {

  const changeYearMonth = (type) => {
    let year = Number(state.selected.year);
    let month = Number(state.selected.month);

    if(type==='up') {
        if(month === 11) {
            year += 1;
            month = -1;
        }
        month += 1;
    }

    if(type==='down') {
        if(month === 0) {
            year -= 1;
            month = 12;
        }
        month -= 1;
    }

    state.setSelected({...state.selected, year:year, month:month});
  }

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, '');
  
    // 数値以外の文字を削除
    const formattedValue = inputValue.replace(/[^\d.-]/g, '');
  
    if (formattedValue === '') {
      state.setSelected({ ...state.selected, [e.target.name]: '' });
      return;
    }
  
    // カンマを追加してフォーマット
    const formattedString = parseFloat(formattedValue);
  
    if (e.target.name === 'year') {
      state.setSelected({ ...state.selected, year: formattedString });
    } else if (e.target.name === 'month') {
      state.setSelected({ ...state.selected, month: formattedString - 1 });
    }
  };
  

  return (
    <div id='year-month-changer'>
      <button id='month-back' onClick={()=>changeYearMonth('down')}>◀</button>
      <input id='year-input'
             name='year'
             type='text'
             value={state.selected.year}
             onChange={handleChange}
             maxLength={4}
             />
      /
      <input id='month-input'
             name='month'
             type='text'
             value={state.selected.month === '' ? '' : state.selected.month + 1}
             onChange={handleChange}
             maxLength={2}
             />
      <button id='month-forward' onClick={()=>changeYearMonth('up')}>▶</button>
    </div>
  );
}

export default YearMonthChanger;