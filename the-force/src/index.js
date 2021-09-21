import history from 'history/browser';

let activeApp = undefined;

const appMap = {
  'installed-sales': {
    js: [
      'runtime-main.a1a61d01.js',
      '2.afa3e485.chunk.js',
      'main.a83b907e.chunk.js'
      ],
  },
  navigation: {
    js: [
      'runtime-main.32c0f70e.js',
      '2.be065043.chunk.js',
      'main.d912c462.chunk.js'
      ],
  },
  'sales-order-entry': { js: ['index.f7472fd9.js'], esm: true },
  'system-admin': {
    js: [
      'runtime-main.8c5007d9.js',
      '2.9483f429.chunk.js',
      'main.c8c662e8.chunk.js'
      ],
  },
};

function addScript(src, callback, module) {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  if (module) {
    s.setAttribute('type', 'module');
  }
  s.onload = callback;
  document.body.appendChild(s);
}

function getAppForPath(pathName) {
  const [, appName] = pathName.split('/');
  return appName;
}

function handleUrlChange(url) {
  console.log('Url change', url, getAppForPath(url));
  const app = getAppForPath(url);

  if (app && appMap[app]) {
    if (activeApp && app !== activeApp) {
      // Unmount current app
      window[`${activeApp}_unmount`]('content');
      activeApp = undefined;
    }
    if (app === activeApp) {
      return;
    }
    if (!appMap[app].status) {
      appMap[app].status = 'LOADING';
      const appScriptLoads = [];
      for (const js of appMap[app].js) {
        const callback = new Promise((resolve) => {
          addScript(`/bundles/${app}/${js}`, resolve, appMap[app].esm);
        });
        appScriptLoads.push(callback);
      }
      Promise.all(appScriptLoads).then(() => {
        appMap[app].status = 'LOADED';
        window[`${app}_mount`]('content');
        activeApp = app;
      });
    } else if (appMap[app].status === 'LOADED') {
      window[`${app}_mount`]('content');
    }
  }
}

// Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
  handleUrlChange(location.pathname);
});

window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, argArray) => {
    handleUrlChange(argArray[2]);
    return target.apply(thisArg, argArray);
  },
});

window.history.replaceState = new Proxy(window.history.replaceState, {
  apply: (target, thisArg, argArray) => {
    handleUrlChange(argArray[2]);
    return target.apply(thisArg, argArray);
  },
});

// Add navigation
const navScriptLoads = [];
for (const js of appMap.navigation.js) {
  const callback = new Promise((resolve) => {
    addScript(`/bundles/navigation/${js}`, resolve);
  });
  navScriptLoads.push(callback);
}

Promise.all(navScriptLoads).then(() => {
  window.navigation_mount('nav');
});

const initialLocation = history.location;
handleUrlChange(initialLocation.pathname);
