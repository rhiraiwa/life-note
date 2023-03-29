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

  return (
    <div id='year-month-changer'>
      <button id='month-back' onClick={()=>changeYearMonth('down')}>◀</button>
      <input id='year-input' type='text' value={state.selected.year}/>
      /
      <input id='month-input' type='text' value={state.selected.month + 1}/>
      <button id='month-forward' onClick={()=>changeYearMonth('up')}>▶</button>
    </div>
  );
}

export default YearMonthChanger;