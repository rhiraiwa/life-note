const LabelInput = ({label, type, isReadOnly=false}) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} readOnly={isReadOnly}/>  
    </div>
  );
}

export default LabelInput;