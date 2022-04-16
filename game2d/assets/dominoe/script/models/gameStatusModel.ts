import { PockerObj } from "../rank/rankItem";

/**
 * 
 * GET /v1/dominoe/chatroom/{chatroom_id}/
 * 游戏状态模型
 * 
 */
 /** 游戏状态 */
 export enum GameStatusEnum {
    MATCHING = 'matching',
    PLAYING = 'playing',
    COMPLETED = 'completed',
 }

 /** 牌的方向 */
 export enum PokerDir {
     LEFT = 'left',
     RIGHT = 'right',
     MIDDLE = 'middle',
 }

 /** 玩家状态 */
 export enum PlayerStatus {
     ABANDONED = 'abandoned',
     KICKOFF = 'kickoff',
     OFFLINE = 'offline',
     ONLINE = 'online',
     NOPOKERPLAYED = 'not_poker_playable',
 }

 export enum ActionEnum {
     PLAYPOKER = 'play_poker',
     PICKOUT = 'pick_out_poker',
     SKIP = 'skip',
 }

 /** 玩家信息 model */
 export type PlayerInfoModel = {
    /** 玩家ID */
    id: number,
    /** 玩家名字 */
    name: string,
    /** 玩家头像地址 */
    avatar: string,
    /** 玩家状态 */
    status: PlayerStatus,
    /** 剩余的牌数 */
    poker_remain_count: number,
    /** 正数: 代表赢的游戏币, 负值：代表输的游戏币, 默认值：0 */
    diamond: number,
    /** 负值：扣除7分,   */
    props: number,
    /** 系统连续出牌计数 */
    system_paly_count?: number,
    /** 剩余的牌 */
    poker_remain_list?: PockerObj[],
    /** 可以打出去的牌 */
    poker_playable_list?: PockerObj[],
    /** 抽到的牌 */
    pick_out_poker_list?: PockerObj[],

    /** 玩家当前分数 只在reset消息时候有该字段 */
    single_score?: number,
    /** 玩家总分 只在reset消息时候有该字段 */
    total_score?: number,
    /** 排名 */
    ranking?: number,
    /** 是否是代打 */
    is_agent: boolean,

 }

 export interface GameStatusModel {
     action: string;
     /** 游戏状态  matching: 匹配, completed: 结束, playing: 进行 */
     status: GameStatusEnum,
     /** 牌桌上剩余的牌 */
     poker_remain_count: number | string,
     /** 游戏开始时间(仅状态不是matching时) */
     start_at: string,
     /** 结束时间（仅当状态是completed时) */
     completed_at: string,
     /** 游戏开局倒计时 */
     countdown_duration: number,
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
             user_id: number,
             position: PokerDir,
             /** 出的牌 */
             poker: PockerObj,
             /** 是否系统出牌 */
             system_play: boolean,
         },
         pick_ount_poker_one: {
             /** 抽牌的用户id */
             user_id: number,
             /** 抽到的牌数 */
             count: number,
         },
         skip_one: {
             /** 跳过的用户id */
             user_id: number,
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
         is_poker_playable: boolean,
         /** 出牌倒计时 */
         countdown_duration: number,
     },

     /** 当前第几小局 */
     rounds: number;
 }
