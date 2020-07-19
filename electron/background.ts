import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    mainWindow.setMenu(null);

    if (isProd) {
        await mainWindow.loadURL('app://./index.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on('window-all-closed', () => {
    app.quit();
});