import './index.scss';

const FlexDiv = ({className, id, children}) => {
  return (
    <div className={`flex-div ${className}`} id={id}>
      {children}
    </div>
  )
}

export default FlexDiv;