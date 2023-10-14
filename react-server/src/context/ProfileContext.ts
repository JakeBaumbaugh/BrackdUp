import React, { createContext, useContext, useState } from "react";
import Profile from "../model/Profile";

// StateType<S> = [S, React.Dispatch<React.SetStateAction<S>>]
type ContextType = {
    profile: [Profile|undefined, React.Dispatch<React.SetStateAction<Profile|undefined>>],
    useOneTap: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}

export const ProfileContext = createContext<ContextType>({
    profile: [undefined, () => {}],
    useOneTap: [false, () => {}],
});

export const useProfileContext = () => useContext(ProfileContext);