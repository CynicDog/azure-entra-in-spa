import {AuthenticatedTemplate, useMsal} from "@azure/msal-react";

function signOutClickHandler(instance) {
    const logoutRequest = {
        account: instance[0]?.homeAccountId,
        postLogoutRedirectUri: 'https://cynicdog.github.io/azure-entra-in-spa/'
    };
    instance.logoutRedirect(logoutRequest);
}

// SignOutButton Component returns a button that invokes a redirect logout when clicked
const SignOutButton = () => {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    return (
        <AuthenticatedTemplate>
            <button className="btn btn-outline-danger btn-sm" onClick={() => signOutClickHandler(instance)}>Sign Out</button>
        </AuthenticatedTemplate>
    );
}

export default SignOutButton