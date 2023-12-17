const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uas-pps'
});

connection.connect((err) => {
    if(err) {
        console.error('Error!! Gagal tersambung ke database');
        return;
    } else {
    console.log('Berhasil sambung ke database!');
    }
});

module.exports = connection;