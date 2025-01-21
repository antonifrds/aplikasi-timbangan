const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
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
    // Membuat tabel jika belum ada
    db.query(`CREATE TABLE IF NOT EXISTS data_timbang (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor VARCHAR(255),
        kontrak VARCHAR(255),
        expedisi VARCHAR(255),
        supplier VARCHAR(255),
        komoditi VARCHAR(255),
        catatan TEXT
    )`, (err, result) => {
        if (err) {
            console.error('Error creating table:', err.message);
            throw err;
        }
        console.log("Tabel data_timbang berhasil dibuat atau sudah ada");
    });
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('save-data', (event, data) => {
    const stmt = `INSERT INTO data_timbang (nomor, kontrak, expedisi, supplier, komoditi, catatan) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(stmt, [data.nomor, data.kontrak, data.expedisi, data.supplier, data.komoditi, data.catatan], function(err, result) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Row was added to the table: ${result.insertId}`);
        }
    });
});
