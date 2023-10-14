import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import "./login.css";
import { useProfileContext } from "../context/ProfileContext";
import { login } from "../service/UserService";
import { useEffect } from "react";

export default function LoginPage() {
    const {profile: [_, setProfile], useOneTap: [useOneTap, setUseOneTap]} = useProfileContext();

    useEffect(() => {
        setUseOneTap(true);
        return () => setUseOneTap(false);
    }, []);

    const onLoginSuccess = (credentialResponse: CredentialResponse) => {
        if(credentialResponse.credential) {
            login(credentialResponse.credential)
                .then(profile => {
                    profile.jwt = credentialResponse.credential;
                    setProfile(profile);
                });
        }
    };

    return (
        <main className="login-page">
            <p>Sign in to continue.</p>
        </main>
    );
}