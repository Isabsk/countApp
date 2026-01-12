import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface TeamStat {
    teamId: string;
    count: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<TeamStat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                setStats(data.stats);
                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
            });
    }, [router]);

    const handleLogout = () => {
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/login');
    };

    if (loading) return null;

    return (
        <>
            <Head>
                <title>Admin Dashboard | Count App</title>
            </Head>
            <main className="container">
                <div className="card" style={{ width: '90%', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <h1 className="title">Admin Dashboard</h1>
                        <button className="btn-reset" onClick={handleLogout}>Logout</button>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Team ID</th>
                                <th>Current Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat) => (
                                <tr key={stat.teamId}>
                                    <td>{stat.teamId}</td>
                                    <td>{stat.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}
