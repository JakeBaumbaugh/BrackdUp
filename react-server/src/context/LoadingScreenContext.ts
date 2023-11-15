import React, { createContext, useContext } from "react";

type ContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const LoadingScreenContext = createContext<ContextType>([false, () => {}]);

export const useLoadingScreenContext = () => useContext(LoadingScreenContext);