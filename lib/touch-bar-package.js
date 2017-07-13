'use babel';

import TouchBarPackageView from './touch-bar-package-view';
import { CompositeDisposable } from 'atom';

export default {

  touchBarPackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.touchBarPackageView = new TouchBarPackageView(state.touchBarPackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.touchBarPackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touch-bar-package:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.touchBarPackageView.destroy();
  },

  serialize() {
    return {
      touchBarPackageViewState: this.touchBarPackageView.serialize()
    };
  },

  toggle() {
    console.log('TouchBarPackage was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
