import FlexDiv from "../../atoms/FlexDiv";
import Header from "../../orgasms/Header";
import Sidebar from "../../orgasms/Sidebar";

const PageTemplate = ({children}) => {
  return (
    <>
      <Header/>
      <FlexDiv>
        <Sidebar/>
        {children}
      </FlexDiv>
    </>
  );
}

export default PageTemplate;