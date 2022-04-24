
const {ccclass, property} = cc._decorator;

@ccclass
export default class Dominoe_stopPropagation extends cc.Component {

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
    }
}
