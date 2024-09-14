import React, { createContext, useContext } from "react";
import { NavigateFunction } from "react-router-dom";

type ContextType = {loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>>, navigate: NavigateFunction};

export const RedirectContext = createContext<ContextType>({
    loading: false,
    setLoading: () => {},
    navigate: () => {},
});

export const useRedirectContext = () => useContext(RedirectContext);