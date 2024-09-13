import { Button, Card } from "react-bootstrap";
import { login } from "../../service/ProfileService";
import { useProfileContext } from "../../context/ProfileContext";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import "./logincard.css";

const devLocalhost = process.env.REACT_APP_LOCALHOST == "true";

export default function LoginCard() {
    const {profile: [, setProfile], forceLogin: [, setForceLogin]} = useProfileContext();

    const onLoginClick = () => {
        if (devLocalhost) {
            const email = prompt("Please enter an email address.");
            if (email) {
                login(email)
                    .then(profile => setProfile(profile))
                    .then(() => setForceLogin(false))
                    .catch(() => setProfile(null));
            }
        } else {
            googleLogin();
        }
    };

    const onGoogleSuccess = (codeResponse: CodeResponse) => {
        login(codeResponse.code)
            .then(profile => setProfile(profile))
            .then(() => setForceLogin(false))
            .catch(() => setProfile(null));
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: onGoogleSuccess
    });

    return <Card className="login-card">
        <Card.Body>
            <h2>Let's Get <span>Brackd!</span></h2>
            <Button variant="outline-primary" className="google-login" onClick={onLoginClick}>
                <FcGoogle/>
                Sign in with Google
            </Button>
            <Button variant="outline-secondary" onClick={() => setForceLogin(false)}>Continue as Guest</Button>
        </Card.Body>
    </Card>
}