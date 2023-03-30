import FlexDiv from '../../atoms/FlexDiv';
import './index.scss';

const Modal = ({title, closeMethod, children}) => {
  return (
    <div id='modal-base'>
      <div id='modal-layer' onClick={closeMethod}></div>
      <div id='modal-contents'>
        <FlexDiv id='modal-header'>
          <span>{title}</span>
          <button className='button-cancel' onClick={closeMethod}>×</button>
        </FlexDiv>
        <div id='modal-padding'>
          {children}
            {/* <ModalFooter closeMethod={closeMethod}/> */}
        </div>
      </div>
    </div>
  );
}

export default Modal;