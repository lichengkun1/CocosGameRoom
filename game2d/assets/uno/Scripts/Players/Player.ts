// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Card from "../Game/Card/Card";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Player {
    id: number = 0;
    user_type: PlayerType = PlayerType.ThisPlayer;
    user_id: number = 123;
    user_name: string = 'user name...';
    user_avatar: string = "";
    /** 头像框 */
    user_headImage: cc.SpriteFrame = null;
    user_money: 0;
    cardsNumber = 0;
    /** 发牌器位置 */
    cardStack: cc.Node;
    /**  */
    cardNumberNode: cc.Label;
    /** 用户头像节点 */
    headImage: cc.Sprite;
    /** 用户名label */
    userName: cc.Label;
    /** 用户所拥有的的牌 */
    cards: Card[] = new Array<Card>();
    /** 用户所有牌的位置 */
    cardspos: cc.Vec3[] = new Array<cc.Vec3>();
    /** 用户剩下一张牌的时候所喊的uno节点 */
    UNO: cc.Node = null;
    /** 该用户的排名节点 */
    rankNode: cc.Node = null;
    /** 该用户被ban的节点 */
    abandonNode: cc.Node = null;
    
    challengeNode:cc.Node = null;
    challengeLabel:cc.Label = null;
    offlineNode: cc.Node = null;

}
export enum PlayerType {
    ThisPlayer,
    OtherPlayer
}
