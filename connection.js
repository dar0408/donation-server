var mysql = require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Darpan@2004",
    database:"new"
});
con.connect(function(err){
    if(err)
    throw err;

});
module.exports=con;