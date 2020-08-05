import NextAuth from 'next-auth'
const db = require('../../../lib/db')
const escape = require('sql-template-strings')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


const options = {
  providers: [
    {
        id: 'strava',
        name: 'Strava',
        type: 'oauth',
        version: '2.0',
        scope: 'read,activity:read_all',
        params: { grant_type: 'authorization_code' },
        accessTokenUrl: 'https://www.strava.com/oauth/token',
        authorizationUrl: 'https://www.strava.com/oauth/authorize?response_type=code',
        profileUrl: 'https://www.strava.com/api/v3/athlete',
        profile: (profile) => {
          return {
            id: profile.id,
            name: profile.username,
            image: profile.profile
          }
        },
        clientId: process.env.STRAVA_CLIENT_ID,
        clientSecret: process.env.STRAVA_CLIENT_SECRET
    }
  ],
  debug: false,
  jwt: true,
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB
  },
  events: {
    signIn: async (message) => {
      if (!message.isNewUser) {
        // Tokens expire in 6 hours according to the docs
        const expires = Math.floor(Date.now() / 1000) + 21600
        await db.query(escape`
          UPDATE accounts
          SET refresh_token = ${message.account.refreshToken}, access_token = ${message.account.accessToken}, access_token_expires = FROM_UNIXTIME(${expires})
          WHERE provider_account_id = ${message.account.id}
        `)
      } else {
        if (!message.user.name) {
          const shortName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors],
            length: 2
          });

          await db.query(escape`
            UPDATE users
            SET name = ${shortName}
            WHERE id = ${message.user.id}
          `)
        }
      }
    }
  }
}

export default (req, res) => NextAuth(req, res, options)
