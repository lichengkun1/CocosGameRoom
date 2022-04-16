// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import MessageData from "../../../roomCommon/CommonScripts/Utils/MessageData";
import BaseComp from "../baseComp";
import Dominoe_gameLogic from "../game/Dominoe_gameLogic";
import { PlayerInfoModel } from "../models/gameStatusModel";
import RankItem from "./rankItem";

const {ccclass, property} = cc._decorator;

/**
 * 
 * 每一小局结束之后需要显示的排行榜信息
 * 
 */
@ccclass
export default class RankComp extends BaseComp {

    @property(cc.SpriteAtlas)
    roundAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    nextToastNode: cc.Node = null;

    @property(cc.Node)
    bottomNode: cc.Node = null;

    /** 默认第一小局 */
    public roundIndex: number = 1;

    /** 总倒计时 */
    private countDownTimes: number = 8;

    private totalTime: number = 0;
    /** 倒计时label */
    private countDownLable: cc.Label = null;
    /** 是否展示完毕 */
    public showOver: boolean = false;

    /** 是否开始倒计时 */
    private startCountDown: boolean = false;

    public onLoad(): void {
        this.initLanguage();
        const countDownNode = this.viewMap['bottom/countDown'];
        this.countDownLable = countDownNode.getComponent(cc.Label);
    }

    /** 展示每个人的排行榜信息*/
    showRankItems(players: PlayerInfoModel[]) {
        this.startCountDown = true;
        this.initLanguage();
        this.resetCountDownTimes();
        this.showRoundIndex();
        this.showPlayersRank(players);
    }

    private resetCountDownTimes(): void {
        this.countDownTimes = 8;
        this.countDownLable.string = this.countDownTimes + 's';

    }

    /**
     * 展示玩家排行信息
     * @param  {PlayerInfoModel[]} players 玩家信息
     * @returns void
     */
    private showPlayersRank(players: PlayerInfoModel[]): void {
        const middleNode = this.viewMap['center'];
        middleNode.removeAllChildren();
        for(let i = 0,len = players.length; i < len; i++) {
            
            const item = players[i];
            const rankItemNode = cc.instantiate(this.rankItemPrefab);
            const rankItemComp: RankItem = rankItemNode.getComponent(RankItem);
            rankItemComp.rankIndex = i;
            /** 初始化渲染数据 */
            rankItemComp.renderData = {
                id: item.id,
                name: item.name,
                avatar: item.avatar,
                single_score: item.single_score,
                total_score: item.total_score,
                poker_remain_list: item.poker_remain_list ? item.poker_remain_list : [],
            };
            rankItemNode.parent = middleNode;
            rankItemNode.x = 0;
            /** 展示排行 */
            rankItemComp.showRank();
        }

    }

    /**
     * 显示第几小局
     */
    private showRoundIndex() {
        const roundNode = this.viewMap['top/roundIndex'];
        const roundNode2 = this.viewMap['top/roundIndex2'];

        const roundSprite = roundNode.getComponent(cc.Sprite);
        const roundSprite2 = roundNode2.getComponent(cc.Sprite);

        if(this.roundIndex.toString().length === 1) {
            roundSprite.spriteFrame = this.roundAtlas.getSpriteFrame(this.roundIndex.toString());
        } else {
            // 这里暂定两位数字
            roundSprite.spriteFrame = this.roundAtlas.getSpriteFrame(Math.floor(this.roundIndex / 10).toString());
            roundSprite2.spriteFrame = this.roundAtlas.getSpriteFrame(Math.floor(this.roundIndex % 10).toString());
        }
    }

    /** 初始化国际化化语言 */
    private initLanguage(): void {
        const toastNode = this.viewMap['bottom/toast'];
        const toastLabel = toastNode.getComponent(cc.Label);
        toastLabel.string = (MessageData.langDominoe.next_round ? MessageData.langDominoe.next_round : MessageData.langDominoeEnglish.next_round) + ' in';
        console.log('labelString is ',toastLabel.string)
        this.scheduleOnce(() => {
            console.log('设置宽度');
            this.nextToastNode.width = this.bottomNode.width + 34;
        },0.1);
    }

    update(dt: number) {
        if(!this.startCountDown) return;
        this.totalTime += dt;
        if(this.totalTime >= 1) {
            this.countDownLable.string = --this.countDownTimes + 's';
            this.totalTime = 0;

            if(this.countDownTimes <= 0) {
                this.node.active = false;
                this.startCountDown = false;
            } 
        }
    }
    
}
