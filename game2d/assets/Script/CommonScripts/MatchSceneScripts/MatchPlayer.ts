// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FrameImage from "../../FrameImageComponent/FrameImage";
import MessageData, { GameType } from "../Utils/MessageData";
import MessageManager from "../Utils/MessageManager";
import ResourcesManager from "../Utils/ResourcesManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayer extends cc.Component {

    @property(cc.SpriteFrame)
    headImage: cc.SpriteFrame = null;

    private actionNode: cc.Node = null;
    private playerHead: cc.Sprite = null;
    private icon_me: cc.Node = null;
    private nameLabel: cc.Label = null;
    private btn_follow: cc.Node = null;
    private followAction: cc.Node = null;
    public userID: number = 0;

    onLoad() {
        this.initNode();
    }
    initNode() {
        this.actionNode = this.node.getChildByName("actionNode");
        this.playerHead = this.node.getChildByName("playerHead").getComponent(cc.Sprite);
        this.icon_me = this.node.getChildByName("icon_me");
        this.nameLabel = this.node.getChildByName("nameLabel").getComponent(cc.Label);
        this.btn_follow = this.node.getChildByName("btn_follow");
        this.followAction = this.node.getChildByName("followAction");

        if (MessageData.gameType == GameType.single) {
            this.node.getChildByName("matchbg").active = false;
        }
    }
    public setPlayerData(data: { avatar: string, name: string, id: number }) {
        this.userID = data.id;
        this.icon_me.active = (data.id == MessageData.userId ? true : false);
        this.playerHead.spriteFrame = this.headImage;
        ResourcesManager.loadHeadImag(data.avatar, data.id, 2, (res: cc.Texture2D) => {
            res.packable = false;
            if (this.playerHead && res)
                this.playerHead.spriteFrame = new cc.SpriteFrame(res);
        });
        this.nameLabel.string = MessageManager.subNickName(data.name, 8);
        this.setPlayerFrame();
        this.showFollowBtn(data);
    }
    public setPlayerFrame() {
        this.node.getChildByName("playerFrame").getComponent(FrameImage).InitFrameImage(this.userID);
    }
    public showFollowBtn(data) {
        // this.btn_follow.active = false;
        // if (data.id != MessageData.userId) {
        //     if (MatchResData.playerFollow.indexOf(data.id) < 0) {
        //         MessageForRoom.isFollowedPlayer(data.id, (pid, flag) => {
        //             console.log(pid, flag);
        //             if (!flag) {
        //                 this.floowBtn(true, pid);
        //             } else {
        //                 this.floowBtn(false, pid);
        //             }
        //         });
        //     } else {
        //         this.floowBtn(false, data.id);
        //     }

        // }
    }
    public floowBtn(ison: boolean, pid: number) {
        // this.btn_follow.active = ison;
        // this.btn_follow.off(cc.Node.EventType.TOUCH_START);
        // if (ison) {
        //     this.btn_follow.on(cc.Node.EventType.TOUCH_START, () => {
        //         MessageForRoom.followedPlayer(pid, (id, isSuccess) => {
        //             if(isSuccess){
        //                 this.btn_follow.active = false;
        //                 MatchResData.playerFollow.push(pid);
        //                 this.btn_follow.off(cc.Node.EventType.TOUCH_START);
        //             }
        //         });
        //     });
        // }


    }
    public clearPlayerData(number) {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.playerHead.spriteFrame = null;
        this.node.getChildByName("playerFrame").getComponent(cc.Sprite).spriteFrame = null;
        this.icon_me.active = false;
        this.nameLabel.string = "player" + number;
        this.btn_follow.active = false;
        this.followAction.active = false;
    }
}
