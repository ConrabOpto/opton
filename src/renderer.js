const { remote, ipcRenderer } = require('electron');

let optoIsVisible = false;

function init() {
    ipcRenderer.send('show-opto');

    const window = remote.getCurrentWindow();
    const closeButton = document.getElementById('close-button');
    const maxButton = document.getElementById('max-button');
    const minButton = document.getElementById('min-button');
    const restoreButton = document.getElementById('restore-button');
    const settingsButton = document.getElementById('settings-button');

    const toggle = maximized => {
        maxButton.style.display = maximized ? 'none' : 'flex';
        restoreButton.style.display = maximized ? 'flex' : 'none';
    };

    const onClicking = (button, callback) => {
        button.addEventListener('click', () => {
            const win = remote.getCurrentWindow();
            callback(win);
            toggle(win.isMaximized());
        });
    };

    onClicking(minButton, x => x.minimize());
    onClicking(maxButton, x => x.maximize());
    onClicking(restoreButton, x => x.unmaximize());
    onClicking(closeButton, x => x.close());
    onClicking(settingsButton, x => {
        ipcRenderer.send(optoIsVisible ? 'hide-opto' : 'show-opto');
    });

    toggle(window.isMaximized());
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        init();
    }
};

ipcRenderer.on('show-opto', () => {
    console.log('opto was shown');
    optoIsVisible = true;
});

ipcRenderer.on('hide-opto', () => {
    console.log('opto was hidden');
    optoIsVisible = false;
});
