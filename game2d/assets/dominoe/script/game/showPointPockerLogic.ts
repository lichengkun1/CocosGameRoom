import Dominoe_GlobalGameData from "../Utils/Dominoe_GlobalGameData";
import Dominoe_paiLogic from "./Dominoe_paiLogic";

/**
 * 
 * 
 * 当点击底下的记牌器会显示的界面
 * 
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class showPointPockerLogic extends cc.Component {

    @property(cc.SpriteAtlas)
    pointAtlas:cc.SpriteAtlas = null;

    @property(cc.Node)
    pockers:cc.Node[] = [];

    @property(cc.Node)
    arrowNode:cc.Node = null;

    private showPoint:number = 0;
    
    start () {
         
    }

    setShowPoint(point:number){
        this.showPoint = point;
        this.showPocker();
    }

    showPocker() {
        this.arrowNode.x = -312 + this.showPoint * 100;
        let showData = Dominoe_GlobalGameData.pocker_object[this.showPoint.toString()];
        let isShow:boolean = false;
        let nums:number[] = [];
        for(let i = 0;i < 7;i++){
            nums = showData[i].points;
            isShow = showData[i]['isShow'];
            this.pockers[i].getComponent(Dominoe_paiLogic).setPaiShow(nums);
            if(isShow){
                this.pockers[i].getComponent(Dominoe_paiLogic).showMeng = true;
            }else{
                this.pockers[i].getComponent(Dominoe_paiLogic).showMeng = false;
            }
        }
    }

}
