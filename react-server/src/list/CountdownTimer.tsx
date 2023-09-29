import Countdown from "react-countdown";

interface CountdownTimerProps {
    endDate: Date;
}

export default function CountdownTimer({endDate}: CountdownTimerProps) {
    return <Countdown date={endDate} renderer={props => <>
        <p>Voting ends in {props.days} days, {props.hours} hours, {props.minutes} minutes, {props.seconds} seconds.</p>
    </>}/>
}