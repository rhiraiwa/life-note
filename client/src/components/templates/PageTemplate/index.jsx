import FlexDiv from "../../atoms/FlexDiv";
import Header from "../../orgasms/Header";
import Sidebar from "../../orgasms/Sidebar";

const PageTemplate = ({title, children}) => {
  return (
    <>
      <Header title={title}/>
      <FlexDiv>
        <Sidebar/>
        {children}
      </FlexDiv>
    </>
  );
}

export default PageTemplate;