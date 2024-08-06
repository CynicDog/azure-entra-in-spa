import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider } from "../Context";

// Configuration object constructed.
const config = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    },
    cache: {
        cacheLocation: "localStorage",
    },
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);

// Initialize the MSAL instance in an async function
const initializeMSAL = async () => {
    await publicClientApplication.initialize();

    ReactDOM.createRoot(document.getElementById('root')).render(
        <MsalProvider instance={publicClientApplication}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </MsalProvider>
    );
};

// Call the async function to initialize MSAL and render the app
initializeMSAL().catch(err => {
    console.error("MSAL initialization failed:", err);
});
