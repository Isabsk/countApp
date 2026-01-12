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
        res.status(200).json({ count: parseInt(value || '0', 10), teamId });
    } else if (req.method === 'POST') {
        const { action } = req.body;

        let newValue;
        if (action === 'increment') {
            newValue = await client.incr(redisKey);
        } else if (action === 'decrement') {
            newValue = await client.decr(redisKey);
        } else if (action === 'reset') {
            await client.set(redisKey, 0);
            newValue = 0;
        } else {
            res.status(400).json({ error: 'Invalid action' });
            return;
        }

        res.status(200).json({ count: newValue, teamId });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
