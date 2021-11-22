const path = require('path')

var sqlite3 = (process.env.NODE_ENV === 'development') ? require('../../node_modules/sqlite3').verbose() :  require(path.join(__dirname, '../../node_modules/', 'sqlite3')).verbose();
const DBSOURCE = (process.env.NODE_ENV === 'development') ? './dbFile/Concord.sqlite' : path.join(__dirname, '../../dbFile/', 'Concord.sqlite');


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
      console.log('Connected to the SQLite database.');
      
    }
});




module.exports = db