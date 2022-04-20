import VoiceManager from "./VoiceManager";
import VoiceNode from "./VoiceNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceController extends cc.Component {

    @property(VoiceNode)
    voiceNodes: VoiceNode[] = [];

    onLoad() {
        VoiceManager.voiceController = this.node.getComponent(VoiceController);
    }
    Init(uids: number[]) {
        for (let i = 0; i < uids.length; i++) {
            this.voiceNodes[i].user_id = uids[i];
            this.voiceNodes[i].animation = this.voiceNodes[i].node.getComponent(dragonBones.ArmatureDisplay);
        }
    }
    InitNode() {
        for (let i = 0; i < this.voiceNodes.length; i++) {
            this.voiceNodes[i].animation = this.voiceNodes[i].node.getComponent(dragonBones.ArmatureDisplay);
        }
    }

    speak(uid: number) {
        let dra = this.GetVoiceNode(uid);
        if (!dra) return;
        dra.node.active = true;
        dra.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            dra.node.active = false;
            dra.removeEventListener(dragonBones.EventObject.COMPLETE);
        });
        dra.playAnimation('newAnimation', 1);

    }


    private GetVoiceNode(uid: number): dragonBones.ArmatureDisplay {
        for (let i = 0; i < this.voiceNodes.length; i++) {
            const element = this.voiceNodes[i];
            if (uid == element.user_id) {
                return element.animation;
            }
        }
        return null;
    }
}
