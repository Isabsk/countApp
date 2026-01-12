import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => setCount(data.count));
  }, []);

  const updateCount = async (action: 'increment' | 'decrement' | 'reset') => {
    // Optimistic update
    if (count !== null) {
      if (action === 'increment') setCount(prev => (prev as number) + 1);
      if (action === 'decrement') setCount(prev => (prev as number) - 1);
      if (action === 'reset') setCount(0);
    }

    try {
      const res = await fetch('/api/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setCount(data.count);
    } catch (error) {
      console.error('Failed to update count', error);
      // Revert or fetch actual state on error
    }
  };

  return (
    <>
      <Head>
        <title>Count App | Premium</title>
        <meta name="description" content="A beautiful counter application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div className="card">
          <h1 className="title">Count App</h1>

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

          <button className="btn btn-reset" onClick={() => updateCount('reset')}>
            Reset Counter
          </button>
        </div>

        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
          filter: 'blur(40px)',
          animation: 'pulse 5s infinite alternate'
        }} />
      </main>
    </>
  );
}
