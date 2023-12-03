import React, { createContext, useContext } from "react";
import Profile from "../model/Profile";

// StateType<S> = [S, React.Dispatch<React.SetStateAction<S>>]
type ContextType = {
    profile: [Profile|undefined|null, React.Dispatch<React.SetStateAction<Profile|undefined|null>>],
    forceLogin: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}

export const ProfileContext = createContext<ContextType>({
    profile: [undefined, () => {}],
    forceLogin: [false, () => {}],
});

export const useProfileContext = () => useContext(ProfileContext);