
(function () {
    // open web debugger console
    if (typeof VConsole !== 'undefined') {
      window.vConsole = new VConsole();
    }

    var debug = window._CCSettings.debug;
    var splash = document.getElementById('splash');
    splash.style.display = 'block';

    var isProd = window.location.href.indexOf('prod') >= 0 ? true : false;

    const NDBLoadRemoteCocos = function() {
        let ndb = window.NDB;
        let cocosUrl = 'https://a.fslk.co/games/zips/staging/cocos2d-min-js-2.4.8-no3d.zip.gz'
        if(isProd) {
          cocosUrl = 'https://a.fslk.co/games/zips/staging/cocos2d-min-js-2.4.8-no3d.zip.gz'
        }
        ndb.isGameSourceExisted(cocosUrl).then((obj) => {
          console.log('请求cocos源码===>obj is ',obj);
        });
    }

    NDBLoadRemoteCocos();

    function loadScript(moduleName, cb) {
      console.time('loadCocos');
      function scriptLoaded() {
        console.timeEnd('loadCocos');
        document.body.removeChild(domScript);
        domScript.removeEventListener('load', scriptLoaded, false);
        cb && cb();
      };
      var domScript = document.createElement('script');
      domScript.async = true;
      domScript.src = moduleName;
      
      domScript.addEventListener('load', scriptLoaded, false);
      document.body.appendChild(domScript);
    }

    loadScript(debug ? 'cocos2d-js.js' : 'https://a.fslk.co/games/cocos2d-min-js-2.4.8-no3d.js', function () {
      if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
        loadScript(debug ? 'physics.js' : 'physics-min.js', window.boot);
      }
      else {
        window.boot();
      }
    });
    
})();