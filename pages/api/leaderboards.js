const db = require('../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    const type = req.query.type
    const segmentId = req.query.segment || false
    const limit = req.query.limit || 10
    let results

    if (type === 'improved') {
        results = await db.query(escape`
            SELECT c.*, ((new_best - time_to_beat) / time_to_beat) as improved,
                DATE_FORMAT(set_at, '%e %b %Y %h:%i %p') AS date_formatted,
                u.name, u.image
            FROM challenges c
            LEFT JOIN users u
            ON c.user_id = u.id
            WHERE c.new_best IS NOT NULL
            ORDER BY improved ASC
            LIMIT ${limit}
        `)
    } else if (type === 'segment' && segmentId) {
        results = await db.query(escape`
            SELECT c.*, ((c.new_best - c.time_to_beat) / c.time_to_beat) as improved,
            DATE_FORMAT(set_at, '%e %b %Y %h:%i %p') AS date_formatted,
                u.name, u.image
            FROM challenges c
            LEFT JOIN users u
            ON c.user_id = u.id
            WHERE c.new_best IS NOT NULL AND c.segment_id = ${segmentId}
            ORDER BY improved ASC
            LIMIT ${limit}
        `)
    } else {
        results = await db.query(escape`
            SELECT c.*, ((new_best - time_to_beat) / time_to_beat) as improved,
            DATE_FORMAT(set_at, '%e %b %Y %h:%i %p') AS date_formatted,
                u.name, u.image
            FROM challenges c
            LEFT JOIN users u
            ON c.user_id = u.id
            WHERE c.new_best IS NOT NULL
            ORDER BY c.set_at DESC
            LIMIT ${limit}
        `)
    }

    res.status(200).json(results)
}