import config from "./config/config";

let internalConfig = config || {"AppName": "Drawbridge"};

/**
 * Set the config from the user including the default internalConfig
 * @param {*} userConfig - the config file passed by the user
 */
function setConfig(userConfig) {
  internalConfig = { ...internalConfig, ...userConfig };
}

/**
 * Get the config for use
 * @returns the config
 */
function getConfig() {
    return internalConfig;
}

export {
    setConfig,
    getConfig
}