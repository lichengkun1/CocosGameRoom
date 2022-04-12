
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_diceLogic extends cc.Component {

    @property(cc.SpriteAtlas)
    dicePointPlist:cc.SpriteAtlas = null;


    private diceLight:cc.Node = null;           //背景光;
    private dicePoint:cc.Node = null;
    private isInit:boolean = false;             //是否初始化了;

    start () {
        if(!this.isInit){
            this.init();
        }
    }

    init(){
        this.isInit = true;
        this.diceLight = this.node.getChildByName('diceLight');
        this.dicePoint = this.node.getChildByName('DicePoints');
    }
    
    rotationDiceLight(){
        let diceLight = this.diceLight;
        if(!diceLight){
            diceLight = this.node.getChildByName('diceLight');;
        }
        diceLight.active = true;
        let ro = cc.rotateBy(2,300);
        diceLight.runAction(cc.repeatForever(ro));
    }
    
    hideDiceLight(){
        if(!this.isInit){
            this.init();
        }
        this.diceLight.stopAllActions();
        this.diceLight.active = false;
    }

    //设置骰子点数;
    showDicePoint(number:number){
        if(!this.isInit){
            this.init();
        }
        this.dicePoint.active = true;
        this.dicePoint.getComponent(cc.Sprite).spriteFrame = this.dicePointPlist.getSpriteFrame(`dice_${number}`);;
    }

    //隐藏点数;
    hideDicePoint(){
        this.dicePoint.active = false;
    }
}
