const { ccclass, property } = cc._decorator;

@ccclass
export class GameData {
    public static gameid = null;

    /** 本次收到的socket消息 */
    public static message = {
        /**消息的唯一ID*/
        id: "",
        /**所属应用*/
        app: "",
        /**自定义消息*/
        type: "",
        /**消息子类型*/
        method: "",
        channel: { type: "", id: "" },
        /**UID*/
        sender: 23,
        data: {
            /**enum(single, chatroom)*/
            source: "",
            /***/
            source_id: "",
            /**enum(playing, completed)*/
            status: "",
            /**还有多少秒结束*/
            countdown_duration: -1,
            /**enum(red, yellow, green, blue)*/
            color: "",
            /**enum(aes, desc)*/
            order: "",
            /**剩余牌数*/
            poker_remain_count: -1,
            /** 已经打出的牌, 最后一张为最新打出的牌 */
            poker_output: [],
            /**最近一次动作 的步数; 从 1 开始; 可以根据该 值 判定 UI 上是否已经完成过该动作*/
            step_number: -1,
            /**最近一次动作 的玩家 UID; 开局为 0*/
            player_last: -1,
            /**最近一次动作; 开局为 ""*/
            player_last_action: "",
            /**当前玩家的 UID*/
            player_now: -1,
            /** 当前玩家需要做的动作 */
            player_now_should: ["", ""],
            /** 玩家是否跳过 */
            player_skipped: 0,
            players: [{
                /**UID*/
                id: -1,
                /**昵称*/
                name: "",
                /**头像*/
                avatar: "",
                /**剩余牌数*/
                poker_remain_count: -1,
                /**仅能看到自己的牌*/
                poker_remain: [],
                /**enum(online, offline, abandon)*/
                status: "",
                /**排名, 仅结束后有效*/
                rank: -1,
                /**得分, 仅结束后有效*/
                score: -1,
                /**赢币, 仅结束后有效*/
                coin: -1,
                is_agent: true,
            }],
            stop_reason: ""
        }
    }
    /** 上一次收到的socket消息 */
    public static lastMessage = {
        /**消息的唯一ID*/
        id: "",
        /**所属应用*/
        app: "",
        /**自定义消息*/
        type: "",
        /**消息子类型*/
        method: "",
        channel: { type: "", id: "" },
        /**UID*/
        sender: 23,
        data: {
            /**enum(single, chatroom)*/
            source: "",
            /***/
            source_id: "",
            /**enum(playing, completed)*/
            status: "",
            /**还有多少秒结束*/
            countdown_duration: -1,
            /**enum(red, yellow, green, blue)*/
            color: "",
            /**enum(aes, desc)*/
            order: "",
            /**剩余牌数*/
            poker_remain_count: -1,
            /**打出的牌, 最后一张为最新打出的牌*/
            poker_output: [],
            /**最近一次动作 的步数; 从 1 开始; 可以根据该 值 判定 UI 上是否已经完成过该动作*/
            step_number: -1,
            /**最近一次动作 的玩家 UID; 开局为 0*/
            player_last: -1,
            /**最近一次动作; 开局为 ""*/
            player_last_action: "",
            /**当前玩家的 UID*/
            player_now: -1,
            player_now_should: ["", ""],
            player_skipped: 0,
            players: [{
                /**UID*/
                id: -1,
                /**昵称*/
                name: "",
                /**头像*/
                avatar: "",
                /**剩余牌数*/
                poker_remain_count: -1,
                /**仅能看到自己的牌*/
                poker_remain: [],
                /**enum(online, offline, abandon)*/
                status: "",
                /**排名, 仅结束后有效*/
                rank: -1,
                /**得分, 仅结束后有效*/
                score: -1,
                /**赢币, 仅结束后有效*/
                coin: -1,
            }],

        }
    }
    public static completedMessage = {
        /**消息的唯一ID*/
        id: "",
        /**所属应用*/
        app: "",
        /**自定义消息*/
        type: "",
        /**消息子类型*/
        method: "",
        channel: { type: "", id: "" },
        /**UID*/
        sender: 23,
        data: {
            /**enum(single, chatroom)*/
            source: "",
            /***/
            source_id: "",
            /**enum(playing, completed)*/
            status: "",
            /**还有多少秒结束*/
            countdown_duration: -1,
            /**enum(red, yellow, green, blue)*/
            color: "",
            /**enum(aes, desc)*/
            order: "",
            /**剩余牌数*/
            poker_remain_count: -1,
            /**打出的牌, 最后一张为最新打出的牌*/
            poker_output: [],
            /**最近一次动作 的步数; 从 1 开始; 可以根据该 值 判定 UI 上是否已经完成过该动作*/
            step_number: -1,
            /**最近一次动作 的玩家 UID; 开局为 0*/
            player_last: -1,
            /**最近一次动作; 开局为 ""*/
            player_last_action: "",
            /**当前玩家的 UID*/
            player_now: -1,
            player_now_should: ["", ""],
            player_skipped: 0,
            players: [{
                /**UID*/
                id: -1,
                /**昵称*/
                name: "",
                /**头像*/
                avatar: "",
                /**剩余牌数*/
                poker_remain_count: -1,
                /**仅能看到自己的牌*/
                poker_remain: [],
                /**enum(online, offline, abandon)*/
                status: "",
                /**排名, 仅结束后有效*/
                rank: -1,
                /**得分, 仅结束后有效*/
                score: -1,
                /**赢币, 仅结束后有效*/
                coin: -1,
                is_agent: true,
            }],
            stop_reason: ""
        }
    }

    public static gameInfo = {
        source: "single", //enum(single, chatroom)
        source_id: "xxxyyyzzz", //
        status: "playing", //enum(playing, completed)
        countdown_duration: 12132, //还有多少秒结束
        color: "red", //enum(red, yellow, green, blue)
        order: "aes", //enum(aes, desc)
        poker_remain_count: 10, //剩余牌数
        poker_output: [108, 99, 100], //打出的牌, 最后一张为最新打出的牌
        step_number: 999, //最近一次动作 的步数; 从 1 开始; 可以根据该 值 判定 UI 上是否已经完成过该动作
        player_last: 12, //最近一次动作 的玩家 UID; 开局为 0
        player_last_action: "draw", //最近一次动作; 开局为 ""
        player_now: 23, //当前玩家的 UID
        player_now_should: ["play", "skip"],
        players: [{
            id: 0, //UID
            name: "", //昵称
            avatar: "", //头像
            poker_remain_count: 4, //剩余牌数
            poker_remain: [108, 11, 12, 13], //仅能看到自己的牌
            status: "online", //enum(online, offline, abandon)
            rank: 1,    //排名, 仅结束后有效
            score: -19, //得分, 仅结束后有效
            coin: 100,  //赢币, 仅结束后有效
        }],
        stop_reason: "timeout", // 游戏结束原因
    }
}
