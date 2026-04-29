'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NamePhrase {
    user_id: string;
    phrase: string;
}

const AVATAR_COLORS = [
  '#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706', '#dc2626',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const BurnsPage: React.FC = () => {
    const [agreed, setAgreed] = useState<boolean | null>(null);
    const [data, setData] = useState<NamePhrase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/burns');
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(Array.isArray(result.rows) ? result.rows : []);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const grouped = data.reduce((acc, item) => {
        const existing = acc.find((u) => u.user_id === item.user_id);
        if (existing) existing.phrases.push(item.phrase);
        else acc.push({ user_id: item.user_id, phrases: [item.phrase] });
        return acc;
    }, [] as { user_id: string; phrases: string[] }[]);

    /* ─── Agree gate ─── */
    if (agreed === null) {
        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 700, direction: 'rtl', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                        حسن قي
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn btn-success" onClick={() => setAgreed(true)}>اتفق</button>
                        <button className="btn btn-danger"  onClick={() => setAgreed(false)}>لا اتفق</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!agreed) {
        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 700, direction: 'rtl', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                        حسن قي
                    </p>
                    <button className="btn btn-success" onClick={() => setAgreed(true)}>اتفق وبشدة</button>
                </div>
            </div>
        );
    }

    /* ─── Main content ─── */
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ maxWidth: '720px', margin: '0 auto 2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ← رجوع
                    </Link>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #f97316, #ef4444)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                    }}>🔥 التحريقات</h1>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{data.length} تحريقة</span>
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '4rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    جاري التحميل...
                </div>
            )}
            {error && (
                <div style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '4rem' }}>
                    خطأ: {error}
                </div>
            )}

            {!loading && !error && (
                <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {grouped.map((user, index) => {
                        const color = getColor(user.user_id);
                        return (
                            <div key={index} className="card" style={{ borderColor: color + '55' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', direction: 'rtl' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '1rem', color: '#fff', flexShrink: 0,
                                    }}>
                                        {user.user_id.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color }}>{user.user_id}</h2>
                                    <span style={{ marginRight: 'auto', color: 'var(--muted)', fontSize: '0.8rem' }}>
                                        {user.phrases.length} تحريقة
                                    </span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {user.phrases.map((phrase, pi) => (
                                        <li key={pi} style={{
                                            background: 'var(--surface2)',
                                            borderRadius: '8px',
                                            padding: '10px 14px',
                                            direction: 'rtl',
                                            fontSize: '0.95rem',
                                            borderRight: `3px solid ${color}`,
                                            color: 'var(--foreground)',
                                        }}>
                                            {phrase}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

export default BurnsPage;