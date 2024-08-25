import { useEffect, useState } from "react";
import TournamentSummary from "../../model/TournamentSummary";
import { getTournaments } from "../../service/TournamentService";
import { useLoadingScreenContext } from "../../context/LoadingScreenContext";
import { useProfileContext } from "../../context/ProfileContext";
import "./homepage.css";
import TournamentCard from "../card/TournamentCard";

type HomePageCollection = Record<string, TournamentSummary[]|undefined>;

export default function HomePage() {
    const [collection, setCollection] = useState<HomePageCollection>({});
    const {profile: [profile]} = useProfileContext();
    const [, setLoading] = useLoadingScreenContext();

    useEffect(() => {
        setLoading(true);
        getTournamentSummaries();
    }, [profile]);

    const getTournamentSummaries = () =>
        getTournaments().then(tournaments => {
            const expiredTournaments: TournamentSummary[] = [];
            const activeTourmaments: TournamentSummary[] = [];
            const futureTournaments: TournamentSummary[] = [];
            tournaments.forEach(t => {
                if (t.entryWinner) {
                    expiredTournaments.push(t);
                } else if (t.votingEndDate || !t.startDate) {
                    activeTourmaments.push(t);
                } else {
                    futureTournaments.push(t);
                }
            });
            expiredTournaments.sort((t1, t2) => t1.name.localeCompare(t2.name));
            activeTourmaments.sort((t1, t2) => {
                if (t1.votingEndDate && !t2.votingEndDate) {
                    return 1;
                } else if (t2.votingEndDate && !t1.votingEndDate) {
                    return -1;
                } else if (t1.votingEndDate && t2.votingEndDate) {
                    return t1.votingEndDate.valueOf() - t2.votingEndDate.valueOf();
                } else {
                    return t1.name.localeCompare(t2.name);
                }
            });
            futureTournaments.sort((t1, t2) => t2.startDate!.valueOf() - t1.startDate!.valueOf());
            setCollection({
                "Open Tournaments": activeTourmaments.length > 0 ? activeTourmaments : undefined,
                "Future Tournaments": futureTournaments.length > 0 ? futureTournaments : undefined,
                "Past Tournaments": expiredTournaments.length > 0 ? expiredTournaments : undefined,
            });
        }).then(() => setLoading(false));

    return <div className="home-page">
        {Object.entries(collection).map(([category, tournaments]) => (
            <div className="category" key={category}>
                <h3>{category}</h3>
                <div className="tournament-list">
                    {tournaments ? tournaments.map(summary => (
                        <TournamentCard summary={summary} key={summary.id}/>
                    )) : (
                        <p>No tournaments found.</p>
                    )}
                </div>
            </div>
        ))}
    </div>
}