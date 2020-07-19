module.exports = {
    mainSrcDir: 'electron',
    rendererSrcDir: '.',
    webpack: (defaultConfig, env) => {
        return defaultConfig;
    },
};