import { useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import "./login.css";

export default function LoginPage() {
    const {profile: [profile], useOneTap: [_, setUseOneTap]} = useProfileContext();

    useEffect(() => {
        if(profile === null) {
            setUseOneTap(true);
            return () => setUseOneTap(false);
        }
    }, [profile]);

    return (
        <main className="login-page">
            <p>Sign in to continue.</p>
        </main>
    );
}