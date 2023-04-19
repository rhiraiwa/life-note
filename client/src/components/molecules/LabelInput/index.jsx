import './index.scss';

const LabelInput = ({label, type, isReadOnly=false, isDisabled=false, id, value, setValue, clickEvent}) => {
  return (
    <div className='label-input' id={id}>
      <label htmlFor={`${id}_input`}>{label}</label>
      <input type={type}
             id={`${id}_input`}
             value={value}
             onChange={setValue}
             readOnly={isReadOnly}
             disabled={isDisabled}
             onClick={clickEvent}
             tabIndex={isReadOnly? -1 : ''}
             />  
    </div>
  );
}

export default LabelInput;