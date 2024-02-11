const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/DMOSADMIN");
const db = mongoose.connection;
db.on('err',console.error.bind(console,"DB NOT CONNECTED"));
db.once('open',(err)=>
{
    if(err)
    {
        console.log("DB NOT CONNECTED");
        return false;
    }
    console.log("DB CONNECTED");
});

module.exports = db;
