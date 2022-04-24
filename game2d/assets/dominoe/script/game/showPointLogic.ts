

/**
 * 
 * 记牌器组件
 * 
 */

import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class showPointLogic extends cc.Component {

    @property(cc.Integer)
    point: number = 0;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    touchStart() {
        this.node.opacity = 255;
        MyEvent.I.emit('showPoint_start', { point: this.point });
    }

    touchEnd() {
        this.node.opacity = 160;
        MyEvent.I.emit('showPoint_end');
    }

}
