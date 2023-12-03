import { useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import "./login.css";

export default function LoginPage() {
    const {profile: [profile], forceLogin: [_, setForceLogin]} = useProfileContext();

    useEffect(() => {
        if(profile === null) {
            setForceLogin(true);
            return () => setForceLogin(false);
        }
    }, [profile]);

    return (
        <main className="login-page">
            <p>Sign in to continue.</p>
        </main>
    );
}