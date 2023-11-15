import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import "./loadingscreen.css";

const MINIMUM_LOADING_SCREEN_TIME = 600;

interface LoadingScreenProps {
    loading: boolean;
}

export default function LoadingScreen({loading}: LoadingScreenProps) {
    const [showLoading, setShowLoading] = useState(false);
    const [enableTime, setEnableTime] = useState(Date.now());
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout|null>(null);

    useEffect(() => {
        if(loading !== showLoading) {
            if(timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
            const timeSinceEnable = Date.now() - enableTime;
            if(loading) {
                // Immediately show loading screen
                setShowLoading(true);
                setEnableTime(Date.now());
            } else if (timeSinceEnable > MINIMUM_LOADING_SCREEN_TIME) {
                // Immediately hide loading screen
                setShowLoading(false);
            } else {
                const timeUntilDisable = MINIMUM_LOADING_SCREEN_TIME - timeSinceEnable;
                const timeout = setTimeout(() => setShowLoading(false), timeUntilDisable);
                setTimeoutId(timeout);
            }
        }
    }, [loading]);

    return (
        <div className={showLoading ? "loading-screen enabled" : "loading-screen"}>
            <ClipLoader color="#535863" size="4em"/>
        </div>
    );
}