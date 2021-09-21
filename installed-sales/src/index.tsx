import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

declare global {
  interface Window {
    'installed-sales_mount': any;
    'installed-sales_unmount': any;
  }
}

let mountId: string | undefined = undefined;

window['installed-sales_mount'] = (id: string = 'root') => {
  mountId = id;

  ReactDOM.render(<App />, document.getElementById(id));
};

window['installed-sales_unmount'] = () => {
  if (mountId) {
    const mountNode = document.getElementById(mountId);
    if (mountNode) {
      ReactDOM.unmountComponentAtNode(mountNode);
    }
  }
};
