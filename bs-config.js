
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "files": "css/*.css",
    "server": false,
    "proxy": {
	host: "localhost",
	port: 63342
	},
    "port": 3000,
    "ghostMode": {
        "clicks": true,
        "scroll": true,
        "location": false,
        "forms": {
            "submit": true,
            "inputs": true,
            "toggles": true
        }
    },
    "logLevel": "info",
    "open": true,
    "browser": "default",
    "xip": false,
    "hostnameSuffix": false,
    "notify": true,
    "scrollProportionally": true,
    "scrollThrottle": 0,
    "reloadDelay": 0,
    "injectChanges": false,
    "startPath": null,
    "minify": true,
    "logConnections": false,
    "logFileChanges": true,
    "host": null,
    "codeSync": true,
    "timestamps": true,
    "debugInfo": true
}
