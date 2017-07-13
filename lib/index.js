const TouchBarUI = require('./touchbarUI');

const TouchBarDefault = {
  instance: null,

  deactivate() {
    this.instance.dispose();
  },

  active() {

  },

  provideUI() {
    this.instance = new TouchBarUI();
    return this.instance;
  }
};

module.exports = TouchBarDefault;
