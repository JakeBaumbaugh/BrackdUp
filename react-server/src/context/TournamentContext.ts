import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Tournament } from "../model/Tournament";

type SetState<T> = Dispatch<SetStateAction<T>>;
type StateType = {
    tournament: Tournament|null|undefined;
    setTournament: SetState<Tournament|null|undefined>;
    userVotes: Set<number>|null;
    setUserVotes: SetState<Set<number>|null>;
};
export const TournamentContext = createContext<StateType>({
    tournament: undefined,
    setTournament: () => {},
    userVotes: null,
    setUserVotes: () => {}
});

export const useTournamentContext = () => useContext(TournamentContext);