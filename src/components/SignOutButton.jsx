import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";

function signOutClickHandler(instance) {
    const logoutRequest = {
        account: instance.getAllAccounts()[0]
    };
    instance.logoutPopup(logoutRequest)
        .then(() => {
            if (window.opener && !window.opener.closed) {
                window.close();
            }
        })
        .catch(error => {
            console.error("Logout failed: ", error);
        });
}

const SignOutButton = () => {
    const { instance } = useMsal();

    return (
        <AuthenticatedTemplate>
            <button className="btn btn-outline-danger btn-sm" onClick={() => signOutClickHandler(instance)}>Sign Out</button>
        </AuthenticatedTemplate>
    );
}

export default SignOutButton;
