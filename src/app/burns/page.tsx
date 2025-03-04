'use client';

import React, { useEffect, useState } from 'react';

interface NamePhrase {
    user_id: string;
    phrase: string;
}

const BurnsPage: React.FC = () => {

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
    const addPhrase = async (userId: string, phrase: string) => {
        try {
            const response = await fetch('/api/burns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, phrase }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newPhrase = await response.json();

            fetchData();

            setData((prevData) => [...prevData, newPhrase]);
        } catch (error) {
            setError((error as Error).message);
        }


    };
    useEffect(() => {
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
                <li key={index} style={{ border: '1px solid blue', padding: '10px', marginBottom: '10px', width: '100%' }}>
                <div>
                    <h2 style={{ fontSize: '1.5em', padding: '12px' }}>{user.user_id}</h2>
                    <ul>
                    {user.phrases.map((phrase, phraseIndex) => (
                        <li key={phraseIndex} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '5px', marginBottom: '5px' }}>{phrase}</li>
                    ))}
                    </ul>
                    <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const phrase = formData.get('phrase') as string;
                        await addPhrase(user.user_id, phrase);
                    }}
                    >
                    <input type="text" name="phrase" placeholder="Add a new phrase" required />
                    <button type="submit">Add Phrase</button>
                    </form>
                </div>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default BurnsPage;