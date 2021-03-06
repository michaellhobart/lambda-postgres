// Import pg for connecting to Postgres Database
const { Pool } = require('pg')

// Create new pool for connecting to DB and set connection params
// env variables set on lambda function in console
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Exports handler variable for use with Lambda
exports.handler = (event, context, callback) => {
  // Stops Lambda from Timing out
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to DB
  pool.connect()
  // Query DB for all rows in mpc_clients
  .then(client => {
    return client.query('SELECT * FROM mpc_clients')
      .then(res => {
        // Close Connection to DB
        client.release()
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS
            "Access-Control-Allow-Credentials" : true // Required for cookies, auth headers with HTTPS
          },
          body: res.rows
        }

        // Returns the response from the DB query as the lambda respinse
        callback(null, response)
      })
      // Handle any errors
      .catch(e => {
        client.release()
        console.log(e.stack)
      })
  })
}
