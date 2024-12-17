var config = {};

config.interface = {
  set size (val) {app.storage.write("interface.size", val)},
  set context (val) {app.storage.write("interface.context", val)},
  get size () {return app.storage.read("interface.size") !== undefined ? app.storage.read("interface.size") : config.interface.default.size},
  get context () {return app.storage.read("interface.context") !== undefined ? app.storage.read("interface.context") : config.interface.default.context},
  "default": {
    "context": "win",
    "size": {
      "width": 1400, 
      "height": 800
    }
  }
};