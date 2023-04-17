import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
import './index.scss';

const ReceiptPreview = ({setPreview, closeMethod, filename}) => {

  const accept = () => {
    setPreview(filename);
    closeMethod();
  }

  return (
    <div id='receipt-preview'>
      <div id='img-area'>
        <img src={'../receipt/preview/' + filename} alt='receipt'/>
      </div>
      <FlexDiv id='button-area'>
        <button onClick={accept}>OK</button>
        <button onClick={closeMethod}>撮り直す</button>
      </FlexDiv>
    </div>
  );
}

export default ReceiptPreview;