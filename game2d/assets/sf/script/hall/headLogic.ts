

const {ccclass, property} = cc._decorator;

@ccclass
export default class headLogic extends cc.Component {

    @property(cc.Node)
    speakNode: cc.Node = null;

    private isSpeakType:boolean = false;
    start () {

    }

    setPlayerSpeakType(){
        if (this.isSpeakType) {
            return;
        }
        this.isSpeakType = true;
        this.speakNode.active = true;
        let peadDrag = this.speakNode.getComponent(dragonBones.ArmatureDisplay);
        peadDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            peadDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.isSpeakType = false;
            this.speakNode.active = false;
        }, this);
        peadDrag.playAnimation('newAnimation', 1);
    }

}
