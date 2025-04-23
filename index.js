import config from "./config/config";
import { Login, Register, Logout } from "./src/authentication/AuthenticationManager";

const defaultConfig = config || {"AppName": "Drawbridge"};
let internalConfig = { ...defaultConfig };

/**
 * Set the config from the user including the default internalConfig
 * @param {*} userConfig - the config file passed by the user
 */
function setConfig(userConfig = {}) {
  internalConfig = { ...defaultConfig, ...userConfig };
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
    getConfig,
    Login,
    Register,
    Logout
}