const LabelInput = ({label, type, isReadOnly=false, id, value, setValue}) => {
  return (
    <div id={id}>
      <label>{label}</label>
      <input type={type} id={`${id}_input`} value={value} onChange={setValue} readOnly={isReadOnly}/>  
    </div>
  );
}

export default LabelInput;