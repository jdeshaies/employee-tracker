const mysql = require('mysql2');

// Connects to company database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );