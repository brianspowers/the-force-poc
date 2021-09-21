(function () {
  'use strict';

  function p(){p=Object.assign||function(b){for(var e=1;e<arguments.length;e++){var f=arguments[e],m;for(m in f)Object.prototype.hasOwnProperty.call(f,m)&&(b[m]=f[m]);}return b};return p.apply(this,arguments)}var u,x=u||(u={});x.Pop="POP";x.Push="PUSH";x.Replace="REPLACE";var A=function(b){return Object.freeze(b)};function B(b,e){if(!b){"undefined"!==typeof console&&console.warn(e);try{throw Error(e);}catch(f){}}}
  function C(b){b.preventDefault();b.returnValue="";}function G(){var b=[];return {get length(){return b.length},push:function(e){b.push(e);return function(){b=b.filter(function(f){return f!==e});}},call:function(e){b.forEach(function(f){return f&&f(e)});}}}
  var H=function(b){function e(){var a=q.location,c=r.state||{};return [c.idx,A({pathname:a.pathname,search:a.search,hash:a.hash,state:c.usr||null,key:c.key||"default"})]}function f(a){if("string"===typeof a)var c=a;else {c=a.pathname;var h=a.search;a=a.hash;c=(void 0===c?"/":c)+(void 0===h?"":h)+(void 0===a?"":a);}return c}function m(a,c){void 0===c&&(c=null);var h=p,k=v;if("string"===typeof a){var d={};if(a){var g=a.indexOf("#");0<=g&&(d.hash=a.substr(g),a=a.substr(0,g));g=a.indexOf("?");0<=g&&(d.search=
  a.substr(g),a=a.substr(0,g));a&&(d.pathname=a);}a=d;}return A(h({},k,a,{state:c,key:Math.random().toString(36).substr(2,8)}))}function y(a){z=a;a=e();n=a[0];v=a[1];D.call({action:z,location:v});}function E(a,c){function h(){E(a,c);}var k=u.Push,d=m(a,c);if(!l.length||(l.call({action:k,location:d,retry:h}),!1)){var g=[{usr:d.state,key:d.key,idx:n+1},f(d)];d=g[0];g=g[1];try{r.pushState(d,"",g);}catch(I){q.location.assign(g);}y(k);}}function F(a,c){function h(){F(a,c);}var k=u.Replace,d=m(a,c);l.length&&(l.call({action:k,
  location:d,retry:h}),1)||(d=[{usr:d.state,key:d.key,idx:n},f(d)],r.replaceState(d[0],"",d[1]),y(k));}function t(a){r.go(a);}void 0===b&&(b={});b=b.window;var q=void 0===b?document.defaultView:b,r=q.history,w=null;q.addEventListener("popstate",function(){if(w)l.call(w),w=null;else {var a=u.Pop,c=e(),h=c[0];c=c[1];if(l.length)if(null!=h){var k=n-h;k&&(w={action:a,location:c,retry:function(){t(-1*k);}},t(k));}else B(!1,"You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");else y(a);}});var z=u.Pop;b=e();var n=b[0],v=b[1],D=G(),l=G();null==n&&(n=0,r.replaceState(p({},r.state,{idx:n}),""));return {get action(){return z},get location(){return v},createHref:f,push:E,replace:F,go:t,back:function(){t(-1);},forward:function(){t(1);},listen:function(a){return D.push(a)},block:function(a){var c=l.push(a);1===l.length&&q.addEventListener("beforeunload",C);return function(){c();l.length||q.removeEventListener("beforeunload",C);}}}}();var history = H;

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
  history.listen(({ location, action }) => {
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

}());
//# sourceMappingURL=bundle.js.map
