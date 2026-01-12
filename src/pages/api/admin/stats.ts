import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/redis';
import { parse } from 'cookie';
import { TEAMS, ADMIN } from '../../../lib/constants';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parse(req.headers.cookie || '');
    const auth = cookies.auth ? JSON.parse(cookies.auth) : null;

    if (!auth || auth.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        const stats = await Promise.all(
            TEAMS.map(async (team) => {
                const count = await client.get(`team:${team.id}:count`);
                return {
                    teamId: team.id,
                    count: parseInt(count || '0', 10),
                };
            })
        );

        return res.status(200).json({ stats });
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
