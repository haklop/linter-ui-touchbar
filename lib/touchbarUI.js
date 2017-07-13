const {CompositeDisposable} = require('atom');

const remote = require('remote');
const {TouchBar} = remote;
const {TouchBarButton} = TouchBar;

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
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarClickBehavior', statusBarClickBehavior => {
      const notInitial = typeof this.statusBarClickBehavior !== 'undefined';
      this.statusBarClickBehavior = statusBarClickBehavior;
      if (notInitial) {
        this.update();
      }
    }));

    this.error = new TouchBarButton({
      label: ' 0 error',
      click: () => this.onClick('error')
    });

    this.warning = new TouchBarButton({
      label: '0 warning',
      click: () => this.onClick('warning')
    });

    this.info = new TouchBarButton({
      label: '0 info',
      click: () => this.onClick('info')
    });

    this.touchBar = new TouchBar([
      this.error,
      this.warning,
      this.info
    ]);

    remote.getCurrentWindow().setTouchBar(this.touchBar);
  }

  didBeginLinting() {
  }

  didFinishLinting() {
  }

  render({messages}) {
    this.update(messages);
  }

  onClick(type) {
    const workspaceView = atom.views.getView(atom.workspace)
    if (this.statusBarClickBehavior === 'Toggle Panel') {
      atom.commands.dispatch(workspaceView, 'linter-ui-default:toggle-panel')
    } else if (this.statusBarClickBehavior === 'Toggle Status Bar Scope') {
      atom.config.set('linter-ui-default.statusBarRepresents', this.statusBarRepresents === 'Entire Project' ? 'Current File' : 'Entire Project')
    } else {
      const postfix = this.statusBarRepresents === 'Current File' ? '-in-current-file' : ''
      atom.commands.dispatch(workspaceView, `linter-ui-default:next-${type}${postfix}`)
    }
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

    let warningLabel = count.warning + ' warning';
    if (count.warning > 1) {
      warningLabel += 's';
    }
    this.warning.label = warningLabel;
    if (count.warning > 0) {
      this.warning.backgroundColor = '#ce9912';
    } else {
      this.warning.backgroundColor = undefined;
    }

    let infoLabel = count.info + ' info';
    if (count.info > 1) {
      infoLabel += 's';
    }
    this.info.label = infoLabel;
    if (count.info > 0) {
      this.info.backgroundColor = '#308de5';
    } else {
      this.info.backgroundColor = undefined;
    }

    // ugly fix but can't set backgroundColor to undefined
    remote.getCurrentWindow().setTouchBar(this.touchBar);
  }

  dispose() {
    this.subscriptions.dispose();
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
