const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const themeFilePath = path.join(__dirname, 'themes.json');

// Load themes
const loadThemes = () => {
    try {
        const data = fs.readFileSync(themeFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load themes.json:', error);
        return null;
    }
};

app.on('ready', () => {
    const themes = loadThemes();

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('src/index.html');
    mainWindow.webContents.openDevTools();

    ipcMain.handle('theme:getThemes', () => themes);
    ipcMain.handle('theme:toggle', () => {
        mainWindow.webContents.send('theme:toggle');
    });
});
const fs = require('fs');
const path = require('path');

// Load config.json
const configPath = path.join(__dirname, '../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('App Name:', config.appName);
