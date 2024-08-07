import SignInButton from "./SignInButton.jsx";
import DarkModeSwitch from "./DarkModeSwitch.jsx";
import SignOutButton from "./SignOutButton.jsx";
import UserProfile from "./UserProfile.jsx";
import {UnauthenticatedTemplate} from "@azure/msal-react";
import FetchHelloWorldButton from "./FetchHelloWorldButton.jsx";

const EntryPoint = () => {

    return (
        <>
            {/*<div className="d-flex justify-content-end align-items-center mt-3">
                <div className="mx-4">
                    <SignOutButton />
                    <DarkModeSwitch />
                </div>
            </div>*/}
            {/*<FetchHelloWorldButton />*/}
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div>
                    <UnauthenticatedTemplate>
                        <h2 className="merriweather-bold">Azure Entra ID Authentication</h2>
                        <h4 className="merriweather-bold">in React Application with MSAL</h4>
                    </UnauthenticatedTemplate>
                    <div className="my-4">
                        <div className="d-flex">
                            <div className="ms-auto">
                                <DarkModeSwitch />
                            </div>
                        </div>
                        <UserProfile />
                    </div>
                    <div className="mt-4">
                        <SignInButton />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EntryPoint