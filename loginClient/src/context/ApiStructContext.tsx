import { createContext, useContext, useState } from "react";

// Define the shape of your responseStruct
export type ApiStruct = {
    dataSrc?: string;
    limit?: string;
    skip?: string;
    total?: string;
    sortBy?: string;
    sortOrder?: string;
    searchRoute?: string;
    searchParam?: string;
};

// Define the shape of the context value
type ApiStructContextType = {
    responseStruct: ApiStruct;
    setApiStruct: React.Dispatch<React.SetStateAction<ApiStruct>>;
};

// Create the context with a null default
const ApiStructContext = createContext<ApiStructContextType | null>(null);

// Custom hook to consume the context
export const useApiStruct = () => {
    const context = useContext(ApiStructContext);
    if (!context) {
        throw new Error("useApiStruct must be used within a ApiStructProvider");
    }
    return context;
};

// Provider component
export const ApiStructProvider = ({ children }: { children: React.ReactNode }) => {
    const [responseStruct, setApiStruct] = useState<ApiStruct>({
        dataSrc: "",
        limit: "",
        skip: "",
        total: "",
        sortBy: "",
        sortOrder: "",
        searchRoute: "",
        searchParam: "",
    });

    return (
        <ApiStructContext.Provider value={{ responseStruct, setApiStruct }}>
            {children}
        </ApiStructContext.Provider>
    );
};
