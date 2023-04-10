import React from "react"

const MasterFileDataContext = React.createContext();
export const useMasterFileData = () => React.useContext(MasterFileDataContext);

export default function MasterFileDataProvider({children}){
    
    const [userlist, setUserlist] = React.useState([]);
    const [categorylist, setCategorylist] = React.useState([]);

    return (
        <MasterFileDataContext.Provider value={{userlist, setUserlist, categorylist, setCategorylist}}>
            {children}
        </MasterFileDataContext.Provider>
    )
}