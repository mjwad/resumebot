import { createContext, useState } from "react";
export const DataContext = createContext(null)

const DataProvider = ({children}) => {
    const [reqState, setReqState] =  useState(false);

    return (
        <DataContext.Provider value = {
            {
                reqState,
                setReqState
            }
        }>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;