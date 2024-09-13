import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { FcGoogle } from "react-icons/fc";
import { useProfileContext } from "../context/ProfileContext";
import { login, logout } from "../service/ProfileService";

const devLocalhost = process.env.REACT_APP_LOCALHOST == "true";

export default function ProfileButton() {
    const {profile: [profile, setProfile], forceLogin: [, setForceLogin]} = useProfileContext();

    const renderLogoutTooltip = (props: OverlayInjectedProps) => {
        return <Tooltip id="logout-tooltip" {...props}>Logout</Tooltip>
    }

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

    const onLogoutClick = () => {
        logout()
            .then(() => setProfile(null))
            .catch(() => console.log("Failed to log out."));
    };

    const onButtonClick = profile ? onLogoutClick : onLoginClick;

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: onGoogleSuccess
    });

    const contents = profile ? (
        <OverlayTrigger placement="left" overlay={renderLogoutTooltip}>
            <>
                <img src={profile.pictureLink}/>
                <span>Log out</span>
            </>
        </OverlayTrigger>
    ) : (
        <>
            <FcGoogle role="button"/>
            <span>Sign in</span>
        </>
    );

    return <div className="profile-button" role="button" onClick={onButtonClick}>{contents}</div>
}