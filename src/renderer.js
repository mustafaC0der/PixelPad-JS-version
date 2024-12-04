const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
    const editor = document.getElementById('editor');
    const newNote = document.getElementById('new-note');
    const openNote = document.getElementById('open-note');
    const saveNote = document.getElementById('save-note');
    const toggleTheme = document.getElementById('toggle-theme');

    let currentTheme = 'light';
    let themes = await ipcRenderer.invoke('theme:getThemes');

    const applyTheme = (themeName) => {
        if (themes && themes.themes[themeName]) {
            const theme = themes.themes[themeName];
            document.body.style.backgroundColor = theme.bgColor;
            document.body.style.color = theme.textColor;
            document.querySelector('.app-header').style.backgroundColor = theme.headerBg;
            document.querySelector('.app-header').style.color = theme.headerText;
            editor.style.backgroundColor = theme.editorBg;
            editor.style.color = theme.editorText;
        }
    };

    newNote.addEventListener('click', () => {
        editor.value = '';
    });

    openNote.addEventListener('click', async () => {
        const content = await ipcRenderer.invoke('dialog:openFile');
        if (content !== null) {
            editor.value = content;
        }
    });

    saveNote.addEventListener('click', async () => {
        const content = editor.value;
        await ipcRenderer.invoke('dialog:saveFile', content);
    });

    toggleTheme.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });

    // Apply the default theme on startup
    applyTheme(themes.default || 'light');
});
const fs = require('fs');
const path = require('path');

// Load themes.json
const themesPath = path.join(__dirname, '../config/themes.json');
const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));

// Log available themes
console.log('Available Themes:', Object.keys(themes.themes));
