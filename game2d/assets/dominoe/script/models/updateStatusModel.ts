import { PockerObj } from "../rank/rankItem";
import { ActionEnum, GameStatusEnum, PlayerInfoModel, PlayerStatus, PokerDir } from "./gameStatusModel";

/**
 * 
 * 游戏期间, 任何游戏的状态变更都需要以该消息进行广播. 玩家会额外看到各自的底牌数据.
 * 游戏更新模型
 */
export interface UpdateStatusModle {
    /** 游戏状态  matching: 匹配, completed: 结束, playing: 进行 */
    status: GameStatusEnum,
    /** 牌桌上剩余的牌 */
    poker_remain_count: number,

    /** 已出牌的列表 */
    poker_played: {
        'left': PockerObj[],
        'right': PockerObj[],
        'middle': PockerObj,
    },
    /** 玩家列表 */
    players: {[key: string]: PlayerInfoModel},
    /** 上个操作的玩家 */
    player_last: {
        /** 动作 play_poker:出牌, pick_out_poker:抽牌, skip:跳过*/
        action: ActionEnum,

        poker_played_one: {
            user_id: string,
            position: PokerDir,
            /** 出的牌 */
            poker: PockerObj,
            /** 是否系统出牌 */
            system_play: boolean,
        },
        pick_ount_poker_one: {
            /** 抽牌的用户id */
            user_id: string,
            /** 抽到的牌数 */
            count: string,
        },
        skip_one: {
            /** 跳过的用户id */
            user_id: string,
            /** 跳过的原因 */
            reason: PlayerStatus,
        },
    }
    /** 当前玩家 */
    player_current: {
        user_id: number,
        /** 是否可以抽取牌 */
        is_pick_out: boolean,
        /** 是否有牌可出 */
        is_pocker_playable: boolean,
        /** 出牌倒计时 */
        countdown_duration: number,
    }
}