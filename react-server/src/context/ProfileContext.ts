import { createContext, useContext, useState } from "react";
import Profile from "../model/Profile";

type StateType = ReturnType<typeof useState<Profile|undefined>>;
export const ProfileContext = createContext<StateType>([undefined, () => {}]);

export const useProfileContext = () => useContext(ProfileContext);