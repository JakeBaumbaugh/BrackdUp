import { useEffect, useState } from "react";
import { Tournament } from "../model/Tournament";
import { tournamentImageUrl } from "../service/ImageService";

interface TournamentBackgroundProps {
    tournament: Tournament;
}

export default function TournamentBackground({tournament}: Readonly<TournamentBackgroundProps>) {
    const [backgroundImageError, setBackgroundImageError] = useState(false);
    const backgroundImageClass = backgroundImageError ? "background-image missing" : "background-image";

    useEffect(() => {
        setBackgroundImageError(false);
    }, [tournament.id]);

    return <div className="background">
        <img className={backgroundImageClass} src={tournamentImageUrl(tournament.id)} onError={() => setBackgroundImageError(true)}/>
    </div>
}