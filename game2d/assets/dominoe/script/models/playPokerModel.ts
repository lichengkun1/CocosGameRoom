

/**
 * 
 * 出牌相关 model
 * 
 * POST /v1/dominoe/play_poker/{chatroom_id}/
    {
        "user_id": 123,     // 本轮玩家
        "position": "left", // 玩家出牌的位置, eunum(left, middle, right)
        "poker": {"key":3, "nums":[0, 2]}     // 玩家所出的牌, 牌需要有顺序: [0,2] 或 [2,0]
    }
 * 
 */

export interface PlayPokerModel {
    /** 本轮玩家 */
    user_id: number,
    /** 位置 */
    position: string,
    /** 出牌的信息 */
    poker: {
        key: number,
        nums: number[],
    }
}