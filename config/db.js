//--------------------------------------------------
//Connection to database pool
//--------------------------------------------------
const mysql = require('mysql2/promise');
const config = require('config');
const dbConfig = config.get('User.Database');

// Connects the database to our server
function getConnectionConfig() {
  return {
    host: dbConfig.host,
    user: dbConfig.db_username,
    password: dbConfig.db_password,
    database: dbConfig.db_name,
    port: dbConfig.port,
  };
}

const pool = mysql.createPool(getConnectionConfig());

// Creates a query based on the sql and params inserted
async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results, ] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('An error occurred:', error); 
    throw error; 
  } finally {
    connection.release(); 
  }
}

module.exports = {
  query,
  getConnectionConfig,
};