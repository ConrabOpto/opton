const { app, BrowserView, BrowserWindow } = require('electron');
const { getDeepLinkUrl, isValidBaseUrl, isValidDeepLinkUrl } = require('./utils/url');
const { createUserSettings } = require('./utils/createUserSettings');
const { startServer, sendUrlAsync } = require('./utils/ipc');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const prompt = require('electron-prompt');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('App starting...');

let win;
let view;

const settings = createUserSettings(app);

if (!app.requestSingleInstanceLock()) {
    const url = getDeepLinkUrl(settings.getUrl());
    if (url) {
        sendUrlAsync(url).then(() => app.quit());
    } else {
        app.quit();
    }
    return;
}

startServer(url => {
    if (isValidDeepLinkUrl(url, settings.getUrl())) {
        log.info(`received deep link url from client ('${url}'); updating view.`);
        view.webContents.loadURL(url);
        if (win.isMinimized()) {
            win.restore();
        }
        win.focus();
    }
});

function askForUrl(callback) {
    prompt(
        {
            title: 'Where do I find ConrabOpto? (:',
            label: 'URL:',
            value: 'http://opto',
            height: 150,
            icon: __dirname + '/icon.ico',
            inputAttrs: {
                type: 'url',
                required: true
            }
        },
        win
    ).then(url => {
        if (!url || !isValidBaseUrl(url)) {
            askForUrl(callback);
        } else {
            callback(url);
        }
    });
}

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: __dirname + '/icon.ico',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.webContents.loadFile('src/index.html');
    win.on('closed', () => {
        win = null;
    });

    if (settings.hasUrl()) {
        createView(settings.getUrl());
    } else {
        askForUrl(url => {
            settings.setUrl(url);
            createView(url);
        });
    }
}

function createView(baseUrl) {
    view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.setBrowserView(view);
    view.setBounds({ x: 1, y: 22, width: 1278, height: 777 });
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL(getDeepLinkUrl(baseUrl) || baseUrl);

    win.on('maximize', () => {
        const bounds = win.getBounds();
        view.setBounds({
            x: 1,
            y: 22,
            width: bounds.width - 16,
            height: bounds.height - 23
        });
    });

    win.on('unmaximize', () => {
        const bounds = win.getBounds();
        view.setBounds({
            x: 1,
            y: 22,
            width: bounds.width - 2,
            height: bounds.height - 23
        });
    });
}

app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
    createWindow();
});

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
