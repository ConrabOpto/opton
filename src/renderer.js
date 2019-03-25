const { remote } = require('electron');

function init() {
    const window = remote.getCurrentWindow();
    const minButton = document.getElementById('min-button');
    const maxButton = document.getElementById('max-button');
    const restoreButton = document.getElementById('restore-button');
    const closeButton = document.getElementById('close-button');

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

    toggle(window.isMaximized());
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        init();
    }
};
