export interface LudoEquipment {
    game_ludo_board: number;
    game_ludo_dice: number;
    game_ludo_role: number;
}
/** 该玩家所拥有的的棋子对应的位置 */
export interface Pieces {
    [key:string]: number;
}

export interface Prop {
    // 道具的位置
    loc: number;
    // 道具的种类
    id: number;
}

/**
 * 
 * 玩家model
 * 
 */
export default class PlayerModel {
    /** 玩家头像 */
    public avatar: string = '';
    /** 砖石 */
    public diamond: number = 0;

    public frame_image: string = '';
    /** 玩家id */
    public id: number = 0;

    /** 是否是代理 */
    public is_agent: boolean = false;
    /** 玩家的座位 */
    public key: number = 1;

    public ludoEquipment: LudoEquipment;

    /** 玩家的名字 */
    public name: string = '';

    public pieces: Pieces;
    /** 道具只有玩家选择了使用道具才会有该数据 */
    public props: Prop[];

    public skip: number;

    /** 玩家的在线状态 */
    public status: string = 'online';

}