export default class Dominoe_testMessage {
    public static message = {
        "status": "playing", //游戏状态  matching: 匹配, completed: 结束, playing: 进行
        "poker_remain_count": 10, //牌桌上剩余的牌
        "start_at":"2020-04-18T14:34:21.786Z", //游戏开始时间(仅状态不是matching时)
        "completed_at":"2020-04-18T14:34:21.786Z", //结束时间（仅当状态是completed时)
        "countdown_duration": 8, //游戏开局倒计时
        //已出牌的列表
        "poker_played": {
            "left"   : [{"key":1, "nums":[0,2]},{"key":2,"nums":[2,3]}],
            "middle" : {"key":5, "nums":[0,0]},
            "right"  : [{"key":7, "nums":[0,4]}]
        },
        //玩家列表
        "players" : {
            "1" : {
                "id"            : 30119060,
                "name"          : "JackerCao",
                "avatar"        : "http://img1.newsdog.today/image/2020-04-13/thumb_mid_5e942db2e3929e000127a313",
                "status"        : "online", //玩家状态 abandoned:放弃, kickoff:踢出,offline:离线, online: 在线
                "poker_remain_count"  : 7,        //剩余的牌数
                "diamond": -100, //正数: 代表赢的游戏币, 负值：代表输的游戏币, 默认值：0
                "props"         : -7,  //负值：扣除7分,  
                "system_paly_count"   : 2, //系统连续出牌计数
                "poker_remain_list"   : [{"key":1, "nums":[0,6]},{"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]},
                {"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]},
                {"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]},{"key":2,"nums":[2,6]}], //剩余的牌
                "poker_playable_list" : [{"key":7, "nums":[1,4]}], //可打的牌
                "pick_out_poker_list": [{"key":8, "nums":[2,6]}], //抽到的牌
            },
            "2" : {
                "id"            : 30227807,
                "name"          : "Jacker Cao",
                "avatar"        : "http://img1.newsdog.today/image/2020-04-13/thumb_mid_5e942db2e3929e000127a313",
                "status"        : "online", //玩家状态 abandoned:放弃, kickoff:踢出,offline:离线, online: 在线
                "poker_remain_count"  : 7,        //剩余的牌数
                "diamond": 100, //正数: 代表赢的游戏币, 负值：代表输的游戏币, 默认值：0
                "props"         : -7,  //负值：扣除7分,  
                "system_paly_count"   : 2, //系统连续出牌计数
                "poker_remain_list"   : [{"key":1, "nums":[1,6]},{"key":2,"nums":[2,6]}], //剩余的牌
                "poker_playable_list" : [{"key":7, "nums":[1,4]}], //可打的牌
                "pick_out_poker_list": [{"key":8, "nums":[2,6]}], //抽到的牌
            }
        },
    
        //当前玩家
        "player_current" : {
            "user_id"           : 30119060,// 出牌用户的 id
            "is_pick_out"       : true, // 是否可以抽取牌
            "is_poker_playable" : false, //是否有牌可出
            "countdown_duration": 8,    // 出牌倒计时
        }
    }

}