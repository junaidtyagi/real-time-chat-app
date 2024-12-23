const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

const db = require('./config/db')

const server =require('./app')
const Port = process.env.PORT || 3000 ;
server.listen(Port, ()=>{
    console.log("server is running on " + Port);
})