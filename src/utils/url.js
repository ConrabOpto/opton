const { protocol } = require('electron');

const SCHEME_PREFIX = 'conrabopto';
const SCHEME_URI = `${SCHEME_PREFIX}://`;

protocol.registerStandardSchemes([SCHEME_PREFIX]);

const getDeepLinkUrl = baseUrl => {
    if (baseUrl && process.platform === 'win32') {
        const cmd = process.argv.slice(1);
        const url = cmd && cmd.length > 0 && cmd[0].toString();
        if (url && url.startsWith && url.startsWith(SCHEME_URI)) {
            const relativeUrl = url.split(SCHEME_URI)[1].replace(/^\/+/g, '');
            const deepLinkUrl = `${baseUrl}/${relativeUrl}`;
            if (isValidDeepLinkUrl(deepLinkUrl, baseUrl)) {
                return deepLinkUrl;
            }
        }
    }
    return null;
};

const isValidBaseUrl = url => {
    // todo: validate url
    //  - should only allow urls pointing to the root of a ConrabOpto instance
    return !!url;
};

const isValidDeepLinkUrl = (url, baseUrl) => {
    // todo: validate url
    //  - should only allow non-api urls
    return typeof url === 'string' && url.startsWith(baseUrl);
};

module.exports = {
    getDeepLinkUrl,
    isValidBaseUrl,
    isValidDeepLinkUrl
};
