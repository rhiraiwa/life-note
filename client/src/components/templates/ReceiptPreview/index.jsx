import React from "react";
import FlexDiv from "../../atoms/FlexDiv";
// import receipt from "../../../../public/receipt/result/LOWSON_0.jpg";
import './index.scss';

const ReceiptPreview = ({closeMethod}) => {

  // const [imgSrc, setImgSrc] = React.useState('../../../serverImg/cat.jpg');

  return (
    <div id='receipt-preview'>
      <div id='img-area'>
        <img src='../../../../public/receipt/result/LOWSON_0.jpg' alt='receipt'/>
      </div>
      <FlexDiv id='button-area'>
        <button>OK</button>
        <button onClick={closeMethod}>撮り直す</button>
      </FlexDiv>
    </div>
  );
}

export default ReceiptPreview;