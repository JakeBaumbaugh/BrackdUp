import Countdown from "react-countdown";

type VoteDescription = "starts" | "ends"
interface CountdownTimerProps {
    endDate: Date;
    onComplete?: () => void;
    voteDescription?: VoteDescription;
}

export default function CountdownTimer({endDate, onComplete, voteDescription}: CountdownTimerProps) {
    const verb = voteDescription ?? "ends";
    return <Countdown 
        date={endDate}
        onComplete={onComplete}
        renderer={props => {
            let timeString = `${props.seconds} seconds.`;
            if(props.minutes > 0 || props.hours > 0 || props.days > 0) {
                timeString = `${props.minutes} minutes, ` + timeString;
            }
            if(props.hours > 0 || props.days > 0) {
                timeString = `${props.hours} hours, ` + timeString;
            }
            if(props.days > 0) {
                timeString = `${props.days} days, ` + timeString;
            }
            return <p>Voting {verb} in {timeString}</p>
        }}
    />
}