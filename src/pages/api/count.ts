import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../lib/redis';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const value = await client.get('count');
        res.status(200).json({ count: parseInt(value || '0', 10) });
    } else if (req.method === 'POST') {
        const { action } = req.body;

        let newValue;
        if (action === 'increment') {
            newValue = await client.incr('count');
        } else if (action === 'decrement') {
            newValue = await client.decr('count');
        } else if (action === 'reset') {
            await client.set('count', 0);
            newValue = 0;
        } else {
            res.status(400).json({ error: 'Invalid action' });
            return;
        }

        res.status(200).json({ count: newValue });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
