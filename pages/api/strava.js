const db = require('../../lib/db')
const escape = require('sql-template-strings')
import { getStravaUserToken } from '../../lib/token'

export default async (req, res) => {
    // Strava is verifying the webhook URL
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'] || req.query['hub_mode']
        const token = req.query['hub.verify_token'] || req.query['hub_verify_token']
        const challenge = req.query['hub.challenge'] || req.query['hub_challenge']

        if (mode === 'subscribe' && token === 'STRAVA') {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).end('{ "hub.challenge": "' + challenge + '" }')
        } else {
            res.status(400).end()
        }
    // Strava is sending data
    } else if (req.method === 'POST') {
        // Close the connection ASAP as Strava doesn't need to wait for this to
        // be processed
        res.status(200).end()

        if (req.body['object_type'] === 'activity' && (req.body['aspect_type'] === 'create' || req.body['aspect_type'] === 'update')) {
            const user = await db.query(escape`
                SELECT user_id FROM accounts WHERE provider_account_id = ${req.body['owner_id']}
            `)

            if (!user || !user.length) return

            const user_id = user[0].user_id
            const token = await getStravaUserToken(user_id)

            const challenges = await db.query(escape`
                SELECT segment_id, time_to_beat FROM challenges WHERE user_id = ${user_id}
            `)

            if (!challenges || !challenges.length) return
            const challenge_map = challenges.reduce((a, c) => {
                return {...a, [c.segment_id]: c.time_to_beat}
            }, {})

            const response = await fetch(`https://www.strava.com/api/v3/activities/${req.body['object_id']}?include_all_efforts=true`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })

            if (!(response.status >= 200 && response.status <= 299)) return

            const activity = await response.json()
            if (typeof activity.segment_efforts !== 'object' || !activity.segment_efforts.length) return

            for (let effort of activity.segment_efforts) {
                if (typeof challenge_map[effort.segment.id] !== 'undefined' && effort.elapsed_time < challenge_map[effort.segment.id]) {
                    console.log('🎉');
                    console.log(`
                    UPDATE challenges
                    SET new_best = ${effort.elapsed_time}, set_at = FROM_UNIXTIME(${Math.floor(Date.now() / 1000)}), activity_id = ${req.body['object_id']}
                    WHERE user_id = ${user_id} AND segment_id = ${effort.segment.id}
                    `)
                    console.log('🎉');
                    db.query(escape`
                        UPDATE challenges
                        SET new_best = ${effort.elapsed_time}, set_at = FROM_UNIXTIME(${Math.floor(Date.now() / 1000)}), activity_id = ${req.body['object_id']}
                        WHERE user_id = ${user_id} AND segment_id = ${effort.segment.id}
                    `)
                }
            }
        }
    }
}
