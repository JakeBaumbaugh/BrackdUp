import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { FcGoogle } from "react-icons/fc";
import { useProfileContext } from "../context/ProfileContext";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { login, logout } from "../service/ProfileService";
import { useEffect } from "react";

const devLocalhost = process.env.REACT_APP_LOCALHOST;

export default function ProfileButton() {
    const {profile: [profile, setProfile], forceLogin: [forceLogin]} = useProfileContext();

    const renderLogoutTooltip = (props: OverlayInjectedProps) => {
        return <Tooltip id="logout-tooltip" {...props}>Logout</Tooltip>
    }

    const onLoginClick = () => {
        if (devLocalhost) {
            const email = prompt("Please enter an email address.");
            if (email) {
                login(email)
                    .then(profile => setProfile(profile))
                    .catch(() => setProfile(null));
            }
        } else {
            googleLogin();
        }
    };

    const onGoogleSuccess = (codeResponse: CodeResponse) => {
        login(codeResponse.code)
            .then(profile => setProfile(profile))
            .catch(() => setProfile(null));
    };

    const onLogoutClick = () => {
        logout()
            .then(() => setProfile(null))
            .catch(() => console.log("Failed to log out."));
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: onGoogleSuccess
    });

    // Force login popup without user interact
    useEffect(() => {
        if(forceLogin && !profile) {
            googleLogin();
        }
    }, [profile, forceLogin]);

    return profile ? (
        <OverlayTrigger placement="left" overlay={renderLogoutTooltip}>
            <img
                src={profile.pictureLink}
                className="clickable darken-hover rotate-hover"
                onClick={onLogoutClick}
            />
        </OverlayTrigger>
    ) : (
        <div
            className="login-button clickable darken-hover rotate-hover"
            onClick={() => onLoginClick()}
        >
            <FcGoogle/>
        </div>
    );
}