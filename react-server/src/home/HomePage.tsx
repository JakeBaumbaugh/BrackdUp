import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";
import { useProfileContext } from "../context/ProfileContext";
import TournamentSummary from "../model/TournamentSummary";
import { getTournaments } from "../service/TournamentService";
import TournamentCard, { CustomTournamentCard } from "../card/TournamentCard";
import "./homepage.css";

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
                } else if (t.votingEndDate || !t.startDate || t.startDate < new Date()) {
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
        {Object.entries(collection).map(([category, summaries]) => (
            <Category 
                category={category}
                summaries={summaries}
                createTournament={category === "Future Tournaments" && profile?.canCreateTournament()}
                key={category}
            />
        ))}
        {profile?.isAdmin() && (
            <Link to="/admin">
                <Button className="icon-text-btn" style={{margin: "1em"}}>
                    <MdOutlineAdminPanelSettings/>
                    Admin Panel
                </Button>
            </Link>
        )}
    </div>
}

interface CategoryProps {
    category: string;
    summaries?: TournamentSummary[];
    createTournament?: boolean;
}

function Category({category, summaries, createTournament}: Readonly<CategoryProps>) {
    const categoryRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [, setStateUpdater] = useState([0]);
    const forceRerender = () => {
        setStateUpdater([0]);
    }

    useEffect(() => {
        const observer = new MutationObserver(forceRerender);
        if (listRef.current) {
            observer.observe(listRef.current, {childList: true});
        }
        return () => observer.disconnect();
    }, [listRef.current]);
    
    const categoryWidth = useMemo(() => {
        if (!categoryRef.current) {
            return 0;
        }
        const style = getComputedStyle(categoryRef.current);
        const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const borderWidth = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return parseFloat(style.width) - paddingWidth - borderWidth;
    }, [categoryRef.current, window.screen.width]);
    const listWidth = listRef.current?.offsetWidth ?? 0;
    const maxOffset = Math.max(listWidth - categoryWidth, 0);

    const [listOffset, setListOffset] = useState(0);
    const addListOffset = (step: number) => setListOffset(listOffset => Math.max(Math.min(listOffset + step, maxOffset), 0));

    const isDesktop = useMediaQuery({ minWidth: 600 });

    return <div className="category" ref={categoryRef}>
        <h3>{category}</h3>
        <div className="tournament-list" ref={listRef} style={{transform: `translateX(-${listOffset}px)`}}>
            {createTournament && (
                <CustomTournamentCard linkTo="/tournament/new">
                    <div className="new-tournament-contents">+</div>
                </CustomTournamentCard>
            )}
            {summaries ? summaries.map(summary => (
                <TournamentCard summary={summary} key={summary.id}/>
            )) : (
                !createTournament && <p>No tournaments found.</p>
            )}
        </div>
        {isDesktop && <>
            {listOffset > 0 && <ListScrollButton mode="left" onClick={() => addListOffset(-500)}/>}
            {listOffset < maxOffset && <ListScrollButton mode="right" onClick={() => addListOffset(500)}/>}
        </>}
    </div>
}

interface ListScrollButtonProps {
    mode: "left"|"right";
    onClick: () => void;
}

function ListScrollButton({mode, onClick}: Readonly<ListScrollButtonProps>) {
    const className = `scroll-button ${mode}-scroll-button`;
    const text = mode === "left" ? "<" : ">";

    return <div className={className} onClick={onClick} role="button">
        <span>{text}</span>
    </div>
}