import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

const UserProfileOnTeams = () => {
    const { instance } = useMsal();
    const [photoData, setPhotoData] = useState(null);
    const [presenceData, setPresenceData] = useState(null);

    useEffect(() => {

        // In a single-page application (SPA) using hash routing, anything after the hash (#) is not sent to the server and is instead handled by the client-side router.
        // The query parameters are not part of window.location.search. Instead, they are part of the hash itself.
        const hash = window.location.hash;

        if (hash) {
            const urlParams = new URLSearchParams(hash.split('?')[1]);
            const nameParam = urlParams.get("name");

            let loginHint = "";

            if (nameParam) {
                // Use the full email from the nameParam
                loginHint = nameParam; // This is the full email
            }

            const silentRequest = {
                scopes: ["User.Read", "User.ReadWrite", "Presence.Read", "Presence.Read.All"],
                loginHint: loginHint
            };

            const authenticateUser = async () => {
                try {
                    const loginResponse = await instance.ssoSilent(silentRequest);

                    // Fetch user photo
                    const accessToken = loginResponse.accessToken;

                    // Fetch user photo
                    const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    if (!photoResponse.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const photoBlob = await photoResponse.blob();
                    const photoUrl = URL.createObjectURL(photoBlob);
                    setPhotoData(photoUrl);

                    // Fetch user presence
                    const presenceResponse = await fetch("https://graph.microsoft.com/v1.0/me/presence", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    if (!presenceResponse.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const presence = await presenceResponse.json();
                    setPresenceData(presence);

                } catch (err) {
                    console.error("Error during authentication or fetching data: ", err);
                }
            };

            // Call the authenticateUser function if the login hint is available
            if (loginHint) {
                authenticateUser();
            }
        }

    }, [instance]);

    return (
        <AuthenticatedTemplate>
            <div className="d-flex align-items-center justify-content-center vh-100">
                {photoData ? (
                    <div className="avatar-container">
                        <img className="avatar" src={photoData} alt="User Profile" />
                        {presenceData && (
                            <div className={`presence-indicator ${presenceData.availability}`}></div>
                        )}
                    </div>
                ) : (
                    <p>Loading user photo ...</p>
                )}
            </div>
        </AuthenticatedTemplate>
    );
}

export default UserProfileOnTeams;
