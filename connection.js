const {Pool} = require('pg');




const con = new Pool({
    user:'postgres',
    host: 'localhost',
    database: 'voting',
    password: 'phary4408',
    port: 5432 // default PostgreSQL port
  });
  
  // test the connection
  con.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error executing query', err.stack);
    } else {
      console.log('Connected to PostgreSQL database:', res.rows[0].now);
    
    }

  });

  exports.con = con;