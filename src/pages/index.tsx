import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [teamInfo, setTeamInfo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/count')
      .then(res => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCount(data.count);
          setTeamInfo(data.teamId);
        }
      });
  }, [router]);

  const updateCount = async (action: 'increment' | 'decrement') => {
    // Optimistic update
    if (count !== null) {
      if (action === 'increment') setCount(prev => (prev as number) + 1);
      if (action === 'decrement') setCount(prev => (prev as number) > 0 ? (prev as number) - 1 : 0);
    }

    try {
      const res = await fetch('/api/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCount(data.count);
    } catch (error) {
      console.error('Failed to update count', error);
      router.push('/login');
    }
  };

  const handleLogout = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>Count App | Team {teamInfo}</title>
      </Head>
      <main className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 className="title">{teamInfo}</h1>
            <button className="btn-reset" onClick={handleLogout} style={{ marginTop: 0 }}>Logout</button>
          </div>

          <div className="count-display">
            {count !== null ? count : '...'}
          </div>

          <div className="controls">
            <button className="btn" onClick={() => updateCount('decrement')} aria-label="Decrease">
              −
            </button>
            <button className="btn" onClick={() => updateCount('increment')} aria-label="Increase">
              +
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
