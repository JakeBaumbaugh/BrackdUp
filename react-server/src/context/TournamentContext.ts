import { createContext, useContext, useState } from "react";
import { Tournament } from "../model/Tournament";

type StateType = ReturnType<typeof useState<Tournament|null|undefined>>;
export const TournamentContext = createContext<StateType>([undefined, () => {}]);

export const useTournamentContext = () => useContext(TournamentContext);