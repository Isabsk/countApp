import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../lib/redis';
import { parse } from 'cookie';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parse(req.headers.cookie || '');
    const auth = cookies.auth ? JSON.parse(cookies.auth) : null;

    if (!auth) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const teamId = auth.username;
    const redisKey = `team:${teamId}:count`;

    if (req.method === 'GET') {
        const value = await client.get(redisKey);
        res.status(200).json({ count: parseInt(value || '0', 10), teamId, role: auth.role });
    } else if (req.method === 'POST') {
        const { action } = req.body;

        let newValue;
        if (action === 'increment') {
            newValue = await client.incr(redisKey);
        } else if (action === 'decrement') {
            const current = await client.get(redisKey);
            if (parseInt(current || '0', 10) > 0) {
                newValue = await client.decr(redisKey);
            } else {
                newValue = 0;
            }
        } else {
            res.status(400).json({ error: 'Invalid action' });
            return;
        }

        res.status(200).json({ count: newValue, teamId, role: auth.role });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
