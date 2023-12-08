import Countdown from "react-countdown";

interface CountdownTimerProps {
    endDate: Date;
    onComplete?: () => void;
}

export default function CountdownTimer({endDate, onComplete}: CountdownTimerProps) {
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
            return <p>Voting ends in {timeString}</p>
        }}
    />
}