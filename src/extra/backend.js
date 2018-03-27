import React from 'react';
import ReactDOM from 'react-dom';
// import mysql from 'mysql';

(() => {
    // var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'http://kennethwschmittcom.ipagemysql.com',
        user     : 'sdd',
        password : 'sddimin',
        database : 'sdd'
    });

    connection.connect();

    connection.query('show tables', function(err, results, fields) {
    if (!err)
        console.log('The tables are: ', results);
    else
        console.log('Error while performing Query.');
    });

    connection.end();
})();