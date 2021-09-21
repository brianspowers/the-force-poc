import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

declare global {
  interface Window {
    navigation_mount: any;
    navigation_unmount: any;
  }
}

let mountId: string | undefined = undefined;

window['navigation_mount'] = (id: string = 'root') => {
  mountId = id;

  ReactDOM.render(<App />, document.getElementById(id));
};

window['navigation_unmount'] = () => {
  if (mountId) {
    const mountNode = document.getElementById(mountId);
    if (mountNode) {
      ReactDOM.unmountComponentAtNode(mountNode);
    }
  }
};
