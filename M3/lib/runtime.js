app.version = function() {
    return API.runtime.getManifest()
        .version
};
app.homepage = function() {
    return API.runtime.getManifest()
        .homepage_url
};

if (!navigator.webdriver) {
    app.on.uninstalled(app.homepage() + "?v=" + app.version() + "&type=uninstall");
    app.on.installed(function(e) {
        app.on.management(function(result) {
            if (result.installType === "normal") {
                app.tab.query.index(function(index) {
                    let previous = e.previousVersion !== undefined && e.previousVersion !== app.version();
                    let doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
                    if (e.reason === "install" || (e.reason === "update" && doupdate)) {
                        let parameter = (e.previousVersion ? "&p=" + e.previousVersion : '') + "&type=" + e.reason;
                        let url = app.homepage();
                        app.tab.open(url, index, e.reason === "install");
                        config.welcome.lastupdate = Date.now();
                    }
                });
            }
        });
    });
}

app.on.message(function(request) {
    if (request) {
        if (request.path === "options-to-background") {
            for (let id in app.options.message) {
                if (app.options.message[id]) {
                    if ((typeof app.options.message[id]) === "function") {
                        if (id === request.method) {
                            app.options.message[id](request.data);
                        }
                    }
                }
            }
        }
    }
});

app.on.connect(function(port) {
    if (port) {
        if (port.name) {
            if (port.name in app) {
                app[port.name].port = port;
            }
        }
        /*  */
        port.onDisconnect.addListener(function(e) {
            app.storage.load(function() {
                if (e) {
                    if (e.name) {
                        if (e.name in app) {
                            app[e.name].port = null;
                        }
                    }
                }
            });
        });
        /*  */
        port.onMessage.addListener(function(e) {
            app.storage.load(function() {
                if (e) {
                    if (e.path) {
                        if (e.port) {
                            if (e.port in app) {
                                if (e.path === (e.port + "-to-background")) {
                                    for (let id in app[e.port].message) {
                                        if (app[e.port].message[id]) {
                                            if ((typeof app[e.port].message[id]) === "function") {
                                                if (id === e.method) {
                                                    app[e.port].message[id](e.data);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    }
});