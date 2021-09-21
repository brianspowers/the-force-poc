import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

declare global {
  interface Window {
    'system-admin_mount': any;
    'system-admin_unmount': any;
  }
}

let mountId: string | undefined = undefined;

window['system-admin_mount'] = (id: string = 'root') => {
  mountId = id;

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById(id)
  );
};

window['system-admin_unmount'] = () => {
  if (mountId) {
    const mountNode = document.getElementById(mountId);
    if (mountNode) {
      ReactDOM.unmountComponentAtNode(mountNode);
    }
  }
};
