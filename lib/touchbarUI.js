const {CompositeDisposable} = require('atom');

const remote = require('remote');
const {TouchBar} = remote;
const {TouchBarLabel, TouchBarButton} = TouchBar;

class TouchBarUI {

  constructor() {
    this.name = 'touchbar-ui';
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarRepresents', statusBarRepresents => {
      const notInitial = typeof this.statusBarRepresents !== 'undefined';
      this.statusBarRepresents = statusBarRepresents;
      if (notInitial) {
        this.update();
      }
    }));
    this.error = new TouchBarButton();
    this.error.label = '0 error';

    const touchBar = new TouchBar([
      this.error
    ]);

    remote.getCurrentWindow().setTouchBar(touchBar);
  }

  didBeginLinting() {
  }

  didFinishLinting() {
  }

  render({added, removed, messages}) {
    this.update(messages);
  }

  update(messages) {
    if (messages) {
      this.messages = messages;
    } else {
      messages = this.messages;
    }

    const count = {
      error: 0,
      warning: 0,
      info: 0
    };

    const currentTextEditor = getActiveTextEditor();
    const currentPath = (currentTextEditor && currentTextEditor.getPath()) || NaN;

    messages.forEach(message => {
      if (this.statusBarRepresents === 'Entire Project' || $file(message) === currentPath) {
        if (message.severity === 'error') {
          count.error++;
        } else if (message.severity === 'warning') {
          count.warning++;
        } else {
          count.info++;
        }
      }
    });

    let errorLabel = count.error + ' error';
    if (count.error > 1) {
      errorLabel += 's';
    }
    this.error.label = errorLabel;
    if (count.error > 0) {
      this.error.backgroundColor = '#E22D12';
    } else {
      this.error.backgroundColor = undefined;
    }
  }

  dispose() {

  }
}

function getActiveTextEditor() {
  const paneItem = atom.workspace.getCenter().getActivePaneItem();
  return atom.workspace.isTextEditor(paneItem) ? paneItem : null;
}

function $file(message) {
  return message.version === 1 ? message.filePath : message.location.file;
}

module.exports = TouchBarUI;
