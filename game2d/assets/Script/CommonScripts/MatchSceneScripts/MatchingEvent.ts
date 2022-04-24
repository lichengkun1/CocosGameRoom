import MessageData from "../Utils/MessageData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchingEvent extends cc.Component {

    onLoad(){

        this.node.addComponent(`${MessageData.gameName}_Matching`);
    }
}
