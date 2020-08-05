const db = require('./db')
const escape = require('sql-template-strings')

const getStravaUserToken = async userId => {
    const result = await db.query(escape`
        SELECT refresh_token, access_token, ROUND(UNIX_TIMESTAMP(access_token_expires)) AS expires
        FROM accounts
        WHERE user_id = ${userId}
    `)

    if (!result || !result.length) return null

    if (result[0].expires > Math.floor(Date.now() / 1000)) {
        return result[0].access_token
    } else {
        const request = await fetch('https://www.strava.com/api/v3/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${result[0].refresh_token}`
        })

        if (request.status >= 200 && request.status <= 299) {
            const data = await request.json()
            db.query(escape`
                UPDATE accounts
                SET refresh_token = ${data.refresh_token}, access_token = ${data.access_token}, access_token_expires = FROM_UNIXTIME(${data.expires_at})
                WHERE user_id = ${userId}
            `)

            return data.access_token
        } else {
            return null
        }
    }
}

export { getStravaUserToken }