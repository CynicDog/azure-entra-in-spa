import {
    InteractionRequiredAuthError,
    InteractionStatus,
} from "@azure/msal-browser";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

const UserProfile = () => {
    const { instance, inProgress, accounts } = useMsal();
    const [apiData, setApiData] = useState(null);
    const [presenceData, setPresenceData] = useState(null);

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

    useEffect(() => {
        const accessTokenRequest = {
            scopes: ["user.read", "User.ReadWrite", "Presence.Read", "Presence.Read.All"],
            account: accounts[0],
        };

        const repo = import.meta.env.VITE_GITHUB_REPO;
        const owner = import.meta.env.VITE_GITHUB_OWNER;

        const filePath = import.meta.env.VITE_GITHUB_FILE_PATH;
        const presenceFilePath = import.meta.env.VITE_GITHUB_PRESENCE_PATH;

        const rawToken = import.meta.env.VITE_PUT_FILE_PAT;
        const githubToken = rawToken.replace(/\?/g, '');

        const committer = {
            name: "github-actions[bot]",
            email: "github-actions[bot]@users.noreply.github.com",
        };

        if (!apiData && inProgress === InteractionStatus.None) {
            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    const accessToken = accessTokenResponse.accessToken;

                    // Fetch user photo
                    fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.blob();
                        })
                        .then((blob) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64data = reader.result.split(",")[1];
                                setApiData(URL.createObjectURL(blob));

                                if (accounts[0].username === import.meta.env.VITE_MY_MICROSOFT_EMAIL) {
                                    const commitMessage = "Upload user profile image";

                                    // Check if the file exists on GitHub and upload/update it
                                    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                                        method: "GET",
                                        headers: {
                                            Accept: "application/vnd.github+json",
                                            Authorization: `Bearer ${githubToken}`,
                                            "X-GitHub-Api-Version": "2022-11-28",
                                        },
                                    })
                                        .then((response) => response.json())
                                        .then((fileData) => {
                                            const sha = fileData.sha;

                                            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                                                method: "PUT",
                                                headers: {
                                                    Accept: "application/vnd.github+json",
                                                    Authorization: `Bearer ${githubToken}`,
                                                    "X-GitHub-Api-Version": "2022-11-28",
                                                },
                                                body: JSON.stringify({
                                                    message: commitMessage,
                                                    committer,
                                                    content: base64data,
                                                    sha: sha,
                                                }),
                                            })
                                                .then((response) => {
                                                    if (!response.ok) {
                                                        throw new Error("Network response was not ok");
                                                    }
                                                    return response.json();
                                                })
                                                .then((data) => {
                                                    console.log("Image updated on GitHub: ", data);
                                                })
                                                .catch((error) => {
                                                    console.error("Error updating image on GitHub: ", error);
                                                });
                                        })
                                        .catch((error) => {
                                            if (error.status === 404) {
                                                fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        Accept: "application/vnd.github+json",
                                                        Authorization: `Bearer ${githubToken}`,
                                                        "X-GitHub-Api-Version": "2022-11-28",
                                                    },
                                                    body: JSON.stringify({
                                                        message: commitMessage,
                                                        committer,
                                                        content: base64data,
                                                    }),
                                                })
                                                    .then((response) => {
                                                        if (!response.ok) {
                                                            throw new Error("Network response was not ok");
                                                        }
                                                        return response.json();
                                                    })
                                                    .then((data) => {
                                                        console.log("Image uploaded to GitHub: ", data);
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error uploading image to GitHub: ", error);
                                                    });
                                            } else {
                                                console.error("Error fetching file from GitHub: ", error);
                                            }
                                        });
                                }
                            };
                        })
                        .catch((error) => {
                            console.error("Error fetching user photo:", error);
                        });

                    // Fetch user presence
                    fetch("https://graph.microsoft.com/v1.0/me/presence", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then((presence) => {
                            setPresenceData(presence);

                            // Check if email matches and upload presence data
                            if (accounts[0].username === import.meta.env.VITE_MY_MICROSOFT_EMAIL) {
                                const presenceJson = {
                                    availability: presence.availability,
                                };

                                const presenceCommitMessage = "Upload user presence status";

                                // Delay before sending the second request
                                setTimeout(() => {
                                    // Check if the presence file already exists
                                    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${presenceFilePath}`, {
                                        method: "GET",
                                        headers: {
                                            Accept: "application/vnd.github+json",
                                            Authorization: `Bearer ${githubToken}`,
                                            "X-GitHub-Api-Version": "2022-11-28",
                                        },
                                    })
                                        .then((response) => response.json())
                                        .then((fileData) => {
                                            const sha = fileData.sha;

                                            // Update existing presence JSON file
                                            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${presenceFilePath}`, {
                                                method: "PUT",
                                                headers: {
                                                    Accept: "application/vnd.github+json",
                                                    Authorization: `Bearer ${githubToken}`,
                                                    "X-GitHub-Api-Version": "2022-11-28",
                                                },
                                                body: JSON.stringify({
                                                    message: presenceCommitMessage,
                                                    committer,
                                                    content: btoa(JSON.stringify(presenceJson)), // Convert to base64
                                                    sha: sha,
                                                }),
                                            })
                                                .then((response) => {
                                                    if (!response.ok) {
                                                        throw new Error("Network response was not ok");
                                                    }
                                                    return response.json();
                                                })
                                                .then((data) => {
                                                    console.log("Presence updated on GitHub: ", data);
                                                })
                                                .catch((error) => {
                                                    console.error("Error updating presence on GitHub: ", error);
                                                });
                                        })
                                        .catch((error) => {
                                            if (error.status === 404) {
                                                // If the file doesn't exist, create it
                                                fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${presenceFilePath}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        Accept: "application/vnd.github+json",
                                                        Authorization: `Bearer ${githubToken}`,
                                                        "X-GitHub-Api-Version": "2022-11-28",
                                                    },
                                                    body: JSON.stringify({
                                                        message: presenceCommitMessage,
                                                        committer,
                                                        content: btoa(JSON.stringify(presenceJson)), // Convert to base64
                                                    }),
                                                })
                                                    .then((response) => {
                                                        if (!response.ok) {
                                                            throw new Error("Network response was not ok");
                                                        }
                                                        return response.json();
                                                    })
                                                    .then((data) => {
                                                        console.log("Presence uploaded to GitHub: ", data);
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error uploading presence to GitHub: ", error);
                                                    });
                                            } else {
                                                console.error("Error fetching presence file from GitHub: ", error);
                                            }
                                        });
                                }, 10000); // 10 second delay
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching user presence:", error);
                        });
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect(accessTokenRequest);
                    } else {
                        console.log(error);
                    }
                });
        }
    }, [instance, accounts, inProgress, apiData]);

    return (
        <AuthenticatedTemplate>
            {apiData ? (
                <div className="avatar-container">
                    <img className="avatar" src={apiData} alt="User Profile" onClick={() => signOutClickHandler(instance)} style={{'cursor': 'pointer'}} />
                    {presenceData && (
                        <div className={`presence-indicator ${presenceData.availability}`}></div>
                    )}
                </div>
            ) : (
                <p>Loading user photo ...</p>
            )}
        </AuthenticatedTemplate>
    );
};

export default UserProfile;
