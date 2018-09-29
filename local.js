const { Pool } = require('pg')

const config = require('./config.json')

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.query('SELECT * FROM mpc_clients')
  .then(res => console.log(res.rows))
  .then(() => pool.end())
  .catch(e => setImmediate(() => { throw e }))
