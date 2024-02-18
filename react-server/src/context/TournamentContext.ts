import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Tournament } from "../model/Tournament";

type SetState<T> = Dispatch<SetStateAction<T>>;
type StateType = {
    tournament: Tournament|null|undefined;
    userVotes: Set<number>|null;
    setUserVotes: SetState<Set<number>|null>;
    loadData: () => void;
    clearData: () => void;
};
export const TournamentContext = createContext<StateType>({
    tournament: undefined,
    userVotes: null,
    setUserVotes: () => {},
    loadData: () => {},
    clearData: () => {},
});

export const useTournamentContext = () => useContext(TournamentContext);