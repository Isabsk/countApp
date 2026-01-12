import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { TEAMS, ADMIN } from '../../lib/constants';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    const team = TEAMS.find((t) => t.id === username && t.password === password);
    const isAdmin = username === ADMIN.id && password === ADMIN.password;

    if (team || isAdmin) {
        const role = isAdmin ? 'admin' : 'team';
        const cookie = serialize('auth', JSON.stringify({ username, role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        res.setHeader('Set-Cookie', cookie);
        return res.status(200).json({ success: true, role });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
}
