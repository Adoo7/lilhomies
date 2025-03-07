'use client';

import React, { useEffect, useState } from 'react';

interface NamePhrase {
    user_id: string;
    phrase: string;
}

const BurnsPage: React.FC = () => {

    const showPopup = ({ text, showDisagree }: { text: string; showDisagree: boolean }) => {
        return new Promise<boolean>((resolve) => {
            const background = document.createElement('div');
            background.style.position = 'fixed';
            background.style.top = '0';
            background.style.left = '0';
            background.style.width = '100%';
            background.style.height = '100%';
            background.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            background.style.zIndex = '999';
            document.body.appendChild(background);

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.width = '400px';
            popup.style.maxWidth = '90%';
            popup.style.borderRadius = '10px';
            popup.style.textAlign = 'right';

            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = 'white';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            popup.style.zIndex = '1000';
            popup.style.color = 'black';

            popup.innerHTML = `
                <p style="font-size: 3rem;">${text}</p>
                <div style="display: flex; justify-content: flex-start; gap: 10px; margin-top: 20px;">
                    <button id="agreeButton" style="padding: 10px 20px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">${showDisagree ? "اتفق" : "اتفق وبشدة"}</button>
                    ${showDisagree ? '<button id="disagreeButton" style="margin-right: 10px; padding: 10px 20px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">لا اتفق</button>' : ''}
                </div>
            `;

            document.body.appendChild(popup);

            const agreeButton = document.getElementById('agreeButton');
            const disagreeButton = document.getElementById('disagreeButton');

            agreeButton?.addEventListener('click', () => {
                document.body.removeChild(popup);
                document.body.removeChild(background);
                resolve(true);
            });
            
            disagreeButton?.addEventListener('click', () => {
                document.body.removeChild(popup);
                document.body.removeChild(background);
                resolve(false);
            });
        });
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/burns');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(Array.isArray(result.rows) ? result.rows : []);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const [data, setData] = useState<NamePhrase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const res = showPopup({ text: "حسن قي", showDisagree: true }).then((result) => (
            !result && showPopup({text: "حسن قي", showDisagree: false})
        ));
        console.log(res);
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBlock: '20px' }}>
            <h1 style={{paddingBlock: '20px', fontSize: '2rem'}}>التحريقات</h1>
            <ul style={{ width: '100%', maxWidth: '600px' }}>
            {data.reduce((acc, item) => {
                const existingUser = acc.find((user) => user.user_id === item.user_id);
                if (existingUser) {
                existingUser.phrases.push(item.phrase);
                } else {
                acc.push({ user_id: item.user_id, phrases: [item.phrase] });
                }
                return acc;
            }, [] as { user_id: string; phrases: string[] }[]).map((user, index) => (
                <li key={index} style={{ border: '1px solid blue', borderRadius: '4px', padding: '10px', marginBottom: '10px', width: '100%' }}>
                <div>
                    <h2 style={{ fontSize: '1.5em', padding: '12px', textAlign: 'center' }}>{user.user_id}</h2>
                    <ul>
                    {user.phrases.map((phrase, phraseIndex) => (
                        <li key={phraseIndex} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '5px', marginBottom: '5px', textAlign: 'right' }}>{phrase}</li>
                    ))}
                    </ul>
                </div>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default BurnsPage;