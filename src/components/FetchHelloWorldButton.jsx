import React, { useState } from 'react';

const FetchHelloWorldButton = () => {
    const [message, setMessage] = useState('');

    const fetchHelloWorld = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/helloworld`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Failed to fetch the hello world message:', error);
        }
    };

    return (
        <div>
            <button onClick={fetchHelloWorld}>Fetch Hello World</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FetchHelloWorldButton;
