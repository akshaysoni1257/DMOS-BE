const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://soniakshay1257:mongodbatlas@cluster0.ipx46gh.mongodb.net/DMOS_ADMIN?retryWrites=true&w=majority&appName=Cluster0");
const db = mongoose.connection;
db.on('err',console.error.bind(console,"DB NOT CONNECTED"));
db.once('open',(err)=>
{
    if(err)
    {
        console.log("DB NOT CONNECTED");
        return false;
    }
    console.log("DB CONNECTED In DMOS_ADMIN");
});

module.exports = db;
