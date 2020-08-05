import { getStravaUserToken } from '../../lib/token'
import { getSession } from 'next-auth/client'
const db = require('../../lib/db')
const escape = require('sql-template-strings')

export default async function getSegments(req, res) {
    const session = await getSession({ req })

    if (!session) {
        return res.status(401).json([])
    }

    const user = await db.query(escape`
        SELECT id FROM users where name = ${session.user.name}
    `)

    const user_id = user[0].id
    const token = await getStravaUserToken(user_id)

    const response = await fetch('https://www.strava.com/api/v3/segments/starred?page=1&per_page=100', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if (response.status >= 200 && response.status <= 299) {
        res.status(200).json(await response.json())
    } else {
        res.status(response.status)
    }

    return res.end()
}