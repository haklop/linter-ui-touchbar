const TouchBarUI = require('./touchbarUI');

const TouchBarDefault = {
  instance: null,

  deactivate() {
    this.instance.dispose();
  },

  activate() {
  },

  provideUI() {
    this.instance = new TouchBarUI();
    if (this.touchbarRegistry) {
      this.instance.attachRegistry(this.touchbarRegistry);
    }
    return this.instance;
  },

  consumeTouchBar(touchbarRegistry) {
    this.touchbarRegistry = touchbarRegistry;
    if (this.instance) {
      this.instance.attachRegistry(this.touchbarRegistry);
    }
  }
};

module.exports = TouchBarDefault;
