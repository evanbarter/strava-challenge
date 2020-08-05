import { getSession } from 'next-auth/client'
const db = require('../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    if (req.method === 'GET') {
        const session = await getSession({ req })
        if (!session) return res.status(401).json([])

        // const session = { user: { name: 'evan_barter' } }

        const user = await db.query(escape`
            SELECT id FROM users where name = ${session.user.name}
        `)
        const user_id = user[0].id

        const segments = await db.query(escape`
            SELECT segment_id, time_to_beat FROM challenges WHERE user_id = ${user_id}
        `)

        if (!segments || !segments.length) return res.status(200).json([])

        const segmentMap = segments.reduce((a, c) => {
            return {...a, [c.segment_id]: c.time_to_beat}
        }, {})
        const segmentIds = []
        for (let segment of segments) {
            segmentIds.push(segment.segment_id)
        }

        const results = await db.query(escape`
            SELECT c.user_id, time_to_beat, segment_id, segment_name, u.name, u.image, a.provider_account_id FROM challenges c
            LEFT JOIN users u
                ON c.user_id = u.id
            LEFT JOIN accounts a
                ON c.user_id = a.user_id
            WHERE segment_id IN (
                ${segmentIds}
            ) AND c.user_id != ${user_id}
        `)

        const buddies = {}
        for (let i = 0; i < results.length; i++) {
            let result = results[i]
            if (Math.abs((result.time_to_beat - segmentMap[result.segment_id]) / segmentMap[result.segment_id]) <= 0.15) {
                let data = {
                    segment: result.segment_name,
                    ttb: result.time_to_beat,
                    image: result.image,
                    strava: result.provider_account_id
                }
                if (typeof buddies[result.name] !== 'undefined') {
                    buddies[result.name]['segments'].push({ segment: result.segment_name, ttb: result.time_to_beat })
                } else {
                    buddies[result.name] = { image: result.image, strava: result.provider_account_id, segments: [{ segment: result.segment_name, ttb: result.time_to_beat }] }
                }
            }
        }

        res.status(200).end(JSON.stringify([buddies]))
    }
}