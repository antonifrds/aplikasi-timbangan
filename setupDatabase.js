const mysql = require('mysql');

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'nama_database'
});

// Menghubungkan ke MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        throw err;
    }
    console.log('Connected to the MySQL database.');
});

// Membuat tabel data_timbang
db.query(`CREATE TABLE IF NOT EXISTS data_timbang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_record VARCHAR(255),
    mobil VARCHAR(255),
    sopir VARCHAR(255),
    tgl_masuk DATE,
    tara INT,
    bruto INT,
    netto INT
)`, (err, result) => {
    if (err) {
        console.error('Error creating table:', err.message);
        throw err;
    }
    console.log("Tabel data_timbang berhasil dibuat atau sudah ada");
});

// Jangan lupa untuk menutup koneksi database saat sudah tidak digunakan
// db.end((err) => {
//     if (err) {
//         console.error('Error closing the connection:', err.message);
//     }
//     console.log('Closed the MySQL database connection.');
// });

module.exports = db;
