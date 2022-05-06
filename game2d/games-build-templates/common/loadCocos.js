
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
        ndb.isGameSourceExisted(cocosUrl);
    }

    NDBLoadRemoteCocos();
    
})();