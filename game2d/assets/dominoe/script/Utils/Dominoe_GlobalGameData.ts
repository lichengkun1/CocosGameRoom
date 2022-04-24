
/**
 * CopyRight:
 * 全局数据类
 */

import { dataCacheManager } from "../../../ludo/script/models/dataCache";

export enum GameModeDominoe {
    ROUND,
    SCORE100,
}

export default class Dominoe_GlobalGameData {

    public static audioEngineOn: boolean = true;                         //声音开关;
    public static userId: number = -1;                                   //用户ID；
    public static socketStatus: boolean = false;                         //服务器链接情况;
    public static gameSceneIsLoad: boolean = false;                      //游戏场景是否加载完毕;
    public static hallSceneIsLoad: boolean = false;                      //大厅场景是否已经加载完毕;
    public static gameRoomId: string = '';                               //游戏房间ID;
    public static shareUrl: string = '';                                 //分享房间url;
    public static isGodModel: boolean = true;                            //是否是上帝视角;

    public static UserInfo = null;                                      //个人信息;
    public static RoomInfo = null;                                      //房间信息；
    public static selectSendPocker = null;                              //选择的需要出的牌;
    public static isCanAutoJoinGame: Boolean = true;                    //是否能自动join;
    public static isTouchPocker: boolean = false;                       //是否已经点击牌了;
    public static isCanSendPocker: boolean = false;                     //是否可以点击牌出牌;
    public static isFirstShowChangeRoom: boolean = true;                //是否是第一次显示切换房间弹框;
    public static followedObj = {};                                     //请求过哪些id已经关注的;
    public static gameSource: string = '';
    public static isFirstLoad: boolean = true;                           //是否是第一次进来;

    public static roomBets: number = 200;
    public static gameID = '';
    public static roomBetsType: string = '';

    public static isGameEnd: boolean = false;

    /** 一局游戏币变化范围 */
    public static oneRoundBetList: number[] = [200,400,800,1200];
    /** 分数模式游戏币变化范围 */
    public static scoreBetList: number[] = [200,400,800,1200];

    public static pocker_object = {};
    /** 游戏玩法模式 */
    public static _gameMode: GameModeDominoe = GameModeDominoe.ROUND;
    /** 游戏匹配成功之后的数据方便恢复数据 */
    public static matchSuccessData: any = null;

    public static betsConfig: any = null;

    public static set gameMode(model: GameModeDominoe) {
        this._gameMode = model;
        // dataCacheManager.setLocalData('lastMode',{mode: this._gameMode});
        cc.sys.localStorage.setItem('lastMode',JSON.stringify({mode: this._gameMode}));
    }
    public static get gameMode() {
        const lastModeLocalData = cc.sys.localStorage.getItem('lastMode');
        if(!lastModeLocalData) return this._gameMode;

        const modeObj = JSON.parse(lastModeLocalData);
        if(modeObj) {
            this._gameMode = modeObj.mode as GameModeDominoe;
        } else {
            this._gameMode = GameModeDominoe.ROUND;
        }
        return this._gameMode;
    }

    //当前牌的状态;
    public static paiType = {
        NONE: 0,                                                       //初始化状态;
        VERTICALLY_0: 1,                                               //正着的竖直状态；
        VERTICALLY_180: 2,                                             //倒着的竖直状态；
        LEFT: 3,                                                       //往左倾斜状态；
        RIGHT: 4                                                       //往右倾斜状态；
    };

    //执行Promise的队列动作;
    public static runPromiseArray(parray) { //这个方法可以放到G里
        let p = Promise.resolve();
        for (let promise of parray) {
            p = p.then(promise);
        }
        return p;
    }

    public static subNickName(nameStr: string, subCount: number = 8) {
        if (nameStr.length > subCount) {
            nameStr = nameStr.substring(0, subCount) + '...';
        }
        return nameStr;
    }

    //根据点获取角度;
    public static getAngle(x1: number, y1: number, x2: number, y2: number): number {
        var angle: number = Math.atan2(y2 - y1, x2 - x1);
        return (angle / Math.PI * 180) * -1;
    }

    //获取已经下载龙骨资源;
    public static getDragonBonesRes(dragName: string) {
        let atlasAsset = cc.loader.getRes(`store/${dragName}_tex`, dragonBones.DragonBonesAtlasAsset);
        let asset = cc.loader.getRes(`store/${dragName}_ske`, dragonBones.DragonBonesAsset);
        if (atlasAsset && asset) {
            return { asset: asset, atlasAsset: atlasAsset }
        }
        return null;
    }

    //获取纹理资源;
    public static getSpriteFrameRes(spr: string) {
        let spriteFrame = cc.loader.getRes(`store/${spr}`, cc.SpriteFrame);
        return spriteFrame;
    }

    //获取纹理资源;
    public static getSpriteAtlasRes(spr: string) {
        let spriteAtlas = cc.loader.getRes(`store/${spr}`, cc.SpriteAtlas);
        return spriteAtlas;
    }

    //设置切换纹理的动作;
    public static setChangeSpriteFrameAction(node1: cc.Node, node2: cc.Node) {
        let scaleF0 = cc.scaleTo(0.3, 0.9);
        let scaleF1 = cc.scaleTo(0.4, 1.1);
        let scaleF2 = cc.scaleTo(0.2, 0.9);
        let scaleF3 = cc.scaleTo(0.2, 1);
        let callfunc = cc.callFunc(() => {
            let ro = cc.rotateBy(0.6, 180);
            let deTime = cc.delayTime(0.4);
            let hi = cc.fadeOut(0.2);
            let call = cc.callFunc(() => {
                node2.active = false;
            });
            node2.active = true;
            node2.runAction(cc.sequence(cc.spawn(ro, cc.sequence(deTime, hi)), call));
        });
        node1.runAction(cc.sequence(scaleF0, callfunc, scaleF1, scaleF2, scaleF3));
    }
    //设置牌；
    public static setpocker_object() {
        this.pocker_object = {};
        for (let i = 0; i < 7; i++) {
            this.pocker_object[i] = [];
            for (let j = 0; j < 7; j++) {
                let obj = {};
                obj['isShow'] = false;
                let nums: number[] = [i, j];
                if (j < i) {
                    nums = [j, i];
                }
                obj['points'] = nums;
                this.pocker_object[i].push(obj);
            }
        }
    }
}