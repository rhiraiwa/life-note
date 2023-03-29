import FlexDiv from "../../atoms/FlexDiv";
import Header from "../../orgasms/Header";
import Sidebar from "../../orgasms/Sidebar";

const PageTemplate = ({title, children}) => {
  return (
    <FlexDiv>
      <Sidebar/>
        <div>
          <Header title={title}/>
          {children}            
        </div>
    </FlexDiv>
  );
}

export default PageTemplate;