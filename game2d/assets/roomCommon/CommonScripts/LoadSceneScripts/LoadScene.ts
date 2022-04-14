import { GameConfig } from "../../../gameConfig";
import { getUrlParameterValue } from "../../../Script/common/utils/util";
import FrameImageManager from "../../Component/FrameImageComponent/FrameImageManager";
import MatchResData from "../MatchSceneScripts/MatchResData";
import MessageData, { GameCoinType, GameType } from "../Utils/MessageData";
import MessageManager from "../Utils/MessageManager";
import MessageType from "../Utils/MessageType";
import MyEvent from "../Utils/MyEvent";
import NDB from "../Utils/NDBTS";


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

    /**是否切换到匹配场景 */
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

    onLoad() {
        /** 开启动态合图 */
        console.log('开启动态合图');
        cc.dynamicAtlasManager.enabled = true;
        cc.macro.CLEANUP_IMAGE_CACHE = false;

        this.initNode();
        this.setMessageData();
        MessageManager.Init();
        this.setIcon();
        // this.setExtra();
        this.loadLanguage();
        FrameImageManager.Init()
        let vcode = getUrlParameterValue('vcode');
        console.log('vcode is ',vcode);

        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'ludo') {
            cc.find('Canvas/BG').active = true;
            MessageData.gameType = GameType.room;
        }

        if((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName === 'dominoe') {
            const bgNode = this.node.getChildByName('bg_dominoe');
            MessageData.gameType = GameType.room;
            bgNode.active = true;
        }
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
        let url = `http://a.fslk.co/games/${MessageData.gameName}/${path}/${MessageData.gameName}${zipVCodeID}.zip`
        if(MessageData.gameName === 'dominoe') {
            url = `http://a.fslk.co/games/${MessageData.gameName}/${path}/${MessageData.gameName}${zipVCodeID}.zip`;
        } else {
            url = `http://a.fslk.co/games/zips/${path}/${MessageData.gameName}${zipVCodeID}.zip`
        }
        console.log("load zip URL:" + url);
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
        } else {
            console.log('');
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
        cc.director.preloadScene('MatchScene', (completedCount, totalCount, item) => {
            let comple = Math.floor(completedCount / totalCount * 25);
            if (flag) {
                let lerp = comple - this.lastnum1;
                this.lastnum1 = comple;
                this.changeSceneIndex = this.changeSceneIndex + lerp;
            } else {
                let lerp = comple * 3 - this.lastnum1;
                this.lastnum1 = comple * 3;
                this.changeSceneIndex = this.changeSceneIndex + lerp;
            }
            if (comple == 25) {
                this.matchSceneIsLoad = true;
            }

        }, (error) => {
        });
    }

    private loadGameScene() {
        cc.director.preloadScene(`${MessageData.gameName}_GameScene`, (completedCount, totalCount, item) => {
            let comple = Math.floor(completedCount / totalCount * 20);
            let lerp = comple - this.lastnum2;
            this.lastnum2 = comple;
            this.changeSceneIndex = this.changeSceneIndex + lerp;
            if (comple == 20) {
                this.gameSceneIsLoad = true;
            }
        }, (error) => {
        });
        cc.loader.loadResDir(`GamesRes/${MessageData.gameName}_matchingScene_Res`, (completedCount, totalCount, item) => {
            let comple = Math.floor(completedCount / totalCount * 5);
            let lerp = comple - this.lastnum3;
            this.lastnum3 = comple;
            this.changeSceneIndex = this.changeSceneIndex + lerp;
            if (comple == 5) {
                this.matchingResIsLoad = true;
            }
        }, (err, resource, urls) => {
            MatchResData.matchSceneResource = resource
        })
    }
    private loadLanguage() {
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        console.log("lang is ",lang);
        // lang = 'ar';
        cc.loader.loadResDir(`CommonRes/language/${GameConfig.gameName}`, (err, res) => {
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
        })
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
        if (this.isGotoMatchScene && this.matchingResIsLoad && this.matchSceneIsLoad && this.gameSceneIsLoad) {
            this.isGotoMatchScene = false;
            if (MessageData.gameType == GameType.single && (MessageData.gameName == "ludo" || MessageData.gameName === 'dominoe')) {
                // ludo和多米诺都进入模式选择场景
                cc.director.loadScene(`${MessageData.gameName}_ModeScene`);
            } else {
                cc.director.loadScene('MatchScene');
            }
        }
    }

}

