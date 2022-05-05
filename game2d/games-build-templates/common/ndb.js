var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
        t[p[i]] = s[p[i]];
    return t;
  };
//   define(["require", "exports"], function (require, exports) {
//     "use strict";
//     Object.defineProperty(exports, "__esModule", { value: true });
//     var AndroidBackEvent = /** @class */ (function () {
//       function AndroidBackEvent() {
//         this.list = [];
//       }
//       AndroidBackEvent.prototype.addEventListener = function (audience) {
//         this.list.push(audience);
//       };
//       AndroidBackEvent.prototype.removeEventListener = function (audience) {
//         // console.log(audience);
//         // console.log(JSON.stringify(this.list));
//         // this.list.forEach(fn=>{
//         //   console.log(fn,audience,fn.toString() == audience.toString());
//         // })
//         this.list = this.list.filter(function (fn) { return fn.toString() != audience.toString(); });
//         // console.log(this.list);
//       };
//       AndroidBackEvent.prototype.broadcast = function () {
//         console.log(this.list);
//         this.list.forEach(function (fn) {
//           fn && fn();
//         });
//         return !!this.list.length;
//       };
//       return AndroidBackEvent;
//     }());
    var NdogJsBridge2 = /** @class */ (function () {
      function NdogJsBridge2(alice, platform) {
        var _this = this;
        this.gameIsStart = false;
        /**
         * 生成android解析协议
         */
        this.generateRequestObj = function (method, params) {
          if (params === void 0) { params = {}; }
          var port = _this.sequenceId++;
          return {
            uri: _this.PROTOCOL + "://" + _this.ALICE + ":" + port + "/" + method + "?" + JSON.stringify(params),
            port: port,
          };
        };
        /**
         * 通过window.prompt将参数传递给客户端,并等待回调
         * @nativeMethodName {String} 客户端响应的函数名(提前人工约定)
         * @params {Object} 需要传递的参数
         */
        this.run = function (nativeMethodName, params) {
          var _a = _this.generateRequestObj(nativeMethodName, params), uri = _a.uri, port = _a.port;
          console.log('==> nativeMethodName is ', nativeMethodName, ' and param is ', params);
          console.log('%c >> request:' + port, 'color:blue', uri);
          return new Promise(function (resolve) {
            _this.pool[port] = resolve;
            if (_this.platform === 'android') {
              //通过prompt将消息传递给android；
              window.prompt(uri, '');
            }
            else if (_this.platform === 'ios') {
              _this.setupWKWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('handleIOSJsBridge', { url: uri }, function (response) {
                  // IOS  端的回调函数
                  console.log('IOS back data: ', response);
                  var port = response.port, res = __rest(response, ["port"]);
                  _this.onFinish(port, res);
                });
              });
            }
          });
        };
        /**
         * jsbridge 调用ios
         * @memberof NdogJsBridge
         */
        this.setupWKWebViewJavascriptBridge = function (callback) {
          if (window.WKWebViewJavascriptBridge) {
            console.log('asd ', window.WKWebViewJavascriptBridge);
            // eslint-disable-next-line
            return callback(window.WKWebViewJavascriptBridge);
          }
          if (window.WKWVJBCallbacks) {
            console.log('WKWVJB asd..', window.WKWVJBCallbacks);
            return window.WKWVJBCallbacks.push(callback);
          }
          window.WKWVJBCallbacks = [callback];
          window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
        };
        /**
         * 供客户端回调
         * @port {Number} 当前回调池中的key, 对应一个回调函数
         * @res {Object} 客户端的处理结果, 一般是json格式
         */
        this.onFinish = function (port, res) {
          console.log('%c << response:' + port, 'color:green', res);
          var resolve = _this.pool[port];
          resolve && resolve(res);
          delete _this.pool[port];
        };
        /**
         * 发送网络请求
         * @param  {string} method get,post,put,del 请求方式
         * @param  {string} url 请求地址
         * @param  {Object} params 请求参数
         */
        this.request = function (method, url, params) {
          return __awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  console.log('url:' + url);
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 3, , 4]);
                  return [4 /*yield*/, this.run(method, { url: url, params: params })];
                case 2:
                  result = _a.sent();
                  console.log('-------->>>>>', result);
                  if (result.err_code || result.msg) {
                    console.log(result);
                  }
                  return [2 /*return*/, result];
                case 3:
                  e_1 = _a.sent();
                  console.log('0000000', e_1);
                  return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
              }
            });
          });
        };
        this.closeWebView = function () {
          _this.run('closeWebView');
        };
        this.getRoomInfo = function () {
          return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0: return [4 /*yield*/, this.run('getRoomInfo')];
                case 1:
                  result = _a.sent();
                  console.log('-------->>>>>getRoomInfo', result);
                  if (result.err_code || result.msg) {
                    console.log(result);
                  }
                  return [2 /*return*/, result];
              }
            });
          });
        };
        this.getUserInfo = function () {
          return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0: return [4 /*yield*/, this.run('getUserInfo')];
                case 1:
                  result = _a.sent();
                  console.log('-------->>>>>getUserInfo', result);
                  if (result.err_code || result.msg) {
                    console.log(result);
                  }
                  return [2 /*return*/, result];
              }
            });
          });
        };
        //显示表情；
        this.showEmoji = function (pos, size, svga) {
          console.log('收到服务器广播svga is ', svga);
          _this.run('playSvga', { x: pos[0], y: pos[1], w: size[0], h: size[1], url: svga });
        };
        //与客户端的交互；
        this.gameRoom = function (functionName, typeName, gameName, emojiSvga) {
          return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0: return [4 /*yield*/, this.run('gameRoom', { func: functionName, type: typeName, game: gameName, data: emojiSvga })];
                case 1:
                  result = _a.sent();
                  console.log('-------->>>>>gameRoom', result);
                  if (result.err_code || result.msg) {
                    console.log(result);
                  }
                  return [2 /*return*/, result];
              }
            });
          });
        };
        /**
         * 弹出原生toast
         */
        this.toast = function (opt) {
          if (opt === void 0) { opt = {}; }
          var defaultOpt = {
            msg: '弹出Toast',
            long: true,
          };
          return _this.run('toast', Object.assign(defaultOpt, opt));
        };
        this.openDeepLink = function (link) {
          console.log('link is ', link);
          _this.run('openDeepLink', { link: link });
        };
        this.openWebView = function (url) {
          _this.run('openWebView', { url: url });
        };
        this.sendEvent = function (sendObj) {
          _this.run('sendEvent', { eventName: sendObj.eventName, eventParams: { type: sendObj.type, from: sendObj.from, result: sendObj.result, way: sendObj.way } });
        };
        this.sendAutoJoinEvent = function (sendObj) {
          console.log(_this.startTime);
          _this.run('sendEvent', {
            eventName: sendObj.eventName,
            eventParams: {
              type: sendObj.type, source: sendObj.source, is_match_auto: sendObj.is_match_auto, bets: sendObj.bets,
              status: sendObj.status, messageType: sendObj.messageType, time: sendObj.time, name: sendObj.name, result: sendObj.result, reason: sendObj.reason, mode: sendObj.mode,
            }
          });
        };
        /***********************************************APP调用游戏接口*******************************************************/
        this.isGameSourceExisted = function (_url) {
          return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0: return [4 /*yield*/, this.run('isGameSourceExisted', { url: _url })];
                case 1:
                  result = _a.sent();
                  console.log('-------->>>>>isGameSourceExisted', result);
                  if (result.err_code || result.msg) {
                    console.log(result);
                  }
                  return [2 /*return*/, result];
              }
            });
          });
        };
        //下载完成；
        this.onDownloadFinish = function (data) {
          console.log('===========onDownloadFinish=============');
          setTimeout(() => {
            // eventManager.emit('onDownloadFinish');
            var isProd = window.location.href.indexOf('prod') >= 0 ? true : false;
  
            let cocosUrl = 'http://a.fslk.co/games/cocos-source-no3d/staging/web-mobile/cocos2d-min-js-2.4.8-no3d.js.zip';
            if(isProd) {
              cocosUrl = 'http://a.fslk.co/games/cocos-source-no3d/staging/web-mobile/cocos2d-min-js-2.4.8-no3d.js.zip';
            }
  
            let xhr = new XMLHttpRequest();
            xhr.open('GET',cocosUrl,true);
            xhr.responseType = "blob";
            xhr.setRequestHeader("Range",385 * 1024);
            xhr.onreadystatechange = function() {
              if(xhr.readyState === 4 && xhr.status >= 200) {
                  let res = xhr.response;
                  // const jszip = require('jszip.f3da3');
                  var zip = new JSZip();
                  zip.loadAsync(res).then(async (z) => {
                      let fileName = 'cocos2d-min-js-2.4.8-no3d.js';
                      let cocosStr = await z.file(fileName).async('string');
                      var domScript = document.createElement('script');
  
                      function scriptLoaded() {
                          document.body.removeChild(domScript);
                          domScript.removeEventListener('load', scriptLoaded, false);
                          cb && cb();
  
                      };
                      domScript.async = true;
                      domScript.text = cocosStr;
                      domScript.addEventListener('load', scriptLoaded, false);
                      document.body.appendChild(domScript);
                      console.log('开始执行main.9d234.js');
                      window.boot && window.boot();
                  });
              }
            }

            xhr.onprogress = function(target,progressEvent) {
              console.log(`加载进度： ${target.loaded / target.total}`);
            } 

            xhr.onload = function() {
              console.log('onload xhr is 脚本加载完成');
            }

            xhr.onerror = function(target,event) {
              console.log('error event is 加载脚本出错');
            }

            xhr.send();
          },10);
        };
        //当前zip下载进度;
        this.onDownloadProgress = function (data) {
          console.log('===========onDownloadProgress=============');
          // eventManager.emit('onDownloadProgress', { progress: data });
          console.log(data);
        };
        //下载zip失败;
        this.onDownloadFailed = function (data) {
          console.log('===========onDownloadFailed=============');
          // eventManager.emit('onDownloadFailed');
          console.log(data);
        };
        this.joinErrMessage = function (data) {
          console.log("joinErrMessage", data);
          // eventManager.emit('joinErrMessage', data);
        };
        this.ALICE = alice;
        this.platform = platform;
        this.PROTOCOL = 'NDB';
        this.pool = {};
        this.sequenceId = 0;
        this.report = function () {
          // if (process.env.NODE_ENV == 'production') {
          if (!window.gtag)
            return;
          window.gtag.apply(null, arguments);
          console.log('=======report=======');
          var galog = [];
          var len = arguments.length;
          for (var i = 0; i < len; i++) {
            galog.push(arguments[i]);
          }
          console.log(JSON.stringify(galog));
          console.log('=======report=======');
          // }
        };
        this.sleep = function (ms) {
          return new Promise(function (resolve, reject) {
            setTimeout(resolve, ms, 'done');
          });
        };
        console.log('开始注册ios消息', this.platform);
        if (this.platform == 'ios') {
          console.log('ios消息注册过程');
          this.setupWKWebViewJavascriptBridge(function (bridge) {
            console.log('bridge is ', bridge);
            bridge.registerHandler('onDownloadFinish', _this.onDownloadFinish);
            bridge.registerHandler('onDownloadProgress', _this.onDownloadProgress);
            bridge.registerHandler('onDownloadFailed', _this.onDownloadFailed);
            // bridge.registerHandler('setEngineSwitch', this.setEngineSwitch);
          });
        }
      }
      return NdogJsBridge2;
    }());
    var NDB = (function () {
      var platform = 'unknown';
      var alice = 'unknown';
      var webview = null;
      try {
        // eslint-disable-next-line
        if (window.AndroidJsConnector) {
          platform = 'android';
          // eslint-disable-next-line
          alice = window.AndroidJsConnector.getInjectName() || platform;
          // eslint-disable-next-line
        }
        else if (window.webkit && window.webkit.messageHandlers) {
          platform = 'ios';
          alice = 'messageHandlers';
        }
        console.log('platform', platform);
        // eslint-disable-next-line
        webview = new NdogJsBridge2(alice, platform);
        window.NDB = webview;
        window.webview = true;
        console.log('now is in webview');
      }
      catch (e) {
        console.log(e);
        var webview_1 = new NdogJsBridge2(alice, platform);
        window.NDB = webview_1;
        window.webview = false;
        console.log('now is not in webview');
      }
      return webview;
    })();
//   });
