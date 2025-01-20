const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Membuat atau membuka file database
let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
    // Membuat tabel jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS data_timbang (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomor TEXT,
        kontrak TEXT,
        expedisi TEXT,
        supplier TEXT,
        komoditi TEXT,
        catatan TEXT
    )`);
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
    const stmt = db.prepare("INSERT INTO data_timbang (nomor, kontrak, expedisi, supplier, komoditi, catatan) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(data.nomor, data.kontrak, data.expedisi, data.supplier, data.komoditi, data.catatan, function(err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Row was added to the table: ${this.lastID}`);
        }
    });
    stmt.finalize();
});