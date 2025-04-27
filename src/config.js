let config = {
    "AppName": "Drawbridge",
    "Database": {
        "dialect": "mysql",
        "host": "127.0.0.1",
        "name": "drawbridge",
        "port": 3306,
        "username": "root",
        "password": "root"
    },
    "JWT": {
        "SECRET": "",
        "expires_in": "6h"
    },
    "AuthenticationStrategies": {
        "Google": {
            "Client_ID": "",
        }
    }
}

/**
 * Set the config from the user including the default config
 * @param {*} userConfig - the config file passed by the user
 */
function setConfig(userConfig = {}) {
    config = { ...config, ...userConfig };
  }
  
  /**
   * Get the config for use
   * @returns the config
   */
  function getConfig() {
      return config;
  }

export { setConfig, getConfig };