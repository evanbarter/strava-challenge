const mysql = require('serverless-mysql')

const db = mysql({
    config: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_DB,
    }
})

exports.query = async query => {
    try {
      const results = await db.query(query)
      await db.end()
      return results
    } catch (error) {
      return { error }
    }
}