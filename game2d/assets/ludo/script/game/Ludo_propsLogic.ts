
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_propsLogic extends cc.Component {

    private nodeType:number = -1;

    start () {
        /*
            PropUFO       = 1       ufo
            PropGold      = 2       金骰子
            PropInViCloak = 3       隐身衣
            PropRocket    = 4       火箭
        */

        let aniName = '';
        switch(this.nodeType)
        {
            case 1:
                aniName = 'UFO';
                break;
            case 2:
                aniName = 'shaizi';
                break;
            case 3:
                aniName = 'yinshenyi';
                break;
            case 4:
                aniName = 'feidan';
                break;
        }
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        drag.addEventListener(dragonBones.EventObject.COMPLETE,()=>{
            drag.removeEventListener(dragonBones.EventObject.COMPLETE);
            drag.playAnimation(`${aniName}_waiting`,0);
        },this);
        drag.playAnimation(`${aniName}_appear`,1);
    }

    setNodeType(type){
        this.nodeType = type;
    }

    getNodeType(){
        return this.nodeType;
    }

}
