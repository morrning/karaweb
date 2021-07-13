const express = require('express');
const TYPES = require("tedious").TYPES;
global.config = require('./config.json');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

const app = express();
const port = 3002;
global.dbData = [];
var dbconfig = {
    "server": config.db.host,
    "authentication": {
        "type": "default",
        "options": {
            "userName": config.db.user,
            "password": config.db.pass
        }
    },
    "options": {
        "port": 1433,
        "database": config.db.db,
        "trustServerCertificate": false,
        encrypt:false,
        rowCollectionOnRequestCompletion:true
    }
}

var connection = new Connection(dbconfig);
connection.connect();

connection.on('connect', function(err) {
    //If no error, then good to proceed.
    if(err){
        console.log('can not connect to database!');
        console.log('Error: ', err)
    }
    else{
        console.log("Connected to database successful.");
    }

});

app.get('/api/author', (req, res) => {
    res.send('kara web by bAbAk AlIzAdEh<alizadeh.babak@gmail.com>');
})

app.get('/api/code', (req, res) => {
    res.send(JSON.stringify({ 'error': '0','result': '14000401' }));
})

app.get('/api/30day/io/:empCode', (req, res) => {
    request = new Request("SELECT * FROM DataFile WHERE (Emp_No = @code) ORDER BY Date ASC;", function(err, rowCount, rows) {
        console.log("-Doing: Get 30 days I/O for user:" + req.params.empCode)
        var rws = [];
        if (rows != undefined){
            rows.forEach(columns => {
                var resultRow = {
                    Date: Number(columns[2].value),
                    Time: Number(columns[3].value),
                    DeviceNumber: Number(columns[8].value)
                };
                rws.push(resultRow);
            });

            res.send(JSON.stringify(rws));
        }
    });


    request.addParameter('code', TYPES.Int, req.params.empCode);
    connection.execSql(request);


})

app.listen(port, () => {
    (async () => {
        console.log(`Starting Kara Web API on : http://localhost:${port} \n`);
        console.log(` -------- By Babak Alizadeh <alizadeh.babk@gmail.com> -------- \n`);

    })();

})
