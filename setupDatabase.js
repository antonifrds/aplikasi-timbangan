const sqlite3 = require('sqlite3').verbose();

// Membuat atau membuka file database
let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
});

// Membuat tabel data_timbang
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS data_timbang (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_record TEXT,
        mobil TEXT,
        sopir TEXT,
        tgl_masuk TEXT,
        tara INTEGER,
        bruto INTEGER,
        netto INTEGER
    )`, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        }
        console.log("Tabel data_timbang berhasil dibuat atau sudah ada");
    });
});

// Menutup koneksi database
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});