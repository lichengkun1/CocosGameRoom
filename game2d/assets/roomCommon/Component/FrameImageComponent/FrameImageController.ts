

import FrameImage from "./FrameImage";
import FrameImageManager from "./FrameImageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FrameImageController extends cc.Component {
    
    static I: FrameImageController;
    @property(cc.Boolean)
    isLoad: boolean = true;
    @property(cc.Node)
    frameImages: cc.Node[] = [];

    onLoad() {
        if (this.isLoad)
            FrameImageController.I = this.node.getComponent(FrameImageController);
    }

    Init(uids) {
       
    }

    /** 设置所有玩家的头像框
     * @param uids 
     */
    SetAllUsersFrame(uids: Array<number>) {
        for (let i = 0; i < this.frameImages.length; i++) {
            const element = this.frameImages[i].getComponent(FrameImage);
            element.InitFrameImage(uids[i]);
        }
    }
    /** 设置某个玩家的头像框 
    */
    SetOneUserFrame(userNode: cc.Node, uid: number) {
        if (userNode) {
            let userFrame = userNode.getComponent(FrameImage);
            if (!userFrame)
                userFrame.InitFrameImage(uid);
        }
    }

}
