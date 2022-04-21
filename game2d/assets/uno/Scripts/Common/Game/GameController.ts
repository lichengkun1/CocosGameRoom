const { ccclass, property } = cc._decorator;

@ccclass
export class GameController {
    /**游戏是否暂停 */
    public static isGameStop: boolean = false;
}
