import MessageType from "../Utils/MessageType";
import MyEvent from "../Utils/MyEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchSocket extends cc.Component {

    onLoad() {
        MyEvent.I.on(MessageType.MESSAGE_PLAYER, this.emit_messageFunc.bind(this), this.node);
    }

    emit_messageFunc(mData) {
        
    }
}
