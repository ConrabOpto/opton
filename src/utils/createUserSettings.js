const fs = require('fs');
const path = require('path');

module.exports = {
    createUserSettings(app) {
        const userPath = app.getPath('userData');
        const settingsFilePath = path.join(userPath, 'settings.json');

        let settings = null;

        if (fs.existsSync(settingsFilePath)) {
            const settingsFile = fs.readFileSync(settingsFilePath, 'utf8');
            settings = JSON.parse(settingsFile);
        }

        return {
            hasUrl() {
                return !!(settings && settings.url);
            },
            getUrl() {
                return settings && settings.url;
            },
            setUrl(url) {
                settings = { url };
                hasUrl = true;
                fs.writeFile(settingsFilePath, JSON.stringify(settings), 'utf8', (err, data) => {});
            }
        };
    }
};
