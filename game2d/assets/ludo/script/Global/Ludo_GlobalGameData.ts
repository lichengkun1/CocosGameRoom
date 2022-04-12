
/**
 * CopyRight:
 * 全局数据类
 */

export default class Ludo_GlobalGameData {
    //user1的移动轨迹  arr[0] 横坐标 arr[1]纵坐标 arr[2] 0:可以与其他玩家的棋子进行碰撞 1:不能与其他玩家的棋子进行碰撞;
    public static user1MoveTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0],
    [7, 1, 1], [7, 2, 1], [7, 3, 1], [7, 4, 1], [7, 5, 1], [7, 6, 1]];

    public static user2MoveTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0],
    [1, 7, 1], [2, 7, 1], [3, 7, 1], [4, 7, 1], [5, 7, 1], [6, 7, 1]];

    public static user3MoveTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0],
    [7, 13, 1], [7, 12, 1], [7, 11, 1], [7, 10, 1], [7, 9, 1], [7, 8, 1]];

    public static user4MoveTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0],
    [13, 7, 1], [12, 7, 1], [11, 7, 1], [10, 7, 1], [9, 7, 1], [8, 7, 1]];

    //user1的移动轨迹  arr[0] 横坐标 arr[1]纵坐标 arr[2] 0:可以与其他玩家的棋子进行碰撞 1:不能与其他玩家的棋子进行碰撞;
    public static moveUser1MoveTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [7, 1, 1], [7, 2, 1], [7, 3, 1],
    [7, 4, 1], [7, 5, 1], [7, 6, 1]];

    public static rocketTrack = [[6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0],
    [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0],
    [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0],
    [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0]];

    public static moveUser2MoveTrack = [[1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0], [6, 11, 0],
    [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0], [9, 8, 0],
    [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0], [10, 6, 0],
    [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0], [6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0],
    [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0], [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [1, 7, 1], [2, 7, 1], [3, 7, 1], [4, 7, 1], [5, 7, 1],
    [6, 7, 1]];

    public static moveUser3MoveTrack = [[8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0], [9, 8, 0], [10, 8, 0], [11, 8, 0],
    [12, 8, 0], [13, 8, 0], [14, 8, 0], [14, 7, 0], [14, 6, 0], [13, 6, 1], [12, 6, 0], [11, 6, 0], [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0],
    [8, 3, 0], [8, 2, 0], [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0], [6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0],
    [3, 6, 0], [2, 6, 0], [1, 6, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0],
    [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [7, 14, 0], [7, 13, 1], [7, 12, 1], [7, 11, 1], [7, 10, 1], [7, 9, 1], [7, 8, 1]];

    public static moveUser4MoveTrack = [[13, 6, 1], [12, 6, 0], [11, 6, 0], [10, 6, 0], [9, 6, 0], [8, 5, 0], [8, 4, 0], [8, 3, 0], [8, 2, 0],
    [8, 1, 0], [8, 0, 0], [7, 0, 0], [6, 0, 0], [6, 1, 1], [6, 2, 1], [6, 3, 0], [6, 4, 0], [6, 5, 0], [5, 6, 0], [4, 6, 0], [3, 6, 0], [2, 6, 0], [1, 6, 0],
    [0, 6, 0], [0, 7, 0], [0, 8, 0], [1, 8, 1], [2, 8, 0], [3, 8, 0], [4, 8, 0], [5, 8, 0], [6, 9, 0], [6, 10, 0], [6, 11, 0], [6, 12, 0], [6, 13, 0],
    [6, 14, 0], [7, 14, 0], [8, 14, 0], [8, 13, 1], [8, 12, 0], [8, 11, 0], [8, 10, 0], [8, 9, 0], [9, 8, 0], [10, 8, 0], [11, 8, 0], [12, 8, 0], [13, 8, 0],
    [14, 8, 0], [14, 7, 0], [13, 7, 1], [12, 7, 1], [11, 7, 1], [10, 7, 1], [9, 7, 1], [8, 7, 1]];

    public static audioEngineOn: boolean = true;                         //声音开关;
    public static userId: number = -1;                                   //用户ID；
    public static socketStatus: boolean = false;                         //服务器链接情况;
    public static is2P: boolean = false;                                 //是否是1v1;
    public static gameSceneIsLoad: boolean = false;                      //游戏场景是否加载完毕;
    public static hallSceneIsLoad: boolean = false;                      //大厅场景是否已经加载完毕;
    public static isPlayerAgain: boolean = false;                        //是否重新匹配;
    public static allNodePos = {};
    public static isCanSendExpression: boolean = true;                   //是否能发送表情;
    public static channel = null;
    public static isDroppedChangeGame: boolean = false;                  //是否是因为断线所以才更改的场景;
    public static isCanAutoJoinGame: boolean = true;                     //是否能自动join游戏;

    public static gameRoomId: string = '';                               //游戏房间ID;
    public static channelId: number = 0;                                 //当前游戏ID;
    public static shareUrl: string = '';                                 //分享房间url;

    public static godModeGameBoard: number = 0;                          //上帝模式用户当前使用棋盘;
    public static isFirstShowChangeRoom: boolean = true;                 //是否是第一次显示切换房间弹框;

    public static settingLayer: cc.Node = null;
    public static gameSource: string = '';
    public static gridSize: number = 46;                                 // 棋盘上的每一个网格的大小
    /** 是否进入游戏界面 */
    public static enterGameScene: boolean = false;

    public static gameType = {
        none: 0,
        GodModel: 1,                                                     //上帝模式;
        twoModel: 2,                                                     //2人模式；
        threeModel: 3,                                                   //3人模式；
        FourModel: 4                                                     //4人模式；
    }

    public static nowGameType: number = Ludo_GlobalGameData.gameType.none;    //游戏类型;
    public static userInfo = null;                                      //个人数据;
    public static followedObj = {};                                     //请求过哪些id已经关注的;
    public static preLoadObj = {};                                      //预加载对象;
    public static isFirstLoad: boolean = true;                           //是否是第一次进来;
    public static isCoinType: boolean = false;                           //是否是游戏币类型;

    //赌金类型;
    public static roomBets: number = 100;                                  //赌注金额;
    public static roomBetsType: string = 'diamond';                      //赌注类型;
    public static isCanShowBetsText: boolean = true;                     //是否能显示赌注文本;
    public static countTimeIsZero: boolean = false;                      //当倒计时为0的时候不能更改游戏配置;
    public static bets_list: number[] = [];                              //配置的赌金;
    public static betsConfig = null;                                    //在结算界面获取最新的配置数据；    

    public static lang_json = null;                                     //多语言的json;
    public static isGotoMatchScene: boolean = false;                     //是否切换到匹配场景;

    //自定义一个随机的骰子数;
    public static getRandNum() {
        let num = Math.floor(Math.random() * 6) + 1;
        return num;
    }


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

    public static getAngle(x1: number, y1: number, x2: number, y2: number): number {
        var angle: number = Math.atan2(y2 - y1, x2 - x1);
        return (angle / Math.PI * 180) * -1;
    }

    //获取已经下载龙骨资源;
    public static getDragonBonesRes(dragName: string) {
        let atlasAsset = cc.loader.getRes(`GamesRes/store/${dragName}_tex`, dragonBones.DragonBonesAtlasAsset);
        let asset = cc.loader.getRes(`GamesRes/store/${dragName}_ske`, dragonBones.DragonBonesAsset);
        if (atlasAsset && asset) {
            return { asset: asset, atlasAsset: atlasAsset }
        }
        return null;
    }

    //获取纹理资源;
    public static getSpriteFrameRes(spr: string) {
        let spriteFrame = cc.loader.getRes(`GamesRes/store/${spr}`, cc.SpriteFrame);
        return spriteFrame;
    }

    //获取纹理资源;
    public static getSpriteAtlasRes(spr: string) {
        let spriteAtlas = cc.loader.getRes(`GamesRes/store/${spr}`, cc.SpriteAtlas);
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

}