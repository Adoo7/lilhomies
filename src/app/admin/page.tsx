'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ADMIN_PASSWORD = 'hassan_is_gay';

interface BurnRow {
  user_id: string;
  phrase: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [data, setData] = useState<BurnRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Bulk insert form state
  const [insertUserId, setInsertUserId] = useState('');
  const [insertPhrases, setInsertPhrases] = useState('');
  const [insertStatus, setInsertStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [inserting, setInserting] = useState(false);

  // Delete state
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('كلمة المرور خاطئة');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/burns');
      if (!res.ok) throw new Error('فشل تحميل البيانات');
      const json = await res.json();
      setData(Array.isArray(json.rows) ? json.rows : []);
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const handleBulkInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    const phrases = insertPhrases
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (!insertUserId.trim()) {
      setInsertStatus({ type: 'error', msg: 'أدخل اسم المستخدم' });
      return;
    }
    if (phrases.length === 0) {
      setInsertStatus({ type: 'error', msg: 'أدخل تحريقة واحدة على الأقل' });
      return;
    }

    setInserting(true);
    setInsertStatus(null);
    try {
      const res = await fetch('/api/burns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: insertUserId.trim(), phrases }),
      });
      if (!res.ok) throw new Error('فشل الإضافة');
      const json = await res.json();
      setInsertStatus({ type: 'success', msg: `تم إضافة ${json.inserted} تحريقة بنجاح ✅` });
      setInsertPhrases('');
      await fetchData();
    } catch (err) {
      setInsertStatus({ type: 'error', msg: (err as Error).message });
    } finally {
      setInserting(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteUserId.trim()) {
      setDeleteStatus({ type: 'error', msg: 'أدخل اسم المستخدم' });
      return;
    }
    setDeleting(true);
    setDeleteStatus(null);
    try {
      const res = await fetch('/api/burns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteUserId.trim() }),
      });
      if (!res.ok) throw new Error('فشل الحذف');
      setDeleteStatus({ type: 'success', msg: `تم حذف جميع تحريقات "${deleteUserId}" ✅` });
      setDeleteUserId('');
      await fetchData();
    } catch (err) {
      setDeleteStatus({ type: 'error', msg: (err as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Password gate ─── */
  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '1rem',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
            لوحة التحكم
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>أدخل كلمة المرور للدخول</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ textAlign: 'center', direction: 'ltr' }}
              autoFocus
            />
            {passwordError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem', margin: 0 }}>{passwordError}</p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── Admin dashboard ─── */
  const grouped = data.reduce((acc, item) => {
    const ex = acc.find((u) => u.user_id === item.user_id);
    if (ex) ex.phrases.push(item.phrase);
    else acc.push({ user_id: item.user_id, phrases: [item.phrase] });
    return acc;
  }, [] as { user_id: string; phrases: string[] }[]);

  const users = [...new Set(data.map((r) => r.user_id))];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← رجوع</Link>
          <h1 style={{
            fontSize: '1.8rem', fontWeight: 800, margin: 0,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>🔧 لوحة التحكم</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{data.length} سجل</span>
        </div>

        {/* Bulk Insert */}
        <section className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', direction: 'rtl', color: 'var(--foreground)' }}>
            ➕ إضافة تحريقات
          </h2>
          <form onSubmit={handleBulkInsert} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '4px', direction: 'rtl' }}>
                اسم المستخدم
              </label>
              <input
                type="text"
                placeholder="مثلاً: حسن"
                value={insertUserId}
                onChange={(e) => setInsertUserId(e.target.value)}
                style={{ direction: 'rtl' }}
                list="user-list"
              />
              <datalist id="user-list">
                {users.map((u) => <option key={u} value={u} />)}
              </datalist>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '4px', direction: 'rtl' }}>
                التحريقات (كل سطر = تحريقة واحدة)
              </label>
              <textarea
                placeholder={'تحريقة أولى\nتحريقة ثانية\nتحريقة ثالثة'}
                value={insertPhrases}
                onChange={(e) => setInsertPhrases(e.target.value)}
                style={{ direction: 'rtl', minHeight: '130px' }}
              />
            </div>
            {insertStatus && (
              <p style={{ color: insertStatus.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem', margin: 0, direction: 'rtl' }}>
                {insertStatus.msg}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={inserting} style={{ alignSelf: 'flex-start' }}>
              {inserting ? 'جاري الإضافة...' : 'إضافة'}
            </button>
          </form>
        </section>

        {/* Delete */}
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', direction: 'rtl', color: 'var(--foreground)' }}>
            🗑️ حذف تحريقات مستخدم
          </h2>
          <form onSubmit={handleDelete} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '4px', direction: 'rtl' }}>
                اسم المستخدم
              </label>
              <input
                type="text"
                placeholder="مثلاً: حسن"
                value={deleteUserId}
                onChange={(e) => setDeleteUserId(e.target.value)}
                style={{ direction: 'rtl' }}
                list="user-list-del"
              />
              <datalist id="user-list-del">
                {users.map((u) => <option key={u} value={u} />)}
              </datalist>
            </div>
            <button type="submit" className="btn btn-danger" disabled={deleting} style={{ marginBottom: '1px' }}>
              {deleting ? 'جاري الحذف...' : 'حذف الكل'}
            </button>
          </form>
          {deleteStatus && (
            <p style={{ color: deleteStatus.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem', marginTop: '0.75rem', direction: 'rtl' }}>
              {deleteStatus.msg}
            </p>
          )}
        </section>

        {/* Data table */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, direction: 'rtl', color: 'var(--foreground)' }}>📋 السجلات</h2>
            <button className="btn btn-primary" onClick={fetchData} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>تحديث</button>
          </div>

          {loading && <p style={{ color: 'var(--muted)', textAlign: 'center' }}>جاري التحميل...</p>}
          {fetchError && <p style={{ color: 'var(--danger)', direction: 'rtl' }}>خطأ: {fetchError}</p>}

          {!loading && !fetchError && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {grouped.map((user, i) => (
                <div key={i} style={{
                  background: 'var(--surface2)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    padding: '10px 16px',
                    background: 'var(--border)',
                    direction: 'rtl',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontWeight: 700 }}>{user.user_id}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{user.phrases.length} تحريقة</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: '8px' }}>
                    {user.phrases.map((phrase, pi) => (
                      <li key={pi} style={{
                        padding: '8px 12px',
                        direction: 'rtl',
                        borderBottom: pi < user.phrases.length - 1 ? '1px solid var(--border)' : 'none',
                        fontSize: '0.9rem',
                        color: 'var(--foreground)',
                      }}>
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
