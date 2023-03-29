import './index.scss';

const LabelInput = ({label, type, isReadOnly=false, isDisabled=false, id, value, setValue, clickEvent}) => {
  return (
    <div className='label-input' id={id}>
      <label>{label}</label>
      <input type={type}
             id={`${id}_input`}
             value={value}
             onChange={setValue}
             readOnly={isReadOnly}
             disabled={isDisabled}
             onClick={clickEvent}
             />  
    </div>
  );
}

export default LabelInput;