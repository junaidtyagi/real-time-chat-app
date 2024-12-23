const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_STR);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("database connected successfully")
})
db.on('err',()=>{
    console.log("database is not connected")
});
module.exports = db;