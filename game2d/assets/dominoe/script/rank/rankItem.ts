
import PlayerModel from "../../../ludo/script/models/player";
import BaseComp from "../../../Script/common/ui/baseComp";
import MessageData from "../../../Script/CommonScripts/Utils/MessageData";
import { PlayerInfoModel } from "../models/gameStatusModel";
import Dominoe_GlobalGameData from "../Utils/Dominoe_GlobalGameData";

const {ccclass, property} = cc._decorator;

export type PockerObj = {
    /** 服务端表示该牌的唯一索引 */
    Key: number,
    /** 剩余的牌 小数在前，大数在后 */
    nums: number[],
}

export interface RankObj {
    /** 个人信息 */
    playerInfo: Partial<PlayerModel>,
    /** 当前小局的得分 */
    score: number,
    /** 总分 */
    totalScore: number,
    /** 该小局结束之后剩余的牌 */
    remainPockerList: PockerObj[],
}

/**
 * 
 * 扑克工厂方法
 * 
 */
export class PockerFactory {

    /**
     * 创建一张牌 需要依赖图集资源
     * @param  {cc.Prefab} pockerPrefab
     * @param  {number[]} points
     */
    public static createPocker(pockerPrefab: cc.Prefab,points: number[]) {
        if(!pockerPrefab) return;

        const node = cc.instantiate(pockerPrefab);

        const topNumber = points[0];
        const bottomNumber = points[1];

        const topSprite = node.getChildByName('top').getComponent(cc.Sprite);
        const bottomSprite = node.getChildByName('bottom').getComponent(cc.Sprite);
        
    }
}

@ccclass
export default class RankItem extends BaseComp {

    @property({
        type: cc.SpriteAtlas,
        tooltip: "牌上需要的点的图片图集"
    })
    point2Atlas: cc.SpriteAtlas = null;

    @property(cc.Label)
    curScore: cc.Label = null;
    @property(cc.Label)
    totalScoreNode: cc.Label = null;

    public rankIndex: number = 0;
    private pokerPrefab: cc.Node = null;
    
    private playerInfo: PlayerModel;
    /** 当前小局的得分 */
    private score: number = 0;
    /** 总分 */
    private totalScore: number = 100;
    /** 该小局结束之后剩余的牌 */
    private remainPockerList: any[] = [];

    private _renderData: Partial<PlayerInfoModel> = null;

    set renderData(data: Partial<PlayerInfoModel>) {
        this._renderData = data;
    }

    get renderData() {
        return this._renderData;
    }

    onLoad() {
        this.pokerPrefab = this.viewMap['pocker'];
        this.initLanguage();
    }

    private initLanguage(): void {
        this.curScore.string = MessageData.langDominoe.score ? MessageData.langDominoe.score : MessageData.langDominoeEnglish.score;
        this.totalScoreNode.string = MessageData.langDominoe.total_score ? MessageData.langDominoe.total_score : "TOTAL";
    }

    public showRank(): void {
        if(Object.keys(this.viewMap).length === 0) return;
        if(!this.renderData) return;

        const data = this.renderData;
        // const playerInfo: Partial<PlayerModel> = data.playerInfo;
        this.showPlayerInfo(data.name,data.avatar);
        this.showScore(data.single_score,this.viewMap['cur']);
        this.showScore(data.total_score,this.viewMap['total']);
        this.showPocker(data.poker_remain_list);
        this.showRankIndex(this.rankIndex);
        this.showSelfBoard(data.id);
    }

    private showSelfBoard(id: number): void {
        if(Dominoe_GlobalGameData.userId === id) {
            const selfBoardNode = this.viewMap['selfBoard'];
            if(!this.rankIndex) {
                selfBoardNode.y = 0;
            } else {
                selfBoardNode.y = 4;
            }
            this.viewMap['selfBoard'].active = true;
        } else {
            this.viewMap['selfBoard'].active = false;
        }
    } 

    /**
     * 展示排行榜相关信息
     * @param  {number} index 当前是第几个排行榜元素 第一个和后面几个的背景板和计分板不同需要单独处理
     */
    private showRankIndex(index: number) {
        let rankBgStr = '';
        let scoreBgStr = '';
        if(!index) {
            rankBgStr = 'rank1_bg';
            scoreBgStr = 'score_bg1';
            this.node.height = 180;
        } else {
            rankBgStr = 'rank2_bg';
            scoreBgStr = 'score_bg';
        }

        const bgFrame = this.point2Atlas.getSpriteFrame(rankBgStr)
        this.viewMap['rankBg'].getComponent(cc.Sprite).spriteFrame = bgFrame;

        const scoreBg = this.point2Atlas.getSpriteFrame(scoreBgStr);

        this.viewMap['rankBg/scoreBg1'].getComponent(cc.Sprite).spriteFrame = scoreBg;
        this.viewMap['rankBg/scoreBg2'].getComponent(cc.Sprite).spriteFrame = scoreBg;
        const rankStr = `rank_${index + 1}`;
        const rankIndexFrame = this.point2Atlas.getSpriteFrame(rankStr);
        this.viewMap['rankBg/rankIndex'].getComponent(cc.Sprite).spriteFrame = rankIndexFrame;

    }

    /**
     * 显示用户信息
     * @param  {Partial<PlayerModel>} playerInfo 玩家信息
     */
    private showPlayerInfo(name: string,avatarUrl: string) {
        if(name) {
            const labelComp = this.viewMap['nickname'].getComponent(cc.Label);
            if(name.length > 10) {
                labelComp.string = name.slice(0,8) + '..';
            } else {
                labelComp.string = name;
            }
        }
        if(avatarUrl) {
            cc.loader.load({ url: avatarUrl, type: 'png' }, (err, res) => {
                if (err) {
                    return;
                }
                this.viewMap['rankBg/iconBg/icon'].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            });
        }
    }

    private showScore(scoreNumber: number | string, lableNode: cc.Node): void {
        if(!lableNode) return;
        const labelComp = lableNode.getComponent(cc.Label);
        labelComp.string = scoreNumber.toString();
    }

    /**
     * 展示排行榜上面的扑克
     * @param  {PockerObj[]} points 所有扑克的点数数组
     */
    private showPocker(points: PockerObj[]) {
        const pockerConNode = this.viewMap['rankBg/remainPai'];
        if(points.length <= 7) {
            pockerConNode.y = 19;
        } else {
            // 换行居中
            pockerConNode.y = 0;
        }
        points.forEach((item) => {
            this.createPocker(item.nums,pockerConNode);
        });
    }

     /**
      * 创建一张牌
      * @param  {number[]} points 创建的牌需要的点数数据
      * @param  {cc.Node} parent 创建的牌的父节点
      */
     private createPocker(points: number[],parent: cc.Node) {

        const node = cc.instantiate(this.pokerPrefab);

        const topNumber = points[0];
        const bottomNumber = points[1];

        const topSprite = node.getChildByName('top').getComponent(cc.Sprite);
        const bottomSprite = node.getChildByName('bottom').getComponent(cc.Sprite);

        const targetTopS = this.point2Atlas.getSpriteFrame(`point_${topNumber}`);
        const targetBottomS = this.point2Atlas.getSpriteFrame(`point_${bottomNumber}`);

        topSprite.spriteFrame = targetTopS;
        bottomSprite.spriteFrame = targetBottomS;
        node.parent = parent;
    }

}
