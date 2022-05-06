
(function () {
    // open web debugger console
    if (typeof VConsole !== 'undefined') {
      window.vConsole = new VConsole();
    }

    var debug = window._CCSettings.debug;
    var splash = document.getElementById('splash');
    splash.style.display = 'block';

    function loadScript(moduleName, cb) {
      function scriptLoaded() {
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

    //获取页面参数值;
    function getUrlParameterValue(name) {
      let href = window.location.href;
      var query = href.substring(1);
      var vars = query.split("?");
      if (!vars[1]) {
        return '';
      }
      var argment = vars[1].split("&");;
      for (var i = 0; i < argment.length; i++) {
        var pair = argment[i].split("=");
        if (pair[0] == name) { return pair[1]; }
      }
      return '';
    }
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;   //判断是否是 android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);     //判断是否是 iOS终端
    var vCode = Number(getUrlParameterValue('vcode'));
    var loadJs = "cocos2d-js-" + "min.js";

    var isProd = window.location.href.indexOf('prod') >= 0 ? true : false;

    const NDBLoadRemoteCocos = function() {
        let ndb = window.NDB;
        let cocosUrl = 'http://a.fslk.co/games/cocos-source-no3d/staging/web-mobile/cocos2d-min-js-2.4.8-no3d.js.zip'
        if(isProd) {
          cocosUrl = 'http://a.fslk.co/games/cocos-source-no3d/staging/web-mobile/cocos2d-min-js-2.4.8-no3d.js.zip'
        }
        ndb.isGameSourceExisted(cocosUrl);
    }

    loadScript(debug ? 'cocos2d-js.js' : 'cocos2d-min-js-v2.4.8.js', function () {
      if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
        loadScript(debug ? 'physics.js' : 'physics-min.js', window.boot);
      }
      else {
        window.boot();
      }
    });
})();