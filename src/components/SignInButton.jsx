import {
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";
import SignOutButton from "./SignOutButton.jsx";

const SignInButton = () => {
    const { instance } = useMsal();

    const handleSignIn = async () => {
        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) {

            await instance.loginRedirect();
        }
    };

    return (
        <>
            <UnauthenticatedTemplate>
                <button className="btn btn-outline-primary btn-sm" onClick={handleSignIn}>Sign In</button>
            </UnauthenticatedTemplate>
        </>
    )

};

export default SignInButton