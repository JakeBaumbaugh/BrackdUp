import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { FcGoogle } from "react-icons/fc";
import { useProfileContext } from "../context/ProfileContext";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { login, logout } from "../service/ProfileService";
import { useEffect } from "react";

export default function ProfileButton() {
    const {profile: [profile, setProfile], forceLogin: [forceLogin]} = useProfileContext();

    const renderLogoutTooltip = (props: OverlayInjectedProps) => {
        return <Tooltip id="logout-tooltip" {...props}>Logout</Tooltip>
    }

    const onLogin = (codeResponse: CodeResponse) => {
        login(codeResponse.code)
            .then(profile => setProfile(profile))
            .catch(() => setProfile(null));
    };

    const onLogout = () => {
        logout()
            .then(() => setProfile(null))
            .catch(() => console.log("Failed to log out."));
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: onLogin
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
                onClick={onLogout}
            />
        </OverlayTrigger>
    ) : (
        <div
            className="login-button clickable darken-hover rotate-hover"
            onClick={() => googleLogin()}
        >
            <FcGoogle/>
        </div>
    );
}