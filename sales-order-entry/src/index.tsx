import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

declare global {
  interface Window {
    'sales-order-entry_mount': any;
    'sales-order-entry_unmount': any;
  }
}

let mountId: string | undefined = undefined;

window['sales-order-entry_mount'] = (id: string = 'root') => {
  mountId = id;

  ReactDOM.render(<App />, document.getElementById(id));
};

window['sales-order-entry_unmount'] = () => {
  if (mountId) {
    const mountNode = document.getElementById(mountId);
    if (mountNode) {
      ReactDOM.unmountComponentAtNode(mountNode);
    }
  }
};
