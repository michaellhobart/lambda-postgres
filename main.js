const { Pool } = require('pg')

const config = require('./config.json')

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM mpc_clients', [1], (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })
  })
}
