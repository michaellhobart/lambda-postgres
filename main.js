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
  pool.connect()
  .then(client => {
    return client.query('SELECT * FROM mpc_clients')
      .then(res => {
        client.release()
        callback(null, res.rows)
      })
      .catch(e => {
        client.release()
        console.log(e.stack)
      })
  })
}
