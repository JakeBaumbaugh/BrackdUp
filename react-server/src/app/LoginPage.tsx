import { useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import "./login.css";

export default function LoginPage() {
    const {useOneTap: [_, setUseOneTap]} = useProfileContext();

    useEffect(() => {
        setUseOneTap(true);
        return () => setUseOneTap(false);
    }, []);

    return (
        <main className="login-page">
            <p>Sign in to continue.</p>
        </main>
    );
}