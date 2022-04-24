
const {ccclass, property} = cc._decorator;

@ccclass
export default class Dominoe_toastLogic extends cc.Component {

    @property(cc.Label)
    contentLabel: cc.Label = null;


    start () {
    }


    showTostFunc(text:string,deTime:number = 3){
        this.contentLabel.string = text;
        this.node.y = -380;
        let move = cc.moveTo(0.6,cc.v2(cc.v2(0,-100)));
        let dt = cc.delayTime(deTime);
        let call = cc.callFunc(()=>{
            this.node.destroy();
        });
        this.node.runAction(cc.sequence(move,dt,call));
    }
}
