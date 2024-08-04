import { useEffect, useState } from "react";

const ExportView = () => {
    const [presence, setPresence] = useState(null);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/CynicDog/azure-entra-in-spa/main/public/me.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setPresence(data.availability);
            })
            .catch(error => {
                console.error("Error fetching presence data:", error);
            });
    }, []);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="avatar-container">
                <img
                    className="avatar"
                    src="https://raw.githubusercontent.com/CynicDog/azure-entra-in-spa/main/public/me.jpeg"
                    alt="User Profile"
                />
                {presence && (
                    <div className={`presence-indicator ${presence}`}></div>
                )}
            </div>
        </div>
    );
}

export default ExportView;
