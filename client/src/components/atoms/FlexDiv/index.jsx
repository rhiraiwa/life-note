import './index.scss';

const FlexDiv = ({id, children}) => {
  return (
    <div className="flex-div" id={id}>
      {children}
    </div>
  )
}

export default FlexDiv;