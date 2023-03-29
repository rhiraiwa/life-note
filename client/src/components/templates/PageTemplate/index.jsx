import FlexDiv from "../../atoms/FlexDiv";
import Header from "../../orgasms/Header";
import Sidebar from "../../orgasms/Sidebar";
import './index.scss';

const PageTemplate = ({title, children}) => {
  return (
    <FlexDiv>
      <Sidebar/>
      <div id='page-content'>
        <Header title={title}/>
        <div id='page-body-margin'>
          {children}
        </div>
      </div>
    </FlexDiv>
  );
}

export default PageTemplate;