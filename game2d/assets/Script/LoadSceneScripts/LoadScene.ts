
import { GameConfig } from "../../gameConfig";
import { resourceManager } from "../common/managers/resourceManager";
import { debugLog, getUrlParameterValue } from "../common/utils/util";
import MathcResData from "../CommonScripts/MatchSceneScripts/MatchResData";
import MessageData, { GameType } from "../CommonScripts/Utils/MessageData";
import MessageManager from "../CommonScripts/Utils/MessageManager";
import MessageType from "../CommonScripts/Utils/MessageType";
import MyEvent from "../CommonScripts/Utils/MyEvent";
import NDB from "../CommonScripts/Utils/NDBTS";
import FrameImageManager from "../FrameImageComponent/FrameImageManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadScene extends cc.Component {

    @property(cc.SpriteFrame)
    icons: cc.SpriteFrame[] = [];

    private proLabel: cc.Label = null;
    private gameName: cc.Label = null;
    private progressBar: cc.ProgressBar = null;
    private versionLabel: cc.Node = null;
    private coinType: cc.Sprite = null;

    /** 是否切换到匹配场景 */
    public isGotoMatchScene = true;

    private isChange: boolean = false;
    private progressLabelIsShow: boolean = false;
    private gameSceneIsLoad = false;
    private matchSceneIsLoad = false;
    private matchingResIsLoad = false;
    private lastnum1 = 0;
    private lastnum2 = 0;
    private lastnum3 = 0;
    private changeSceneIndex = 0;
    /** 游戏资源bundle是否加载完毕 */
    private gameBundleIsLoadedOver = false;

    onLoad() {
        /** 开启动态合图 */
        console.log('开启动态合图');
        cc.dynamicAtlasManager.enabled = true;
        cc.macro.CLEANUP_IMAGE_CACHE = false;
        this.loadBundleByGameName();

        this.initNode();
        this.setMessageData();
        MessageManager.Init();
        this.setIcon();
        // this.setExtra();
        this.loadLanguage();
        FrameImageManager.Init();
        let vcode = getUrlParameterValue('vcode');
        console.log('vcode is ',vcode);

        // @ts-ignore
        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'ludo') {
            cc.find('Canvas/BG').active = true;
            MessageData.gameType = GameType.room;
        }
        // @ts-ignore
        if((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName === 'dominoe') {
            const bgNode = this.node.getChildByName('bg_dominoe');
            MessageData.gameType = GameType.room;
            bgNode.active = true;
        }
    }

    private async loadBundleByGameName() {
        resourceManager.loadBundle(GameConfig.gameName).then(() => {
            // 资源加载完毕
            this.gameBundleIsLoadedOver = true;
        });
    }

    private initNode() {
        this.proLabel = cc.find("Canvas/progressLabel").getComponent(cc.Label);
        this.gameName = cc.find("Canvas/gameNameLabel").getComponent(cc.Label);
        this.progressBar = cc.find("Canvas/ProgressBar").getComponent(cc.ProgressBar);
        this.versionLabel = cc.find("Canvas/versionLabel");
        this.coinType = cc.find("Canvas/loadicon").getComponent(cc.Sprite);
    }

    private setIcon() {
        for (let i = 0; i < this.icons.length; i++) {
            const element = this.icons[i];
            console.log(element.name);
            if (MessageData.gameName == element.name) {
                this.coinType.spriteFrame = this.icons[i];
                return;
            }
        }
    }

    private setExtra() {
        // let bet_type = MessageManager.getUrlParameterValue('bet_type');
        // bet_type = bet_type ? bet_type : "diamond";
        // let bet_limit = MessageManager.getUrlParameterValue('bet_limit');
        // bet_limit = bet_limit ? bet_limit : "200";
        // let player_count = MessageManager.getUrlParameterValue('player_count');
        // player_count = player_count ? player_count : "2";
        // if (MessageData.gameType == GameType.room) {
        //     player_count = "4"
        // }
        // MessageData.extra = { extra: `bet_type=${bet_type}&bet_limit=${bet_limit}&player_count=${player_count}` };
        // MessageData.player_number = player_count;
        // MessageData.bet_limit = Number(bet_limit);
        // if (bet_type == 'diamond')
        //     MessageData.game_coinType = GameCoinType.game_coin;
        // else
        //     MessageData.game_coinType = GameCoinType.coin;
    }

    private setMessageData() {
        MessageData.gameName = GameConfig.gameName;
        console.log('gameName is ',MessageData.gameName);
        this.gameName.string = MessageData.gameName;
        let is_lobby = MessageManager.getUrlParameterValue('is_lobby')
        if (is_lobby == "true") {
            MessageData.gameType = GameType.single;
        } else {
            MessageData.gameType = GameType.room;
        }

    }
    start() {

        const source = window.location.href;
        const isStaging = source.match('staging');
        if (isStaging && this.versionLabel) {
            this.versionLabel.active = true;
        }
        this.eventDispatchFunc();
        const vcode: number = Number(MessageManager.getUrlParameterValue('vcode'));
        const need_gzip: string = MessageManager.getUrlParameterValue('need_gzip');
        //版本号/安卓/need_gzip为true  || isStaging测试环境;

        if (((cc.sys.os === cc.sys.OS_ANDROID && vcode >= 15600) || (cc.sys.os == cc.sys.OS_IOS && vcode >= 13801)) && cc.sys.isBrowser && need_gzip === 'true') {
            console.log('<<<需要压缩版本');
            this.getZip();
        } else {
            console.log('<<<切换场景');
            this.changeScene(false);
            this.loadGameScene();
        }
    }

    private async getZip() {
        let source = window.location.href;
        let path = ''
        if (source.match('prod')) {
            path = 'prod';
        } else {
            path = 'staging';
        }
        let zipVCodeID = '';
        switch (MessageData.gameName) {
            case 'ludo':
                zipVCodeID = "v2.0.1";
                break;
            case 'dominoe':
                zipVCodeID = "06082027"
                break;
            default:
                break;
        }
        let url = '';
        if(MessageData.gameName === 'sf') {
            url = 'http://a.fslk.co/games/Bullfight/staging/BullFightZip03051532.zip';
        } else {
            url = `http://a.fslk.co/games/${MessageData.gameName}/${path}/${MessageData.gameName}${zipVCodeID}.zip`
            if(MessageData.gameName === 'dominoe') {
                url = `http://a.fslk.co/games/${MessageData.gameName}/${path}/${MessageData.gameName}${zipVCodeID}.zip`;
            } else {
                url = `http://a.fslk.co/games/zips/${path}/${MessageData.gameName}${zipVCodeID}.zip`
            }
        }

        let data = await NDB.isGameSourceExisted(url);
        console.log('data is ',data);
        if (data['isHave']) {
            this.changeScene(false);
            this.loadGameScene();
        }
    }

    //消息监听；
    private eventDispatchFunc() {
        //当前下载进度;
        MyEvent.I.on('onDownloadProgress', this.onDownloadProgress.bind(this), this.node);
        //下载完成；
        MyEvent.I.on('onDownloadFinish', this.onDownloadFinish.bind(this), this.node);
        //下载失败;
        MyEvent.I.on('onDownloadFailed', this.onDownloadFailed.bind(this), this.node);
        //socket消息；
        MyEvent.I.on(MessageType.MESSAGE_REQUEST_WS_STATUS, this.messageFunc.bind(this), this.node);
        MyEvent.I.on(MessageType.GROUP_INFO,this.groupInfoMessage.bind(this),this.node);
    }

    groupInfoMessage(): void {
        console.log("接收到groupInfo");
        MessageData.hasReceivedGroupInfo = true;
    }

    //socket消息；
    private messageFunc(mData) {
        const online: boolean = mData.data.data.online;
        if (online) {
            this.isChange = false;
            this.changeScene(false);
            this.loadGameScene();
        }
    }

    //当前下载进度;
    private onDownloadProgress(p: number) {
        this.showProgressLabelIsShow();
        let pro = Math.ceil(Number(p['progress']) * 0.5);
        this.changeSceneIndex = pro;
        console.log("onDownloadProgress:", pro, p);
    }

    //下载完成；
    private onDownloadFinish() {
        this.proLabel.string = '50%';
        this.loadGameScene();
        this.changeScene(true);
    }

    //下载失败；
    private onDownloadFailed() {
        this.showProgressLabelIsShow();
        this.loadGameScene();
        this.changeScene(false);
    }

    //切换场景;
    private changeScene(flag: boolean) {
        if (this.isChange) {
            return;
        }
        this.showProgressLabelIsShow();
        this.isChange = true;
        this.matchSceneIsLoad = true;
        // resourceManager.loadSceneInBundle('MatchScene','roomCommon',(completedCount, totalCount, item) => {
        //     console.log(`total is ${totalCount} completed is ${completedCount} item is `,item);
        //     let comple = Math.floor(completedCount / totalCount * 25);
        //     if (flag) {
        //         let lerp = comple - this.lastnum1;
        //         this.lastnum1 = comple;
        //         this.changeSceneIndex = this.changeSceneIndex + lerp;
        //     } else {
        //         let lerp = comple * 3 - this.lastnum1;
        //         this.lastnum1 = comple * 3;
        //         this.changeSceneIndex = this.changeSceneIndex + lerp;
        //     }
        //     if (comple == 25) {
        //         debugLog('加载匹配场景完成');
        //         this.matchSceneIsLoad = true;
        //     }

        // });
    }

    private async loadGameScene() {
        if(!this.gameBundleIsLoadedOver) {
            await resourceManager.loadBundle(GameConfig.gameName);
            this.gameSceneIsLoad = true;
        } else {
            debugLog('游戏bundle已经加载完成');
            this.gameSceneIsLoad = true;
        }
        
        // resourceManager.loadSceneInBundle(`${GameConfig.gameName}_GameScene`,GameConfig.gameName,() => {
        //     console.log('游戏场景加载完毕');
        // },(completedCount, totalCount, item) => {
        //     let comple = Math.floor(completedCount / totalCount * 20);
        //     let lerp = comple - this.lastnum2;
        //     this.lastnum2 = comple;
        //     this.changeSceneIndex = this.changeSceneIndex + lerp;
            
        // });

        // resourceManager.loadAssetInBundle(``,)
        const needMatchSceneArr = ['ludo','dominoe'];
        if(needMatchSceneArr.indexOf(GameConfig.gameName) >= 0) {
            resourceManager.loadBundleDir(GameConfig.gameName,`resources_${GameConfig.gameName}/${GameConfig.gameName}_matchingScene_Res`,cc.Prefab,(completedCount, totalCount, item) => {
                let comple = Math.floor(completedCount / totalCount * 5);
                let lerp = comple - this.lastnum3;
                this.lastnum3 = comple;
                this.changeSceneIndex = this.changeSceneIndex + lerp;
                if (comple == 5) {
                    debugLog(`加载${GameConfig.gameName}游戏完成`);
                    this.matchingResIsLoad = true;
                }
            }, (err, resource) => {
                debugLog('加载匹配场景预制体完毕',resource);
                this.matchingResIsLoad = true;
                MathcResData.matchSceneResource = resource;
            });
        }

        // @ts-ignore
        if(GameConfig.gameName == 'sf') {
            resourceManager.loadBundleDir(GameConfig.gameName,`res/prefab`,cc.Prefab,(completedCount, totalCount, item) => {
                let comple = Math.floor(completedCount / totalCount * 5);
                let lerp = comple - this.lastnum3;
                this.lastnum3 = comple;
                this.changeSceneIndex = this.changeSceneIndex + lerp;
                if (comple == 5) {
                    debugLog(`加载${GameConfig.gameName}游戏完成`);
                    this.matchingResIsLoad = true;
                }
            }, (err, resource) => {
                debugLog('加载匹配场景预制体完毕',resource);
                this.matchingResIsLoad = true;
                MathcResData.matchSceneResource = resource;
            });
        }
    }
    private loadLanguage() {
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        console.log("lang is ",lang);
        // lang = 'ar';
        resourceManager.loadBundleDir(GameConfig.gameName,'lang',cc.JsonAsset,null,(err,res) => {
            debugLog('拉取语言bundle',res);
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                if (element._name == lang) {
                    if(MessageData.gameName === 'ludo') {
                        MessageData.lang = element.json;
                        console.log('lang is ',MessageData.lang);
                    } else {
                        MessageData.langDominoe = element.json;
                        console.log('lang is ',MessageData.langDominoe);
                    }
                    return;
                }
            }
        });
    }
    private showProgressLabelIsShow() {
        if (this.progressLabelIsShow) {
            return;
        }
        this.progressLabelIsShow = true;
        this.proLabel.node.active = true;
    }

    update(dt) {
        if (this.proLabel)
            this.proLabel.string = this.changeSceneIndex.toString() + '%';
        if (this.progressBar)
            this.progressBar.progress = this.changeSceneIndex / 100;
        
        // 匹配资源预加载完成 && 匹配场景预加载完成 && 游戏场景预加载完毕 
        if (this.isGotoMatchScene && this.matchingResIsLoad && this.matchSceneIsLoad && this.gameSceneIsLoad && this.gameBundleIsLoadedOver) {
            this.isGotoMatchScene = false;
            if (MessageData.gameType == GameType.single && (MessageData.gameName == "ludo" || MessageData.gameName === 'dominoe')) {
                // ludo和多米诺都进入模式选择场景
                cc.director.loadScene(`${MessageData.gameName}_ModeScene`);
            } else {
                if(MessageData.gameName === 'ludo' || MessageData.gameName === 'dominoe') {
                    cc.director.loadScene('MatchScene');
                } 
                if(MessageData.gameName === 'sf') {
                    cc.director.loadScene('HallScene');
                }
                
            }
        }
    }

}


