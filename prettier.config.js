module.exports = {
    singleQuote: true,
    printWidth: 100,
    tabWidth: 4,
    jsxBracketSameLine: true,
    overrides: [
        {
            files: '*.css',
            options: {
                singleQuote: false
            }
        }
    ],
    parser: 'babylon'
};
