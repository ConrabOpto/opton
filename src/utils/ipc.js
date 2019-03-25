const ipc = require('node-ipc');

const clientId = 'conrabOptoClient';
const serverId = 'conrabOptoServer';

const MSG_UPDATE_URL = 'conrabopto-update-url';
const MSG_URL_UPDATED = 'conrabopto-url-updated';

module.exports = {
    startServer: function(onUpdateUrl) {
        ipc.config.id = serverId;
        ipc.config.retry = 100;
        ipc.serve(() => {
            ipc.server.on(MSG_UPDATE_URL, (url, socket) => {
                onUpdateUrl(url);
                ipc.server.emit(socket, MSG_URL_UPDATED, null);
            });
        });
        ipc.server.start();
    },
    sendUrlAsync: function(url) {
        return new Promise(resolve => {
            try {
                ipc.config.id = clientId;
                ipc.config.retry = 100;
                ipc.connectTo(serverId, () => {
                    ipc.of[serverId].on('connect', () => {
                        ipc.of[serverId].on(MSG_URL_UPDATED, () => {
                            ipc.of[serverId].on('disconnect', () => {
                                resolve();
                            });
                            ipc.disconnect(serverId);
                        });
                        ipc.of[serverId].emit(MSG_UPDATE_URL, url);
                    });
                });
                setTimeout(() => {
                    resolve();
                }, 1000);
            } catch (err) {
                resolve();
            }
        });
    }
};
