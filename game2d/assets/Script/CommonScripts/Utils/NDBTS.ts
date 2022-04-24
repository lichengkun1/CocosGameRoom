/*
JSBridge功能参数
函数名  | 参数 | 函数描述
------------- | -------------| -------------
openProfile  | userId | 打开用户详情页
openTagDetail  | tagId，tagTitle| 打开tag详情页
openFeed  | feedId| 打开feed
openComment  | feedId| 打开feed评论页
showBanner  | slide 多张防止跟随滑动 | 显示banner (alaska无)
hideBanner  | | 隐藏banner (alaska无)
sendEvent  | JSONObject params| 发送事件
shareApk  | apkName| 分享apk
shareText  | shareText| 分享文字
shareMediaText  | shareText,imgUrl| 分享文字和图片
shareFile  | shareText, filePath(本地文件路径，不需要加file://) | 分享文件
mediaToLocal  | imageUrl,videoUrl| 图片/视频 网络地址转本地地址
base64ToLocal  | base64Url| 图片Base64转本地地址
takeScreenShot  | 同newsDog| 截图 （发送屏幕坐标和宽高，返回图片本地地址）
getUserInfo  | avatar, userName | 用户名，头像
getGroupId  | userId| 用户ID（ObjectId，seq_id） (alaska无)
getUserGroup  | group | 用户Group (alaska无)
getUserLang  | lang| 语言
openWebView  | url| 打开一个新的全屏WebView
closeWebView  | | 关闭当前WebView
backPressed  | feedId| 客户端主动发送后退事件
clickPostBtn  | | 点击发布按钮,togo专有
clickPostText  | | 点击发布文字按钮,togo专有
clickPostImage  | | 点击发布图片按钮,togo专有
clickPostPhoto  | | 点击发布拍照按钮,togo专有
clickPostAudio | | 点击发布语音按钮,togo专有

/====alaska====/
clickPostStatusMaker | | 点击发布制作影集
clickPostVideo | | 点击发布视频
openTopic | topicId | 打开主题活动页面

/====newsdog====/
openFeed  | feedId,type,lang | 跳转到某个article
openCategory | cate_key,video | 跳转到某个分类
openTopic | feedId,lang | 跳转到某个topic
openDeepLink |{link:'newsdog://detail?id=5a16594712313a00a34109d1&lang=en&type=article'}|跳转到某个DEEPLINK
openHttpLink |{link: 'http://xxx'}|使用NewsDog打开某个支持的HTTP链接

/====wangcai====/
enterChatRoom | roomId,where | 从where进入roomId聊天室,
openDeepLink |{link:''}|跳转到某个DEEPLINK
openTab | tab |


*/
// import MessageManager from '../Utils/MessageManager';
// import MessageSoundManager from '../Utils/MessageSoundManager';
// import MKEventDispatch from './MKEventDispatch';

import MyEvent from "./MyEvent";
import MessageManager from "./MessageManager";
import MessageSoundManager from "./MessageSoundManager";
import MessageData, { GameType } from "./MessageData";
import { GameConfig } from "../../../gameConfig";


interface IAction {
  method: string;
  params?: {
    [p: string]: any;
  };
}

declare global {
  interface Window {
    gtag?: (e: any) => void;
    WKWVJBCallbacks?: any[];
    WKWebViewJavascriptBridge?: any;
    webkit?: any;
    NDB?: any;
    webview?: any;
    AndroidJsConnector?: any;
  }
}

class AndroidBackEvent {
  private list: any[];
  constructor() {
    this.list = [];
  }
  addEventListener(audience) {
    this.list.push(audience);
  }
  removeEventListener(audience) {
    // console.log(audience);
    // console.log(JSON.stringify(this.list));
    // this.list.forEach(fn=>{
    //   console.log(fn,audience,fn.toString() == audience.toString());
    // })
    this.list = this.list.filter(fn => fn.toString() != audience.toString());
    // console.log(this.list);
  }
  broadcast() {
    console.log(this.list);
    this.list.forEach(fn => {
      fn && fn();
    });
    return !!this.list.length;
  }
}

class NdogJsBridge {
  ALICE: string;
  platform: string;
  PROTOCOL: string;
  pool: any;
  sequenceId: number;
  gameIsStart: boolean = false;
  startTime: number;
  report: () => void;
  sleep: (ms: number) => Promise<any>;

  constructor(alice, platform) {
    this.ALICE = alice;
    this.platform = platform;
    this.PROTOCOL = 'NDB';
    this.pool = {};
    this.sequenceId = 0;
    this.report = function () {
      // if (process.env.NODE_ENV == 'production') {
      if (!window.gtag) return;
      window.gtag.apply(null, arguments);
      console.log('=======report=======');
      const galog = [];
      const len = arguments.length;
      for (let i = 0; i < len; i++) {
        galog.push(arguments[i]);
      }
      console.log(JSON.stringify(galog));
      console.log('=======report=======');
      // }
    };
    this.sleep = ms => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    };

    if (this.platform == 'ios') {
      this.setupWKWebViewJavascriptBridge((bridge) => {
        bridge.registerHandler('onSocketReceive', this.onSocketReceive);
        bridge.registerHandler('onAndroidGoBack', this.onAndroidGoBack);
        bridge.registerHandler('onAndroidReload', this.onAndroidReload);
        bridge.registerHandler('onAndroidResume', this.onAndroidResume);
        bridge.registerHandler('onAndroidStop', this.onAndroidStop);
        bridge.registerHandler('onDownloadFinish', this.onDownloadFinish);
        bridge.registerHandler('onDownloadProgress', this.onDownloadProgress);
        bridge.registerHandler('onDownloadFailed', this.onDownloadFailed);
        bridge.registerHandler('replayBgMusic', this.replayBgMusic);
        // bridge.registerHandler('setEngineSwitch', this.setEngineSwitch);
      })
    }

    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    // 进入h5打点
    if (this.platform !== 'unknown') {
      console.log('request is ',this.request);
      this.startTime = new Date().getTime();
      let gameType = this.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
      let obj = {
        eventName: "game_enter",
        
        name: `${GameConfig.gameName}${gameType}`,
      }

      const isDebug = this.getUrlIsDebug();
      console.log('isDebug ',isDebug);
      const url = isDebug ? 'http://ldy_game-http.gateway.funshareapp.com/v1/base/bug/trace' : 'https://game.funshareapp.com/v1/base/bug/trace';
      console.log('url is ',url);
      this.sendAutoJoinEvent(obj);
    } else {
      const isDebug = this.getUrlIsDebug();
      const url = isDebug ? 'http://ldy_game-http.gateway.funshareapp.com/v1/base/bug/trace' : 'https://game.funshareapp.com/v1/base/bug/trace';
      
      this.request('post',url,{
         game: 'dominoe',
         error: 'unknown platform',
         error_msg: 'unknown platform'
       }).then((result) => {
         console.log('result is ',result);
         if(!result) return;
         if(result.err_code === '500') {
           console.log('请求错误');
         } else if(result['status'] && result['status']=== 'OK'){
           console.log('请求成功');
         }
       })
     }
    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    /*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  }
  getUrlParameterValue(name) {
    let href = window.location.href;
    var query = href.substring(1);
    var vars = query.split("?");
    if (!vars[1]) {
      return '';
    }
    var argment = vars[1].split("&");
    for (var i = 0; i < argment.length; i++) {
      var pair = argment[i].split("=");
      if (pair[0] == name) { return pair[1]; }
    }
    return '';
  }

  getUrlIsDebug(): boolean {
    const href = window.location.href;
    return href.indexOf('/staging/web-mobile') >= 0;
  }

  /**
   * 生成android解析协议
   */
  generateRequestObj = (method, params = {}) => {
    const port = this.sequenceId++;
    return {
      uri: `${this.PROTOCOL}://${this.ALICE}:${port}/${method}?${JSON.stringify(params)}`,
      port,
    };
  };

  /**
   * 通过window.prompt将参数传递给客户端,并等待回调
   * @nativeMethodName {String} 客户端响应的函数名(提前人工约定)
   * @params {Object} 需要传递的参数
   */
  run: (m: string, p?: object) => Promise<{ err_code?: string; msg?: string }> = (
    nativeMethodName,
    params,
  ) => {
    const { uri, port } = this.generateRequestObj(nativeMethodName, params);
    console.log('==> nativeMethodName is ',nativeMethodName,' and param is ',params);
    console.log('%c >> request:' + port, 'color:blue', uri);
    return new Promise(resolve => {
      this.pool[port] = resolve;
      if (this.platform === 'android') {
        //通过prompt将消息传递给android；
        window.prompt(uri, '');
      } else if (this.platform === 'ios') {
        this.setupWKWebViewJavascriptBridge(bridge => {
          bridge.callHandler('handleIOSJsBridge', { url: uri }, response => {
            // IOS  端的回调函数
            console.log('IOS back data: ', response);
            const { port, ...res } = response;
            this.onFinish(port, res);
          });
        });
      } else {
        if(params['eventName'] === 'game_enter') {
          const url = 'https://game.funshareapp.com/v1/base/bug/trace';
          this.request('post',url,{
            game: 'dominoe',
            error: 'unknown platform',
            error_msg: 'unknown platform'
          }).then((result) => {
            console.log('result is ',result);
            if(!result) return;
            if(result.err_code === '500') {
              console.log('请求错误');
            } else if(result['status'] && result['status']=== 'OK') {
              console.log('请求成功');
            }
          })
        }
        throw new Error(JSON.stringify(this.platform));
      }
    }).catch(e => {
      console.error(e);
      console.error(`jsbridge method fail: ${JSON.stringify({ uri, port })}`);
      if(params['eventName'] === 'game_enter') {
        const url =  'https://game.funshareapp.com/v1/base/bug/trace';
      
        this.request('post',url,{
          game: 'dominoe',
          error: 'jsbridge method fail jsb 方法调用错误' + `platform: ${this.platform}`,
          error_msg: 'jsbridge method fail jsb 方法调用错误'
        }).then((result) => {
          console.log('result is ',result);
          if(!result) return;
          if(result.err_code === '500') {
            console.log('请求错误');
          } else if(result['status'] && result['status']=== 'OK') {
            console.log('请求成功');
          }
        })
      }
      throw new Error(`jsbridge method fail: ${JSON.stringify({ uri, port })}`);
    });
  };

  /**
   * jsbridge 调用ios
   * @memberof NdogJsBridge
   */
  setupWKWebViewJavascriptBridge = callback => {
    if (window.WKWebViewJavascriptBridge) {
      // eslint-disable-next-line
      return callback(window.WKWebViewJavascriptBridge);
    }
    if (window.WKWVJBCallbacks) {
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
  onFinish = (port, res) => {
    console.log('%c << response:' + port, 'color:green', res);
    const resolve = this.pool[port];
    resolve && resolve(res);
    delete this.pool[port];
  };
  /**
   * 发送网络请求
   * @method {String} get,post,put,del
   * @url {String} 请求urlsetEngineSwitch1
   * @params {Object} 发送参数
   */
  request = async (method, url, params) => {
    console.log('url:' + url);
    try {
      const result = await this.run(method, { url, params });
      console.log('-------->>>>>', result);
      if (result.err_code || result.msg) {
        console.log(result);
        // this.toast({msg: result.msg})
        // return false
      }
      return result;
    } catch (e) {
      console.log('0000000', e);
    }
  };

  closeWebView = () => {
    this.run('closeWebView');
  }

  //分享图片;
  shareGameOrImage = async (shareText, imgurl) => {
    try {
      const result = await this.run('shareMediaText', { shareText: shareText, imgUrl: imgurl, is_room: true });
      console.log('-------->>>>>', result);
      if (result.err_code || result.msg) {
        console.log(result);
      }
      return result;
    } catch (e) {
      console.log('0000000', e);
    }
  }

  getRoomInfo = async () => {
    const result = await this.run('getRoomInfo');
    console.log('-------->>>>>getRoomInfo', result);
    if (result.err_code || result.msg) {
      console.log(result);
    }
    return result;
  }


  getUserInfo = async () => {
    const result = await this.run('getUserInfo');
    console.log('-------->>>>>getUserInfo', result);
    if (result.err_code || result.msg) {
      console.log(result);
    }
    return result;
  }

  //显示表情；
  showEmoji = (pos, size, svga) => {
    console.log('收到服务器广播svga is ',svga);
    this.run('playSvga', { x: pos[0], y: pos[1], w: size[0], h: size[1], url: svga });
  }

  //与客户端的交互；
  gameRoom = async (functionName, typeName, gameName, emojiSvga?) => {
    const result = await this.run('gameRoom', { func: functionName, type: typeName, game: gameName, data: emojiSvga });
    console.log('-------->>>>>gameRoom', result);
    if (result.err_code || result.msg) {
      console.log(result);
    }
    return result;
  }


  //设置音效开关;
  // setEngineSwitch = (flag) => {
  //   console.log('setEngineSwitch:' + flag);
  //   MessageSoundManager.audioEngineOn = flag;
  //   MessageSoundManager.updateMusic();
  // }

  showPlayerInfo = (playerId) => {
    /*
    openProfile
    {
    "user_id","242424",       //用户id;
    "where", "",              //log；
    "in_room",true/false      //是否是在聊天室内；
    }
    */
    console.log('发送显示用户：' + playerId);
    this.run('openProfile', { userId: playerId, where: GameConfig.gameName, in_room: true });
  }

  //截图分享;
  renderTextureShare = async () => {
    try {
      let wid = Math.floor(document.body.clientWidth) - 2;
      let heig = Math.floor(document.body.clientHeight) - 2;
      const result = await this.run('takeScreenShot', { image_coordinate: { x: 0, y: 0, w: wid, h: heig, r: 0 } });
      console.log('-------->>>>>', result);
      if (result.err_code || result.msg) {
        console.log(result);
      }
      return result;
    } catch (e) {
      console.log('0000000', e);
    }
  }


  /**
   * 弹出原生toast
   */
  toast = (opt = {}) => {
    const defaultOpt = {
      msg: '弹出Toast',
      long: true,
    };
    return this.run('toast', Object.assign(defaultOpt, opt));
  };

  openDeepLink = link => {
    console.log('link is ',link);
    this.run('openDeepLink', { link: link });
  };

  openWebView = url => {
    this.run('openWebView', { url: url });
  };

  sendEvent = sendObj => {
    this.run('sendEvent', { eventName: sendObj.eventName, eventParams: { type: sendObj.type, from: sendObj.from, result: sendObj.result, way: sendObj.way } });
  }


  sendAutoJoinEvent = sendObj => {
    console.log(this.startTime);
    this.run('sendEvent', {
      eventName: sendObj.eventName,
      eventParams: {
        type: sendObj.type, source: sendObj.source, is_match_auto: sendObj.is_match_auto, bets: sendObj.bets,
        status: sendObj.status, messageType: sendObj.messageType, time: sendObj.time, name: sendObj.name, result: sendObj.result, reason: sendObj.reason,mode:sendObj.mode,
      }
    });
  }

  /***********************************************APP调用游戏接口*******************************************************/


  isGameSourceExisted = async (_url) => {
    const result = await this.run('isGameSourceExisted', { url: _url });
    console.log('-------->>>>>isGameSourceExisted', result);
    if (result.err_code || result.msg) {
      console.log(result);
    }
    return result;
  }



  //下载完成；
  onDownloadFinish = (data) => {
    console.log('===========onDownloadFinish=============');
    MyEvent.I.emit('onDownloadFinish');
  }

  //当前zip下载进度;
  onDownloadProgress = (data) => {
    console.log('===========onDownloadProgress=============');
    MyEvent.I.emit('onDownloadProgress', { progress: data });
    console.log(data);
  }

  //下载zip失败;
  onDownloadFailed = (data) => {
    console.log('===========onDownloadFailed=============');
    MyEvent.I.emit('onDownloadFailed');
    console.log(data);
  }

  /**
   * 重新播放背景音乐
   */
  replayBgMusic = () => {
    console.log('replayMusic');

    console.log('id is ',MessageSoundManager.bgAudioId);
    // if(MessageSoundManager.bgAudioId !== -1) {
    //   /** 先暂停再恢复 */
    //   cc.audioEngine.pauseMusic();
    //   cc.audioEngine.resume(MessageSoundManager.bgAudioId);
    // }
    MyEvent.I.emit('replayMusic');
  }

  /**
   * app进入后台
   */
  onAndroidStop = () => {
    // MessageSoundManager.audioIsOn = MessageSoundManager.audioEngineOn;

    MessageSoundManager.audioEngineOn = false;
    MessageSoundManager.updateMusic();
    console.log(`webview onAndroidStop: app 进入后台`);
    MyEvent.I.emit('onAndroidStop');
  };
  /**
   * app重新进入前台
   */
  onAndroidResume = () => {
    // if (MessageSoundManager.audioEngineOn) {
    //   // MessageSoundManager.audioEngineOn = true;
    //   MessageSoundManager.updateMusic();
    //   if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
    //     cc.sys.__audioSupport.context.resume();
    //   }
    // }
    console.log(`webview resume: app 回到前台`);
    MyEvent.I.emit('onAndroidResume');
  };
  /*
    * 刷新webview
   */
  onAndroidReload = () => {
    // window.location.reload();
    console.log(`webview onAndroidReload`);
  };

  joinErrMessage = (data) => {
    console.log("joinErrMessage", data);
    MyEvent.I.emit('joinErrMessage', data);

  }
  /*
      响应android回退事件
      1. 如当前页面有弹窗, 先关弹窗
      2. 如 history.length > 1, 则回退到上一页
      3. 如果退无可退, 就直接关闭webview
      每次响应需要给客户端通知, 如果500ms内不回调客户端, 客户端会认为网页出现异常或者打开了第三方网页, 客户端会关闭当前webview
  */
  onAndroidGoBack = () => {
    if (this.gameIsStart) {
      this.run('backEnsure');
      const hasAudience = androidBackEvent.broadcast();
      console.log('androidBackEvent.broadcast: ', !hasAudience);
      if (!hasAudience) {
        console.log('onAndroidGoBack  onAndroidGoBack  onAndroidGoBack');
        MyEvent.I.emit('androidGoback');
      }
    }
  };

  /*
    * App收到服务器socket数据以后，转发给游戏;
    start:匹配到开始；
    roll：掷完骰子
    move:移动骰子
    skip：该掷骰子了
    leave：有人离开
    join：有人加入（断线重连了）
  */
  onSocketReceive = (data) => {
    // console.log('收到服务器下发消息-----------：');
    // console.log(data);
    //将消息发送给消息管理类;
    // setTimeout(()=>{
    MessageManager.emitSocketMessage(data);
    // },300);
  }

  /*****************************************************end********************************************************/

  /***********************************************游戏发送数据*******************************************************/

  /*
    * @param MessageType 消息号
    * @parm sendData 发送的数据(有可能没有参数)
  */
  socketSend(messageType: string, sendData?: any) {
    console.log('socketSend', messageType, sendData);
    window.prompt(messageType, '');

  }

  /***********************************************end*****************************************************/


}

const NDB = (() => {

  let platform = 'unknown';
  let alice = 'unknown';
  let webview;
  try {
    // eslint-disable-next-line
    if (window.AndroidJsConnector) {
      platform = 'android';
      // eslint-disable-next-line
      alice = window.AndroidJsConnector.getInjectName() || platform;
      // eslint-disable-next-line
    } else if (window.webkit && window.webkit.messageHandlers) {
      platform = 'ios';
      alice = 'messageHandlers';
    }
    console.log('platform',platform);
    // eslint-disable-next-line
    webview = new NdogJsBridge(alice, platform);
    window.NDB = webview;
    window.webview = true;
    console.log('now is in webview');
  } catch (e) {
    console.log(e);
    const webview = new NdogJsBridge(alice, platform);
    window.NDB = webview;
    window.webview = false;
    console.log('now is not in webview');
  }

  return webview;
})();

export default NDB;

export const androidBackEvent = new AndroidBackEvent();
