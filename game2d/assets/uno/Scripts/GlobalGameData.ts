
/**
 * CopyRight:
 * 全局数据类
 */

export enum RoomType {
    ROOM,
    SINGLE,
}

export enum GamePlayerCount {
    /** 两人局 */
    TWO,
    /** 三人局 */
    THREE,
    /** 四人局 */
    FOUR
}

export interface PlayerInfo {
    id: number,
    name: string,
    avatar: string,
    poker_remain: number[],
    poker_remain_count: number,
    status: string,
    rank: number,
    score: number,
    coin: number,
    is_agent: boolean,
    country: string,
    lang: string,
    Did: string,
}

/** 房间最新状态 */
export interface LatestGameInfo {
    color: string,
    countdown: number,
    order: string,
    player_last: number,
    player_last_action: string,
    player_now: number,
    player_now_should: string[],
    player_skipped: number,
    players: PlayerInfo[],
    poker_output: number[],
    poker_remain_count: number,
    source: string,
    source_id: string,
    game_id: string,
    status: 'matching' | 'playing' | 'completed',
    step_number: number,
    stop_reason: string,
    voice_platform: string


}
export default class GlobalGameData {
    /** 是否进入游戏场景 */
    public static enterGameScene: boolean = false;
    public static isGotoMatchScene: boolean = false;

    public static isCanAutoJoinGame: boolean = true;

    public static roomBetsType: string = ''

    public static isFirstLoad: boolean = true;

    public static userInfo: any = null;

    /** 是否是房间类型的游戏 */
    public static isRoom: boolean = false;
    /** 是否可以发送表情 */
    public static isCanSendEmoji: boolean = false;

    public static audioEngineOn: boolean = true;                         //声音开关;
    public static userId: number = -1;                                   //用户ID；
    public static socketStatus: boolean = false;                         //服务器链接情况;
    public static shareUrl: string = '';                                 //分享链接;
    public static roomId: string = '0';                                     //房间id;
    public static roomUserId: string = '';

    public static gameSourceId: string = '';
    /** 默认房间模式 */
    public static roomType: RoomType = RoomType.ROOM;
    /** 是不是房主 */
    public static isRoomOwner: boolean = false;
    /** 几人局 */
    public static playerCount: GamePlayerCount = GamePlayerCount.TWO;
    /** 是否是上帝模式 */
    public static isGod: boolean = false;

    //执行Promise的队列动作;
    public static runPromiseArray(parray) {
        let p = Promise.resolve();
        for (let promise of parray) {
            p = p.then(promise).catch(()=>{
                return p;
            });
        }
    }

    //设置名字长度；
    public static subNickName(nameStr: string) {
        if (nameStr.length > 8) {
            nameStr = nameStr.substring(0, 8) + '...';
        }
        return nameStr;
    }

    public static RoomSigleScale = {
        /** 中间的圆环 */
        centerRotate: {
            0: 0.7,
            1: 0.7
        },

        /** 玩家自己牌的缩放比例 */
        selfPockScale: {
            0: 0.8,
            1: 0.8,
        },

        /** 别的玩家开始出牌时候牌的缩放比例 */
        outCardStartScale: {
            0: 0.6,
            1: 0.6
        },

        /** 出牌堆里面的牌缩放大小 */
        outPockScale: {
            0: 0.7,
            1: 0.7
        },


    }


}