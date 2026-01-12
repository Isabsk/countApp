import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

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
            {count}
          </div>

          <div className="controls">
            <button className="btn" onClick={decrement} aria-label="Decrease">
              −
            </button>
            <button className="btn" onClick={increment} aria-label="Increase">
              +
            </button>
          </div>

          <button className="btn btn-reset" onClick={reset}>
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
