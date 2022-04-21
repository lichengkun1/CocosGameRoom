// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerManager {
    static thisPlayer_user_id: number = 0;
    static players: Map<number, Player> = new Map<number, Player>();
    static SetPlayer(user_id: number, player: Player): void {
        console.log(user_id, player);

        this.players.set(user_id, player);
    }
    static GetPlayer(user_id: number): Player {
        user_id = user_id;
        let player = this.players.get(user_id);
        // if (!player)
        //     console.error("不存在user_id为：" + user_id + "的Player,请检查");
        return player;
    }
}
