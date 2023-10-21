import Countdown from "react-countdown";

interface CountdownTimerProps {
    endDate: Date;
    onComplete?: () => void;
}

export default function CountdownTimer({endDate, onComplete}: CountdownTimerProps) {
    return <Countdown date={endDate} onComplete={onComplete} renderer={props => <>
        <p>Voting ends in {props.days} days, {props.hours} hours, {props.minutes} minutes, {props.seconds} seconds.</p>
    </>}/>
}