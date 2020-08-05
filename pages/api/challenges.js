import { getSession } from 'next-auth/client'
const db = require('../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    const session = await getSession({ req })
    const uname = req.query.name ? req.query.name : session.user.name

    if (!uname) {
        return res.status(401).end()
    }

    const user = await db.query(escape`
        SELECT id FROM users where name = ${uname}
    `)

    if (!user || !user.length) {
        return res.status(401).end()
    }

    const id = user[0].id

    if (req.method === 'POST') {
        if (!session) {
            return res.status(401).json([])
        }
        const existing = await db.query(escape`
            SELECT * FROM challenges WHERE user_id = ${id} AND segment_id = ${req.body.id}
        `)

        if (!existing.length) {
            const result = await db.query(escape`
                INSERT INTO challenges
                (user_id, segment_id, segment_name, time_to_beat)
                VALUES (${id}, ${req.body.id}, ${req.body.segment}, ${req.body.ttb})
            `)
            return res.status(200).end()
        } else {
            return res.status(303).end()
        }
    } else if (req.method === 'DELETE') {
        if (!session) {
            return res.status(401).json([])
        }
        const existing = await db.query(escape`
            SELECT * FROM challenges WHERE user_id = ${id} AND segment_id = ${req.body.id}
        `)

        if (existing) {
            db.query(escape`
                DELETE FROM challenges WHERE user_id = ${id} AND segment_id = ${req.body.id}
            `)
            return res.status(200).end()
        } else {
            return res.status(404).end()
        }
    } else if (req.method === 'PUT') {
        if (!session) {
            return res.status(401).json([])
        }
        const existing = await db.query(escape`
            SELECT * FROM challenges WHERE user_id = ${id} AND segment_id = ${req.body.id}
        `)

        if (existing && !existing[0].new_best) {
            db.query(escape`
                UPDATE challenges SET time_to_beat = ${req.body.ttb} WHERE user_id = ${id} AND segment_id = ${req.body.id}
            `)
            return res.status(200).end()
        } else {
            return res.status(404).end()
        }
    } else if (req.method === 'GET') {
        const results = await db.query(escape`
            SELECT * FROM challenges WHERE user_id = ${id}
        `)

        return res.status(200).json(results)
    }
}
